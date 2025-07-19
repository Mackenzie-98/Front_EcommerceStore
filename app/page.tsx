"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Header from "../components/Header"
import Footer from "../components/Footer"
import ProductCard from "../components/ProductCard"
import { useProducts } from "../hooks/useProducts"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("Todo")
  const { products, loading, error, fetchFeaturedProducts } = useProducts()

  const categories = ["Todo", "Clásicos", "Cargo", "Bermudas"]

  useEffect(() => {
    fetchFeaturedProducts()
  }, [fetchFeaturedProducts])

  const filteredProducts = products.filter((product) => {
    if (activeCategory === "Todo") {
      return true
    }
    // Map frontend categories to backend category names
    const categoryMap: Record<string, string> = {
      "Clásicos": "clasicos",
      "Cargo": "cargo", 
      "Bermudas": "bermudas"
    }
    return product.tags.includes(categoryMap[activeCategory] || activeCategory.toLowerCase())
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BF1330] mx-auto mb-4"></div>
            <p className="text-[#2A2823]">Cargando productos...</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-[#BF1330] mb-4">Error: {error}</p>
            <button 
              onClick={() => fetchFeaturedProducts()}
              className="btn-primary btn-large"
            >
              Reintentar
            </button>
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
        {/* Hero Section */}
        <section className="w-full">
          <div className="container-responsive" style={{ marginTop: "32px" }}>
            <div className="flex flex-col items-center justify-center gap-inline">
              <div className="w-full relative overflow-hidden rounded-lg">
                <img
                  src="/images/hero-banner.png"
                  alt="Nueva Colección ZODIACO - Moda para hombres y mujeres"
                  className="w-full h-[300px] mobile:h-[400px] tablet:h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/30 flex items-center justify-center">
                  <div className="text-center text-white px-element">
                    <h1 className="text-title mb-4">Nueva Colección</h1>
                    <p className="text-body mb-8 max-w-2xl mx-auto">
                      Descubre los últimos diseños en moda masculina y femenina. Calidad premium, estilo único.
                    </p>
                    <Link href="/categoria/hombres" className="btn-primary btn-xlarge">
                      Explorar Colección
                    </Link>
                  </div>
                </div>
              </div>

              {/* Slide Indicators */}
              <div className="flex h-2 justify-center items-center gap-inline">
                <div className="w-0.5 h-0.5 bg-[#2A2823]/40 rounded-full" />
                <div className="w-1 h-1 bg-[#2A2823]/40 rounded-full" />
                <div className="w-1.5 h-1.5 bg-[#2A2823]/40 rounded-full" />
                <div className="w-6 h-1.5 bg-[#2A2823] rounded-full" />
                <div className="w-1.5 h-1.5 bg-[#2A2823]/40 rounded-full" />
                <div className="w-1 h-1 bg-[#2A2823]/40 rounded-full" />
                <div className="w-0.5 h-0.5 bg-[#2A2823]/40 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="w-full" style={{ marginTop: "32px" }}>
          <div className="container-responsive">
            {/* Category Tabs */}
            <div className="flex gap-inline items-center mb-element">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`tab flex-1 ${activeCategory === category ? "tab-active" : "tab-inactive"}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 mobile:grid-cols-2 tablet:grid-cols-4 gap-2 mobile:gap-inline tablet:gap-inline">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-[#2A2823]/60">No se encontraron productos en esta categoría.</p>
              </div>
            )}
          </div>
        </section>

        {/* Features Section */}
        <section className="w-full" style={{ marginTop: "64px" }}>
          <div className="container-responsive">
            <div className="grid grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 gap-element">
              <div className="text-center p-element">
                <div className="w-16 h-16 bg-[#BF1330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚚</span>
                </div>
                <h3 className="text-body-semibold text-[#2A2823] mb-2">Envío Gratis</h3>
                <p className="text-body text-[#2A2823]/60">En compras superiores a $150.000</p>
              </div>
              <div className="text-center p-element">
                <div className="w-16 h-16 bg-[#BF1330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔄</span>
                </div>
                <h3 className="text-body-semibold text-[#2A2823] mb-2">Devoluciones</h3>
                <p className="text-body text-[#2A2823]/60">30 días para cambios y devoluciones</p>
              </div>
              <div className="text-center p-element mobile:col-span-2 tablet:col-span-1">
                <div className="w-16 h-16 bg-[#BF1330]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💳</span>
                </div>
                <h3 className="text-body-semibold text-[#2A2823] mb-2">Pago Seguro</h3>
                <p className="text-body text-[#2A2823]/60">Múltiples métodos de pago disponibles</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
