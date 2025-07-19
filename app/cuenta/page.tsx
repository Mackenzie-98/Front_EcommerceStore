"use client"

import { useState } from "react"
import Header from "../../components/Header"
import Footer from "../../components/Footer"
import { useCart } from "../../hooks/useCart"

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("perfil")
  const { items } = useCart()

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2024-01-15",
      status: "Entregado",
      total: 418000,
      items: 2,
    },
    {
      id: "ORD-002",
      date: "2024-01-10",
      status: "En tránsito",
      total: 245000,
      items: 1,
    },
  ]

  const mockWishlist = [
    {
      id: "1",
      name: "Pantalón Clásico Hombre",
      price: 209000,
      discount: 20,
      image: "/images/product-1.png",
    },
  ]

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

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container-responsive" style={{ marginTop: "32px" }}>
          {/* Tabs */}
          <div className="flex gap-inline mb-section border-b border-[#2A2823]/20">
            {["perfil", "pedidos", "wishlist", "configuracion"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`tab ${activeTab === tab ? "tab-active" : "tab-inactive"}`}
              >
                {tab === "perfil" && "Perfil"}
                {tab === "pedidos" && "Mis Pedidos"}
                {tab === "wishlist" && "Lista de Deseos"}
                {tab === "configuracion" && "Configuración"}
              </button>
            ))}
          </div>

          {/* Content */}
          {activeTab === "perfil" && (
            <div className="max-w-md">
              <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                <h2 className="text-body-semibold text-[#2A2823] mb-element">Información Personal</h2>
                <form className="space-y-inline">
                  <input
                    type="text"
                    placeholder="Nombre"
                    defaultValue="Juan"
                    className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                  />
                  <input
                    type="text"
                    placeholder="Apellido"
                    defaultValue="Pérez"
                    className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                  />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    defaultValue="juan.perez@email.com"
                    className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                  />
                  <input
                    type="tel"
                    placeholder="Teléfono"
                    defaultValue="+57 300 123 4567"
                    className="w-full h-10 px-4 border border-[#2A2823]/40 rounded-lg bg-transparent text-[#2A2823] placeholder:text-[#2A2823]/60 focus:outline-none focus:border-[#2A2823] text-label"
                  />
                  <button type="submit" className="btn-primary btn-xlarge w-full">
                    Guardar Cambios
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === "pedidos" && (
            <div className="space-y-element">
              <h2 className="text-body-semibold text-[#2A2823]">Historial de Pedidos</h2>
              <div className="space-y-inline">
                {mockOrders.map((order) => (
                  <div key={order.id} className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                    <div className="flex justify-between items-start mb-inline">
                      <div>
                        <h3 className="text-body-semibold text-[#2A2823]">Pedido {order.id}</h3>
                        <p className="text-label text-[#2A2823]/60">{order.date}</p>
                      </div>
                      <span
                        className={`px-2 py-1 text-label rounded-lg ${
                          order.status === "Entregado" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-label text-[#2A2823]/60">{order.items} productos</p>
                      <p className="text-body-semibold text-[#2A2823]">${formatCurrency(order.total)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "wishlist" && (
            <div className="space-y-element">
              <h2 className="text-body-semibold text-[#2A2823]">Lista de Deseos</h2>
              <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-4 gap-inline">
                {mockWishlist.map((product) => (
                  <div key={product.id} className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                    <div className="h-48 bg-gray-100 rounded-lg overflow-hidden mb-inline">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-body-semibold text-[#2A2823] mb-inline">{product.name}</h3>
                    <div className="flex items-center gap-inline mb-inline">
                      <span className="price-original text-label">${formatCurrency(product.price)}</span>
                      <span className="price-discounted text-label">
                        ${formatCurrency(product.price * (1 - product.discount / 100))}
                      </span>
                    </div>
                    <button className="btn-primary btn-large w-full">Agregar al Carrito</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "configuracion" && (
            <div className="max-w-md">
              <div className="bg-white border border-[#2A2823]/20 rounded-lg p-element">
                <h2 className="text-body-semibold text-[#2A2823] mb-element">Configuración de la Cuenta</h2>
                <div className="space-y-inline">
                  <div className="flex items-center justify-between">
                    <span className="text-label text-[#2A2823]">Notificaciones por email</span>
                    <input type="checkbox" defaultChecked className="text-[#BF1330] focus:ring-[#BF1330]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-label text-[#2A2823]">Notificaciones SMS</span>
                    <input type="checkbox" className="text-[#BF1330] focus:ring-[#BF1330]" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-label text-[#2A2823]">Ofertas y promociones</span>
                    <input type="checkbox" defaultChecked className="text-[#BF1330] focus:ring-[#BF1330]" />
                  </div>
                  <button className="btn-secondary btn-xlarge w-full">Cambiar Contraseña</button>
                  <button className="btn-secondary btn-xlarge w-full text-red-600 border-red-600 hover:bg-red-50">
                    Eliminar Cuenta
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
