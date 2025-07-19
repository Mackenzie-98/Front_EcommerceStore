import Link from "next/link"
import { Product } from "../lib/api"

interface ProductCardProps {
  product: Product
}

const formatCurrency = (amount: number): string => {
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

export default function ProductCard({ product }: ProductCardProps) {
  // Add null checks and default values
  if (!product || !product.variants || !product.images) {
    return null
  }

  // Get the primary variant for pricing
  const primaryVariant = product.variants.find(v => v.is_active) || product.variants[0]
  const primaryImage = product.images.find(img => img.is_primary) || product.images[0]
  
  if (!primaryVariant) {
    return null
  }

  const hasDiscount = primaryVariant.compare_at_price && primaryVariant.compare_at_price > primaryVariant.price
  const discountedPrice = hasDiscount ? primaryVariant.price : primaryVariant.price
  const originalPrice = hasDiscount ? primaryVariant.compare_at_price : primaryVariant.price
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)
    : 0

  // Get available sizes from variants with null checks
  const availableSizes = product.variants
    .filter(v => v.is_active && v.stock > 0 && v.attributes)
    .map(v => v.attributes.size || v.attributes.name)
    .filter(Boolean)

  return (
    <Link
      href={`/producto/${product.id}`}
      className="flex flex-col gap-1 mobile:gap-inline hover:scale-105 transition-transform duration-200 group"
    >
      <div className="h-[180px] mobile:h-[220px] tablet:h-[248px] bg-gray-100 overflow-hidden rounded-lg border border-[#2A2823]/10 group-hover:border-[#2A2823]/20 transition-colors">
        <img
          src={primaryImage?.url || "/placeholder.svg"}
          alt={primaryImage?.alt_text || product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>
      <div className="flex flex-col gap-1 mobile:gap-inline px-1 mobile:px-0">
        <h3 className="text-sm mobile:text-body-semibold text-[#2A2823] capitalize line-clamp-2">
          {product.name}
        </h3>
        {availableSizes.length > 0 && (
          <p className="text-xs mobile:text-label text-[#2A2823]/60 hidden mobile:block">
            {availableSizes.slice(0, 3).join(" - ")}
            {availableSizes.length > 3 && "..."}
          </p>
        )}
        {hasDiscount && (
          <div className="discount-badge self-start text-xs mobile:text-sm">-{discountPercentage}% OFF</div>
        )}
        <div className="flex items-center gap-1 mobile:gap-inline">
          {hasDiscount && (
            <span className="price-original text-xs mobile:text-body">
              ${formatCurrency(originalPrice)}
            </span>
          )}
          <span className="price-discounted text-sm mobile:text-body font-semibold">
            ${formatCurrency(discountedPrice)}
          </span>
        </div>
      </div>
    </Link>
  )
}
