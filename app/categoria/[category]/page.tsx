"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Header from "../../../components/Header"
import Footer from "../../../components/Footer"
import CategoryTabs from "../../../components/CategoryTabs"
import ProductCard from "../../../components/ProductCard"
import { getProductsBySubcategory, getProductsByCategory } from "../../../lib/mockData"

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>()
  const [activeSubcategory, setActiveSubcategory] = useState("Todo")

  const subcategories =
    category === "hombres" ? ["Todo", "Clásicos", "Cargo", "Bermudas"] : ["Todo", "Clásicos", "Skinny", "Mom Jeans"]

  const filteredProducts = getProductsBySubcategory(category || "hombres", activeSubcategory)
  const featuredProduct = filteredProducts[0]

  return (
    <div className="min-h-screen bg-[#F8FBF8] flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container-responsive" style={{ marginTop: "32px" }}>
          {/* Hero Section con producto destacado */}
          {featuredProduct && (
            <section className="mb-section">
              <div className="flex flex-col gap-inline">
                <div className="hidden tablet:flex tablet:items-center tablet:gap-element tablet:h-[480px] bg-gradient-to-r from-[#F8FBF8] to-[#2A2823]/5 rounded-lg p-element">
                  <div className="flex-1 flex flex-col justify-center gap-element">
                    <h3 className="text-body-semibold text-[#BF1330]">
                      Ofertas para {category === "hombres" ? "caballeros" : "damas"}
                    </h3>
                    <h2 className="text-title text-[#2A2823] leading-tight">{featuredProduct.name}</h2>
                    <p className="text-body text-[#2A2823]">Tallas | {featuredProduct.sizes.join(" - ")}</p>

                    {featuredProduct.discount && (
                      <div className="discount-badge self-start">-{featuredProduct.discount}% OFF</div>
                    )}

                    <div className="flex items-center gap-inline">
                      {featuredProduct.discount && (
                        <span className="price-original text-body">
                          ${featuredProduct.price.toLocaleString("es-CO")}
                        </span>
                      )}
                      <span className="price-discounted text-body">
                        $
                        {(featuredProduct.discount
                          ? featuredProduct.price * (1 - featuredProduct.discount / 100)
                          : featuredProduct.price
                        ).toLocaleString("es-CO")}
                      </span>
                      <span className="price-discounted text-body">COP</span>
                    </div>

                    <div className="flex items-center gap-inline">
                      <button className="btn-secondary btn-xlarge">Agregar al carrito</button>
                      <button className="btn-primary btn-xlarge">Comprar ahora</button>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="w-full h-full bg-gradient-to-br from-[#2A2823] to-[#4F4F4F] rounded-lg flex items-center justify-center">
                      <img
                        src={featuredProduct.image || "/placeholder.svg?height=480&width=400&text=Producto+Destacado"}
                        alt={featuredProduct.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Mobile Layout */}
                <div className="tablet:hidden">
                  <div className="w-full aspect-[4/5] bg-gradient-to-br from-[#2A2823] to-[#4F4F4F] rounded-lg flex items-center justify-center">
                    <img
                      src={featuredProduct.image || "/placeholder.svg?height=400&width=320&text=Producto+Destacado"}
                      alt={featuredProduct.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex h-2 justify-center items-center gap-inline">
                  <div className="w-0.5 h-0.5 bg-[#2A2823]/40 rounded-full" />
                  <div className="w-1 h-1 bg-[#2A2823]/40 rounded-full" />
                  <div className="w-1.5 h-1.5 bg-[#2A2823]/40 rounded-full" />
                  <div className="w-6 h-1.5 bg-[#2A2823] rounded-[3px]" />
                  <div className="w-1.5 h-1.5 bg-[#2A2823]/40 rounded-full" />
                  <div className="w-1 h-1 bg-[#2A2823]/40 rounded-full" />
                  <div className="w-0.5 h-0.5 bg-[#2A2823]/40 rounded-full" />
                </div>
              </div>
            </section>
          )}

          {/* Products Section */}
          <section>
            <CategoryTabs
              categories={subcategories}
              activeCategory={activeSubcategory}
              onCategoryChange={setActiveSubcategory}
            />

            <div className="grid grid-cols-2 mobile:grid-cols-2 tablet:grid-cols-4 gap-2 mobile:gap-inline tablet:gap-inline">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
