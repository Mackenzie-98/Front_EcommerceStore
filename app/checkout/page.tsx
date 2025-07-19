"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useCart } from "../../hooks/useCart"

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalAmount, clearCart } = useCart()
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    paymentMethod: "card",
  })

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simular procesamiento del pedido
    alert("¡Pedido realizado con éxito!")
    clearCart()
    router.push("/cuenta")
  }

  if (items.length === 0) {
    router.push("/carrito")
    return null
  }

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container-responsive" style={{ marginTop: "32px" }}>
          <div className="grid grid-cols-1 tablet:grid-cols-2 gap-section">
            {/* Formulario de Checkout */}
            <div className="space-y-element">
              <form onSubmit={handleSubmit} className="space-y-element">
                {/* Información de Contacto */}
                <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                  <h2 className="text-body-semibold text-[#2A2823] mb-element">Información de Contacto</h2>
                  <input
                    type="email"
                    name="email"
                    placeholder="Correo electrónico"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                  />
                </div>

                {/* Información de Envío */}
                <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                  <h2 className="text-body-semibold text-[#2A2823] mb-element">Información de Envío</h2>
                  <div className="space-y-inline">
                    <div className="grid grid-cols-2 gap-inline">
                      <input
                        type="text"
                        name="firstName"
                        placeholder="Nombre"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                      />
                      <input
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                      />
                    </div>
                    <input
                      type="text"
                      name="address"
                      placeholder="Dirección"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                    />
                    <div className="grid grid-cols-2 gap-inline">
                      <input
                        type="text"
                        name="city"
                        placeholder="Ciudad"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                      />
                      <input
                        type="text"
                        name="postalCode"
                        placeholder="Código Postal"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        required
                        className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                      />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      placeholder="Teléfono"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                    />
                  </div>
                </div>

                {/* Método de Pago */}
                <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                  <h2 className="text-body-semibold text-[#2A2823] mb-element">Método de Pago</h2>
                  <div className="space-y-inline">
                    <label className="flex items-center gap-inline">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === "card"}
                        onChange={handleInputChange}
                        className="text-[#BF1330] focus:ring-[#BF1330]"
                      />
                      <span className="text-label text-[#2A2823]">Tarjeta de Crédito/Débito</span>
                    </label>
                    <label className="flex items-center gap-inline">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pse"
                        checked={formData.paymentMethod === "pse"}
                        onChange={handleInputChange}
                        className="text-[#BF1330] focus:ring-[#BF1330]"
                      />
                      <span className="text-label text-[#2A2823]">PSE</span>
                    </label>
                    <label className="flex items-center gap-inline">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === "cash"}
                        onChange={handleInputChange}
                        className="text-[#BF1330] focus:ring-[#BF1330]"
                      />
                      <span className="text-label text-[#2A2823]">Pago Contra Entrega</span>
                    </label>
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-xlarge w-full">
                  Realizar Pedido
                </button>
              </form>
            </div>

            {/* Resumen del Pedido */}
            <div className="space-y-element">
              <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element sticky top-4">
                <h2 className="text-body-semibold text-[#2A2823] mb-element">Resumen del Pedido</h2>

                <div className="space-y-inline mb-element">
                  {items.map((item) => {
                    const hasDiscount = item.product.discount && item.product.discount > 0
                    const price = hasDiscount
                      ? item.product.price * (1 - item.product.discount / 100)
                      : item.product.price

                    return (
                      <div key={`${item.product.id}-${item.size}`} className="flex gap-inline">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                          <img
                            src={item.product.image || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-label text-[#2A2823] font-medium truncate">{item.product.name}</h3>
                          <p className="text-label-small text-[#2A2823]/60">Talla: {item.size}</p>
                          <p className="text-label-small text-[#2A2823]/60">Cantidad: {item.quantity}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-label text-[#2A2823] font-medium">
                            ${formatCurrency(price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                <div className="border-t border-[#2A2823]/20 pt-element space-y-inline">
                  <div className="flex justify-between items-center">
                    <span className="text-label text-[#2A2823]">Subtotal</span>
                    <span className="text-label text-[#2A2823]">${formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-label text-[#2A2823]">Envío</span>
                    <span className="text-label text-[#2A2823]">Gratis</span>
                  </div>
                  <div className="flex justify-between items-center font-semibold border-t border-[#2A2823]/20 pt-inline">
                    <span className="text-body-semibold text-[#2A2823]">Total</span>
                    <span className="text-body-semibold text-[#2A2823]">${formatCurrency(totalAmount)} COP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
