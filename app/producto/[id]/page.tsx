"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { MinusIcon, PlusIcon, ChevronLeftIcon } from "@heroicons/react/20/solid"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import { useCart } from "../../../hooks/useCart"
import { useProduct } from "../../../hooks/useProducts"

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("COP", "")
    .trim()
}

export default function ProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { addToCart } = useCart()
  const { product, loading, error } = useProduct(id || "")

  const [selectedVariant, setSelectedVariant] = useState<string>("")
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BF1330] mx-auto mb-4"></div>
            <p className="text-[#2A2823]">Cargando producto...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-title text-[#2A2823] mb-4">Producto no encontrado</h1>
            <p className="text-[#2A2823]/60 mb-4">{error || "El producto que buscas no existe"}</p>
            <button
              onClick={() => router.back()}
              className="btn-primary btn-large"
            >
              Volver
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Get available variants
  const availableVariants = product.variants.filter(v => v.is_active && v.stock > 0)
  const primaryVariant = selectedVariant 
    ? availableVariants.find(v => v.id === selectedVariant) 
    : availableVariants[0]

  if (!primaryVariant) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-title text-[#2A2823] mb-4">Producto no disponible</h1>
            <p className="text-[#2A2823]/60 mb-4">Este producto no tiene variantes disponibles</p>
            <button
              onClick={() => router.back()}
              className="btn-primary btn-large"
            >
              Volver
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const hasDiscount = primaryVariant.compare_at_price && primaryVariant.compare_at_price > primaryVariant.price
  const discountedPrice = hasDiscount ? primaryVariant.price : primaryVariant.price
  const originalPrice = hasDiscount ? primaryVariant.compare_at_price : primaryVariant.price
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0

  // Get product images
  const productImages = product.images.length > 0 ? product.images : [
    { url: "/placeholder.svg", alt_text: product.name, is_primary: true, sort_order: 0 }
  ]

  const handleAddToCart = () => {
    if (!selectedVariant && availableVariants.length > 0) {
      setSelectedVariant(availableVariants[0].id)
    }
    
    if (selectedVariant || availableVariants.length === 1) {
      const variantId = selectedVariant || availableVariants[0].id
      addToCart(product, variantId, quantity)
    }
  }

  const handleBuyNow = () => {
    if (!selectedVariant && availableVariants.length > 0) {
      setSelectedVariant(availableVariants[0].id)
    }
    
    if (selectedVariant || availableVariants.length === 1) {
      const variantId = selectedVariant || availableVariants[0].id
      addToCart(product, variantId, quantity)
      router.push("/carrito")
    }
  }

  const incrementQuantity = () => setQuantity((prev) => prev + 1)
  const decrementQuantity = () => setQuantity((prev) => Math.max(1, prev - 1))

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container-responsive py-element">
          {/* Breadcrumb */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#2A2823]/60 hover:text-[#2A2823] mb-element"
          >
            <ChevronLeftIcon className="h-5 w-5" />
            Volver
          </button>

          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-element">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={productImages[selectedImage]?.url || "/placeholder.svg"}
                  alt={productImages[selectedImage]?.alt_text || product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? "border-[#BF1330]" : "border-transparent"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={image.alt_text || product.name}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-title text-[#2A2823] mb-2">{product.name}</h1>
                <p className="text-body text-[#2A2823]/60">{product.short_description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center gap-2">
                {hasDiscount && (
                  <span className="price-original text-body">${formatCurrency(originalPrice)}</span>
                )}
                <span className="price-discounted text-title font-semibold">
                  ${formatCurrency(discountedPrice)}
                </span>
                {hasDiscount && (
                  <span className="discount-badge text-sm">-{discountPercentage}% OFF</span>
                )}
              </div>

              {/* Variants */}
              {availableVariants.length > 1 && (
                <div>
                  <h3 className="text-body-semibold text-[#2A2823] mb-2">Talla</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`px-4 py-2 border rounded-lg text-sm ${
                          selectedVariant === variant.id
                            ? "border-[#BF1330] bg-[#BF1330] text-white"
                            : "border-[#2A2823]/20 text-[#2A2823] hover:border-[#2A2823]/40"
                        }`}
                      >
                        {variant.attributes.size || variant.attributes.name || variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h3 className="text-body-semibold text-[#2A2823] mb-2">Cantidad</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decrementQuantity}
                    className="p-2 border border-[#2A2823]/20 rounded-lg hover:border-[#2A2823]/40"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-body">{quantity}</span>
                  <button
                    onClick={incrementQuantity}
                    className="p-2 border border-[#2A2823]/20 rounded-lg hover:border-[#2A2823]/40"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={handleAddToCart}
                  className="btn-secondary btn-large flex-1"
                  disabled={!selectedVariant && availableVariants.length > 1}
                >
                  Agregar al Carrito
                </button>
                <button
                  onClick={handleBuyNow}
                  className="btn-primary btn-large flex-1"
                  disabled={!selectedVariant && availableVariants.length > 1}
                >
                  Comprar Ahora
                </button>
              </div>

              {/* Description */}
              {product.description && (
                <div>
                  <h3 className="text-body-semibold text-[#2A2823] mb-2">Descripción</h3>
                  <p className="text-body text-[#2A2823]/60">{product.description}</p>
                </div>
              )}

              {/* Product Details */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-label text-[#2A2823]/60">SKU:</span>
                  <span className="text-label text-[#2A2823]">{product.sku}</span>
                </div>
                {product.brand && (
                  <div className="flex justify-between">
                    <span className="text-label text-[#2A2823]/60">Marca:</span>
                    <span className="text-label text-[#2A2823]">{product.brand}</span>
                  </div>
                )}
                {product.weight && (
                  <div className="flex justify-between">
                    <span className="text-label text-[#2A2823]/60">Peso:</span>
                    <span className="text-label text-[#2A2823]">{product.weight} kg</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
