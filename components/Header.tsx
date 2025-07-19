"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  MagnifyingGlassIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  UserIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/solid"
import { useState } from "react"
import { useCart } from "../hooks/useCart"
import { getProductById } from "../lib/mockData"

export default function Header() {
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState("")
  const { totalItems, totalAmount } = useCart()

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

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true
    if (path !== "/" && pathname.startsWith(path)) return true
    return false
  }

  const getBreadcrumbs = () => {
    if (pathname === "/") return null

    const segments = pathname.split("/").filter(Boolean)
    const breadcrumbs = [{ label: "Inicio", href: "/" }]

    if (segments[0] === "categoria") {
      const category = segments[1]
      breadcrumbs.push({
        label: category === "hombres" ? "Caballero" : "Mujer",
        href: `/categoria/${category}`,
      })
    } else if (segments[0] === "producto") {
      const productId = segments[1]
      const product = getProductById(productId)
      const categoryLabel = product?.category === "hombres" ? "Caballero" : "Mujer"
      breadcrumbs.push(
        { label: categoryLabel, href: `/categoria/${product?.category || "hombres"}` },
        { label: "Producto", href: pathname }
      )
    } else if (segments[0] === "carrito") {
      breadcrumbs.push({ label: "Carrito", href: "/carrito" })
    } else if (segments[0] === "checkout") {
      breadcrumbs.push({ label: "Checkout", href: "/checkout" })
    } else if (segments[0] === "cuenta") {
      breadcrumbs.push({ label: "Mi Cuenta", href: "/cuenta" })
    } else if (segments[0] === "auth") {
      breadcrumbs.push({ label: "Autenticación", href: "/auth" })
    }

    return breadcrumbs
  }

  const getPageTitle = () => {
    if (pathname === "/") return "Bienvenido"

    const segments = pathname.split("/").filter(Boolean)
    if (segments[0] === "categoria") {
      const category = segments[1]
      return category === "hombres" ? "Jeans Caballero" : "Moda Mujer"
    } else if (segments[0] === "producto") {
      const productId = segments[1]
      const product = getProductById(productId)
      return product?.ref || "Producto"
    } else if (segments[0] === "carrito") {
      return "Tu Carrito"
    } else if (segments[0] === "checkout") {
      return "Finalizar Compra"
    } else if (segments[0] === "cuenta") {
      return "Mi Cuenta"
    } else if (segments[0] === "auth") {
      return "Iniciar Sesión"
    }
    return ""
  }

  const breadcrumbs = getBreadcrumbs()
  const pageTitle = getPageTitle()

  return (
    <header className="bg-[#F8FBF8] text-[#2A2823] w-full border-b border-[#2A2823]/20">
      <div className="container-responsive">
        {/* Toolbar */}
        <div className="flex items-center justify-between gap-2 mobile:gap-inline py-3 mobile:py-element border-b border-[#2A2823]/20">
          <Link href="/" className="text-lg mobile:text-subtitle font-semibold shrink-0">
            ZODIACO
          </Link>

          <div className="flex-1 hidden tablet:flex items-center gap-inline px-6 py-2 border border-[#2A2823]/40 rounded-[20px] max-w-md">
            <MagnifyingGlassIcon className="h-5 w-5 mobile:h-6 mobile:w-6 text-[#2A2823]" />
            <input
              type="search"
              placeholder="¿Qué estás buscando?"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent outline-none placeholder:text-[#2A2823]/40 text-sm mobile:text-label"
            />
          </div>

          <div className="hidden tablet:flex items-center gap-inline">
            <button className="btn-secondary btn-large">
              <span className="hidden laptop:inline">Asistencia</span>
              <ChatBubbleOvalLeftEllipsisIcon className="h-5 w-5 mobile:h-6 mobile:w-6" />
            </button>

            <Link href="/auth" className="btn-primary btn-large">
              <span className="hidden laptop:inline">Regístrate</span>
              <UserIcon className="h-5 w-5 mobile:h-6 mobile:w-6" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="tablet:hidden flex items-center gap-2">
            <Link href="/auth" className="p-2">
              <UserIcon className="h-5 w-5 text-[#2A2823]" />
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div className="py-3 mobile:py-element flex flex-col gap-3 mobile:gap-element">
          <nav>
            <ul className="flex items-end gap-1 mobile:gap-inline w-full">
              <li
                className={`flex-1 tablet:flex-none tablet:w-[124px] ${isActive("/") && pathname === "/" ? "tab tab-active" : "tab tab-inactive"}`}
              >
                <Link href="/" className="w-full h-full flex items-center justify-center text-sm mobile:text-base">
                  Ofertas
                </Link>
              </li>
              <li
                className={`flex-1 tablet:flex-none tablet:w-[124px] ${isActive("/categoria/hombres") ? "tab tab-active" : "tab tab-inactive"}`}
              >
                <Link
                  href="/categoria/hombres"
                  className="w-full h-full flex items-center justify-center text-sm mobile:text-base"
                >
                  Hombres
                </Link>
              </li>
              <li
                className={`flex-1 tablet:flex-none tablet:w-[124px] ${isActive("/categoria/mujer") ? "tab tab-active" : "tab tab-inactive"}`}
              >
                <Link
                  href="/categoria/mujer"
                  className="w-full h-full flex items-center justify-center text-sm mobile:text-base"
                >
                  Mujer
                </Link>
              </li>
            </ul>
          </nav>

          <div className="flex items-end justify-between">
            <div className="flex flex-col gap-1 mobile:gap-2">
              {breadcrumbs && (
                <nav aria-label="breadcrumb" className="flex h-4 items-center gap-1">
                  {breadcrumbs.map((crumb, index) => (
                    <div key={crumb.href} className="flex items-center gap-1">
                      {index > 0 && <ChevronRightIcon className="w-3 h-3 text-[#2A2823]/40" />}
                      {index === breadcrumbs.length - 1 ? (
                        <span className="text-xs mobile:text-label text-[#2A2823] truncate max-w-[120px] mobile:max-w-none">
                          {crumb.label}
                        </span>
                      ) : (
                        <Link
                          href={crumb.href}
                          className="text-xs mobile:text-label text-[#2A2823]/40 hover:underline truncate max-w-[80px] mobile:max-w-none"
                        >
                          {crumb.label}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
              )}

              {pathname === "/" ? (
                <div className="flex flex-col">
                  <span className="text-xs mobile:text-label text-[#2A2823]/60">Inicio</span>
                  <h1 className="text-sm mobile:text-body-semibold text-[#2A2823] capitalize">Bienvenido</h1>
                </div>
              ) : (
                <h1 className="text-sm mobile:text-body-semibold text-[#2A2823] capitalize truncate max-w-[150px] mobile:max-w-none">
                  {pageTitle}
                </h1>
              )}
            </div>

            <Link
              href="/carrito"
              className="inline-flex items-center justify-center gap-2 mobile:gap-inline px-3 mobile:px-6 h-10 border border-[#2A2823]/40 rounded-[4px] hover:border-[#2A2823]/60 transition-colors"
            >
              <ShoppingCartIcon className="h-5 w-5 mobile:h-6 mobile:w-6 text-[#2A2823]" />
              <div className="flex flex-col items-start justify-start gap-0.5">
                <p className="text-xs mobile:text-label-small font-normal text-[#2A2823] leading-tight">
                  {totalItems} Productos
                </p>
                <p className="text-xs mobile:text-body-semibold text-[#2A2823] leading-tight">
                  ${formatCurrency(totalAmount)}
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
