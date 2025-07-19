"use client"

import { useState, useEffect } from 'react'
import { apiClient, Product, Category, PaginatedResponse } from '../lib/api'

interface UseProductsReturn {
  products: Product[]
  categories: Category[]
  loading: boolean
  error: string | null
  pagination: PaginatedResponse<Product>['pagination'] | null
  fetchProducts: (params?: {
    q?: string
    category?: string
    brand?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    sort?: string
    page?: number
    limit?: number
  }) => Promise<void>
  fetchCategories: () => Promise<void>
  fetchFeaturedProducts: () => Promise<void>
  fetchCategoryProducts: (categoryId: string, page?: number, limit?: number) => Promise<void>
}

export function useProducts(): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState<PaginatedResponse<Product>['pagination'] | null>(null)

  const fetchProducts = async (params?: {
    q?: string
    category?: string
    brand?: string
    min_price?: number
    max_price?: number
    in_stock?: boolean
    sort?: string
    page?: number
    limit?: number
  }) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getProducts(params)
      if (response.data) {
        setProducts(response.data.data)
        setPagination(response.data.pagination)
      } else {
        setError(response.error || 'Failed to fetch products')
      }
    } catch (err) {
      setError('An error occurred while fetching products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getCategories()
      if (response.data) {
        setCategories(response.data)
      } else {
        setError(response.error || 'Failed to fetch categories')
      }
    } catch (err) {
      setError('An error occurred while fetching categories')
    } finally {
      setLoading(false)
    }
  }

  const fetchFeaturedProducts = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getFeaturedProducts(10)
      if (response.data) {
        setProducts(response.data)
        setPagination(null)
      } else {
        setError(response.error || 'Failed to fetch featured products')
      }
    } catch (err) {
      setError('An error occurred while fetching featured products')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategoryProducts = async (categoryId: string, page: number = 1, limit: number = 20) => {
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getCategoryProducts(categoryId, page, limit)
      if (response.data) {
        setProducts(response.data.data)
        setPagination(response.data.pagination)
      } else {
        setError(response.error || 'Failed to fetch category products')
      }
    } catch (err) {
      setError('An error occurred while fetching category products')
    } finally {
      setLoading(false)
    }
  }

  return {
    products,
    categories,
    loading,
    error,
    pagination,
    fetchProducts,
    fetchCategories,
    fetchFeaturedProducts,
    fetchCategoryProducts,
  }
}

// Hook for single product
export function useProduct(productId: string) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchProduct = async () => {
    if (!productId) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await apiClient.getProduct(productId)
      if (response.data) {
        setProduct(response.data)
      } else {
        setError(response.error || 'Product not found')
      }
    } catch (err) {
      setError('An error occurred while fetching the product')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [productId])

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  }
} 