export interface Product {
  id: string
  name: string
  price: number
  discount?: number
  image: string
  images?: string[]
  sizes: string[]
  category: "hombres" | "mujer"
  subcategory?: string
  description?: string
  ref?: string
}

export interface CartItem {
  product: Product
  size: string
  quantity: number
}
