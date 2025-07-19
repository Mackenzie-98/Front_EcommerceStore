// API Service Layer for E-commerce Frontend
// Connects to Flask backend with proper error handling and authentication

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// Types for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Authentication types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}

// Product types
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category_id: string;
  brand: string;
  tags: string[];
  is_active: boolean;
  is_featured: boolean;
  weight: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  meta_title: string;
  meta_description: string;
  variants: ProductVariant[];
  images: ProductImage[];
  reviews: Review[];
  created_at: string;
  updated_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  name: string;
  price: number;
  compare_at_price: number;
  cost: number;
  stock: number;
  low_stock_threshold: number;
  attributes: Record<string, any>;
  images: string[];
  is_active: boolean;
}

export interface ProductImage {
  id: string;
  product_id: string;
  variant_id?: string;
  url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string;
  comment: string;
  is_verified_purchase: boolean;
  helpful_count: number;
  images: string[];
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image_url: string;
  parent_id?: string;
  is_active: boolean;
  sort_order: number;
  meta_title: string;
  meta_description: string;
}

// Cart types
export interface CartItem {
  id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  product: Product;
  variant: ProductVariant;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

// Order types
export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  payment_method: string;
  payment_status: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  product: Product;
  variant: ProductVariant;
}

export interface Address {
  id: string;
  user_id: string;
  type: 'shipping' | 'billing';
  first_name: string;
  last_name: string;
  company: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  phone: string;
  is_default: boolean;
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
}

// API Client class
class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.loadToken();
  }

  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  private setToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  private clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          throw new Error('Unauthorized - Please login again');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const responseData = await response.json();
      
      // Handle different response formats from backend
      let data: any;
      if (responseData.products) {
        // Backend returns { products: [...] }
        data = responseData.products;
      } else if (responseData.product) {
        // Backend returns { product: {...} }
        data = responseData.product;
      } else if (responseData.categories) {
        // Backend returns { categories: [...] }
        data = responseData.categories;
      } else if (responseData.pagination) {
        // Backend returns { products: [...], pagination: {...} }
        data = {
          data: responseData.products || [],
          pagination: responseData.pagination
        };
      } else {
        // Direct data response
        data = responseData;
      }
      
      return { data };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'An unknown error occurred',
      };
    }
  }

  // Authentication methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.data) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.data) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    const response = await this.request<void>('/auth/logout', {
      method: 'POST',
    });

    this.clearToken();
    return response;
  }

  async refreshToken(): Promise<ApiResponse<{ access_token: string }>> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      return { error: 'No refresh token available' };
    }

    const response = await this.request<{ access_token: string }>('/auth/refresh', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${refreshToken}`,
      },
    });

    if (response.data) {
      this.setToken(response.data.access_token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request<User>('/users/me');
  }

  // Product methods
  async getProducts(params?: {
    q?: string;
    category?: string;
    brand?: string;
    min_price?: number;
    max_price?: number;
    in_stock?: boolean;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<PaginatedResponse<Product>>> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
    }

    const queryString = searchParams.toString();
    const endpoint = queryString ? `/products?${queryString}` : '/products';
    
    return this.request<PaginatedResponse<Product>>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<Product>> {
    return this.request<Product>(`/products/${id}`);
  }

  async getFeaturedProducts(limit: number = 10): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/featured?limit=${limit}`);
  }

  async getCategories(): Promise<ApiResponse<Category[]>> {
    return this.request<Category[]>('/products/categories');
  }

  async getCategoryProducts(
    categoryId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Product>>> {
    return this.request<PaginatedResponse<Product>>(
      `/products/categories/${categoryId}/products?page=${page}&limit=${limit}`
    );
  }

  async getRelatedProducts(productId: string, limit: number = 5): Promise<ApiResponse<Product[]>> {
    return this.request<Product[]>(`/products/${productId}/related?limit=${limit}`);
  }

  async getProductReviews(
    productId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<ApiResponse<PaginatedResponse<Review>>> {
    return this.request<PaginatedResponse<Review>>(
      `/products/${productId}/reviews?page=${page}&limit=${limit}`
    );
  }

  async addProductReview(
    productId: string,
    review: {
      rating: number;
      title?: string;
      comment?: string;
    }
  ): Promise<ApiResponse<Review>> {
    return this.request<Review>(`/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review),
    });
  }

  // Cart methods
  async getCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart');
  }

  async addToCart(
    productId: string,
    variantId: string,
    quantity: number
  ): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        variant_id: variantId,
        quantity,
      }),
    });
  }

  async updateCartItem(
    itemId: string,
    quantity: number
  ): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: JSON.stringify({ quantity }),
    });
  }

  async removeFromCart(itemId: string): Promise<ApiResponse<Cart>> {
    return this.request<Cart>(`/cart/items/${itemId}`, {
      method: 'DELETE',
    });
  }

  async clearCart(): Promise<ApiResponse<Cart>> {
    return this.request<Cart>('/cart', {
      method: 'DELETE',
    });
  }

  // Order methods
  async createOrder(orderData: {
    items: Array<{
      product_id: string;
      variant_id: string;
      quantity: number;
    }>;
    shipping_address: Omit<Address, 'id' | 'user_id' | 'type'>;
    billing_address: Omit<Address, 'id' | 'user_id' | 'type'>;
    payment_method: string;
  }): Promise<ApiResponse<Order>> {
    return this.request<Order>('/orders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  }

  async getOrders(page: number = 1, limit: number = 20): Promise<ApiResponse<PaginatedResponse<Order>>> {
    return this.request<PaginatedResponse<Order>>(`/orders?page=${page}&limit=${limit}`);
  }

  async getOrder(orderId: string): Promise<ApiResponse<Order>> {
    return this.request<Order>(`/orders/${orderId}`);
  }

  // User methods
  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<ApiResponse<User>> {
    return this.request<User>('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    current_password: string;
    new_password: string;
  }): Promise<ApiResponse<void>> {
    return this.request<void>('/users/change-password', {
      method: 'POST',
      body: JSON.stringify(passwordData),
    });
  }

  async getAddresses(): Promise<ApiResponse<Address[]>> {
    return this.request<Address[]>('/users/addresses');
  }

  async addAddress(addressData: Omit<Address, 'id' | 'user_id'>): Promise<ApiResponse<Address>> {
    return this.request<Address>('/users/addresses', {
      method: 'POST',
      body: JSON.stringify(addressData),
    });
  }

  async updateAddress(
    addressId: string,
    addressData: Partial<Omit<Address, 'id' | 'user_id'>>
  ): Promise<ApiResponse<Address>> {
    return this.request<Address>(`/users/addresses/${addressId}`, {
      method: 'PUT',
      body: JSON.stringify(addressData),
    });
  }

  async deleteAddress(addressId: string): Promise<ApiResponse<void>> {
    return this.request<void>(`/users/addresses/${addressId}`, {
      method: 'DELETE',
    });
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export API client instance
export const apiClient = new ApiClient(API_BASE_URL);

// Export individual methods for convenience
export const {
  login,
  register,
  logout,
  refreshToken,
  getCurrentUser,
  getProducts,
  getProduct,
  getFeaturedProducts,
  getCategories,
  getCategoryProducts,
  getRelatedProducts,
  getProductReviews,
  addProductReview,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  createOrder,
  getOrders,
  getOrder,
  updateProfile,
  changePassword,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  isAuthenticated,
  getToken,
} = apiClient; 