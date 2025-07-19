"use client"

import React, { createContext, useContext, useReducer, useEffect } from "react"
import { Product, ProductVariant } from "../lib/api"
import { apiClient } from "../lib/api"

interface CartItem {
  id: string
  product: Product
  variant: ProductVariant
  quantity: number
}

interface CartState {
  items: CartItem[]
  totalAmount: number
  totalItems: number
  loading: boolean
  error: string | null
}

type CartAction =
  | { type: "LOAD_CART"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: { product: Product; variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { productId: string; variantId: string } }
  | { type: "UPDATE_QUANTITY"; payload: { productId: string; variantId: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "LOAD_CART":
      const loadedItems = action.payload
      const loadedTotalAmount = loadedItems.reduce(
        (total, item) => total + item.variant.price * item.quantity,
        0
      )
      const loadedTotalItems = loadedItems.reduce((total, item) => total + item.quantity, 0)
      
      return {
        ...state,
        items: loadedItems,
        totalAmount: loadedTotalAmount,
        totalItems: loadedTotalItems,
        loading: false,
        error: null,
      }

    case "ADD_ITEM": {
      const { product, variantId, quantity } = action.payload
      const variant = product.variants.find(v => v.id === variantId)
      
      if (!variant) {
        return { ...state, error: "Variant not found" }
      }

      const existingItemIndex = state.items.findIndex(
        item => item.product.id === product.id && item.variant.id === variantId
      )

      let updatedItems
      if (existingItemIndex >= 0) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      } else {
        const newItem: CartItem = {
          id: `${product.id}-${variantId}`,
          product,
          variant,
          quantity,
        }
        updatedItems = [...state.items, newItem]
      }

      const totalAmount = updatedItems.reduce(
        (total, item) => total + item.variant.price * item.quantity,
        0
      )
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)

      return {
        ...state,
        items: updatedItems,
        totalAmount,
        totalItems,
        error: null,
      }
    }

    case "REMOVE_ITEM": {
      const { productId, variantId } = action.payload
      const updatedItems = state.items.filter(
        item => !(item.product.id === productId && item.variant.id === variantId)
      )

      const totalAmount = updatedItems.reduce(
        (total, item) => total + item.variant.price * item.quantity,
        0
      )
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)

      return {
        ...state,
        items: updatedItems,
        totalAmount,
        totalItems,
        error: null,
      }
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload
      const updatedItems = state.items.map(item =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity: Math.max(0, quantity) }
          : item
      ).filter(item => item.quantity > 0)

      const totalAmount = updatedItems.reduce(
        (total, item) => total + item.variant.price * item.quantity,
        0
      )
      const totalItems = updatedItems.reduce((total, item) => total + item.quantity, 0)

      return {
        ...state,
        items: updatedItems,
        totalAmount,
        totalItems,
        error: null,
      }
    }

    case "CLEAR_CART":
      return {
        ...state,
        items: [],
        totalAmount: 0,
        totalItems: 0,
        error: null,
      }

    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload,
      }

    case "SET_ERROR":
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addToCart: (product: Product, variantId: string, quantity: number) => Promise<void>
  removeFromCart: (productId: string, variantId: string) => Promise<void>
  updateQuantity: (productId: string, variantId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  syncWithServer: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalAmount: 0,
    totalItems: 0,
    loading: false,
    error: null,
  })

  // Load cart from server on mount
  useEffect(() => {
    syncWithServer()
  }, [])

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem("zodiaco-cart", JSON.stringify(state.items))
    } else {
      localStorage.removeItem("zodiaco-cart")
    }
  }, [state.items])

  const syncWithServer = async () => {
    if (!apiClient.isAuthenticated()) {
      // If not authenticated, load from localStorage
      const savedCart = localStorage.getItem("zodiaco-cart")
      if (savedCart) {
        try {
          const cartItems = JSON.parse(savedCart)
          dispatch({ type: "LOAD_CART", payload: cartItems })
        } catch (error) {
          console.error("Error loading cart from localStorage:", error)
        }
      }
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    
    try {
      const response = await apiClient.getCart()
      if (response.data) {
        // Convert server cart items to local format
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        }))
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } else {
        dispatch({ type: "SET_ERROR", payload: response.error || "Failed to load cart" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to sync cart with server" })
    }
  }

  const addToCart = async (product: Product, variantId: string, quantity: number) => {
    if (!apiClient.isAuthenticated()) {
      // Local cart for non-authenticated users
      dispatch({ type: "ADD_ITEM", payload: { product, variantId, quantity } })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    
    try {
      const response = await apiClient.addToCart(product.id, variantId, quantity)
      if (response.data) {
        // Convert server cart items to local format
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        }))
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } else {
        dispatch({ type: "SET_ERROR", payload: response.error || "Failed to add item to cart" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" })
    }
  }

  const removeFromCart = async (productId: string, variantId: string) => {
    if (!apiClient.isAuthenticated()) {
      // Local cart for non-authenticated users
      dispatch({ type: "REMOVE_ITEM", payload: { productId, variantId } })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    
    try {
      const response = await apiClient.removeFromCart(`${productId}-${variantId}`)
      if (response.data) {
        // Convert server cart items to local format
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        }))
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } else {
        dispatch({ type: "SET_ERROR", payload: response.error || "Failed to remove item from cart" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" })
    }
  }

  const updateQuantity = async (productId: string, variantId: string, quantity: number) => {
    if (!apiClient.isAuthenticated()) {
      // Local cart for non-authenticated users
      dispatch({ type: "UPDATE_QUANTITY", payload: { productId, variantId, quantity } })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    
    try {
      const response = await apiClient.updateCartItem(`${productId}-${variantId}`, quantity)
      if (response.data) {
        // Convert server cart items to local format
        const cartItems: CartItem[] = response.data.items.map((item: any) => ({
          id: item.id,
          product: item.product,
          variant: item.variant,
          quantity: item.quantity,
        }))
        dispatch({ type: "LOAD_CART", payload: cartItems })
      } else {
        dispatch({ type: "SET_ERROR", payload: response.error || "Failed to update cart item" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update cart item" })
    }
  }

  const clearCart = async () => {
    if (!apiClient.isAuthenticated()) {
      // Local cart for non-authenticated users
      dispatch({ type: "CLEAR_CART" })
      return
    }

    dispatch({ type: "SET_LOADING", payload: true })
    
    try {
      const response = await apiClient.clearCart()
      if (response.data) {
        dispatch({ type: "CLEAR_CART" })
      } else {
        dispatch({ type: "SET_ERROR", payload: response.error || "Failed to clear cart" })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" })
    }
  }

  return (
    <CartContext.Provider value={{ 
      state, 
      addToCart, 
      removeFromCart, 
      updateQuantity, 
      clearCart,
      syncWithServer 
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return {
    items: context.state.items,
    totalAmount: context.state.totalAmount,
    totalItems: context.state.totalItems,
    loading: context.state.loading,
    error: context.state.error,
    addToCart: context.addToCart,
    removeFromCart: context.removeFromCart,
    updateQuantity: context.updateQuantity,
    clearCart: context.clearCart,
    syncWithServer: context.syncWithServer,
  }
}
