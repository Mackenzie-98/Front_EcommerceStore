"use client"

import { MinusIcon, PlusIcon, TrashIcon } from "@heroicons/react/20/solid"
import Link from "next/link"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useCart } from "../../hooks/useCart"

export default function CartPage() {
  const { items, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart()

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

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="container-responsive text-center py-section">
            <div className="max-w-md mx-auto">
              <div className="w-24 h-24 bg-[#2A2823]/10 rounded-full flex items-center justify-center mx-auto mb-element">
                <span className="text-4xl">🛒</span>
              </div>
              <h2 className="text-subtitle font-semibold text-[#2A2823] mb-inline">Tu carrito está vacío</h2>
              <p className="text-body text-[#2A2823]/60 mb-element">Agrega algunos productos para comenzar a comprar</p>
              <Link href="/" className="btn-primary btn-xlarge">
                Continuar comprando
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container-responsive" style={{ marginTop: "32px" }}>
          <div className="flex flex-col gap-section">
            {/* Cart Items */}
            <div className="flex flex-col gap-element">
              {items.map((item) => {
                const hasDiscount = item.product.discount && item.product.discount > 0
                const price = hasDiscount ? item.product.price * (1 - item.product.discount / 100) : item.product.price

                return (
                  <div
                    key={`${item.product.id}-${item.size}`}
                    className="flex gap-element p-element border border-[#2A2823]/20 rounded-lg bg-white"
                  >
                    {/* Product Image */}
                    <Link href={`/producto/${item.product.id}`} className="shrink-0">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    </Link>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-inline">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/producto/${item.product.id}`}
                            className="text-body-semibold text-[#2A2823] hover:text-[#BF1330] transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>
                          <p className="text-label text-[#2A2823]/60">Talla: {item.size}</p>
                          {item.product.ref && <p className="text-label text-[#2A2823]/60">{item.product.ref}</p>}
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="text-[#2A2823]/40 hover:text-[#BF1330] transition-colors p-1 ml-2"
                          title="Eliminar producto"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex justify-between items-center">
                        {/* Quantity Controls */}
                        <div className="flex h-8 overflow-hidden rounded-lg border border-[#2A2823]/40">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                            className="w-8 bg-[#2A2823] text-[#F8FBF8] flex items-center justify-center hover:bg-[#4F4F4F] transition-colors"
                          >
                            <MinusIcon className="w-3 h-3" />
                          </button>
                          <div className="px-3 bg-white flex items-center justify-center min-w-[40px]">
                            <span className="text-label text-[#2A2823]">{item.quantity}</span>
                          </div>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                            className="w-8 bg-[#2A2823] text-[#F8FBF8] flex items-center justify-center hover:bg-[#4F4F4F] transition-colors"
                          >
                            <PlusIcon className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-body-semibold text-[#2A2823]">${formatCurrency(price * item.quantity)}</p>
                          {item.quantity > 1 && (
                            <p className="text-label text-[#2A2823]/60">${formatCurrency(price)} c/u</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Cart Summary */}
            <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
              <div className="flex justify-between items-center mb-element">
                <span className="text-subtitle font-semibold text-[#2A2823]">Total</span>
                <span className="text-subtitle font-semibold text-[#2A2823]">${formatCurrency(totalAmount)} COP</span>
              </div>

              <div className="flex flex-col gap-inline">
                <Link href="/checkout" className="btn-primary btn-xlarge w-full text-center">
                  Proceder al pago
                </Link>
                <Link href="/" className="btn-secondary btn-xlarge w-full text-center">
                  Continuar comprando
                </Link>
              </div>

              <button
                onClick={clearCart}
                className="w-full mt-element text-label text-[#2A2823]/60 hover:text-[#BF1330] transition-colors"
              >
                Vaciar carrito
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
