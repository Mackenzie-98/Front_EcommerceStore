import type { Product } from "../types/product"

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Pantalón Clásico Hombre",
    price: 209000,
    discount: 20,
    image: "/images/product-1.png",
    images: ["/images/product-1.png", "/images/product-2.png", "/images/product-3.png", "/images/product-4.png"],
    sizes: ["28", "30", "32", "34", "36"],
    category: "hombres",
    subcategory: "clasicos",
    ref: "REF 4001",
    description: "Pantalón de corte clásico con ajuste perfecto para uso diario. Fabricado con materiales de alta calidad que garantizan comodidad y durabilidad. Ideal para ocasiones casuales y formales.",
  },
  {
    id: "2",
    name: "Jean Slim Fit",
    price: 189000,
    discount: 15,
    image: "/images/product-2.png",
    images: ["/images/product-2.png", "/images/product-1.png", "/images/product-3.png", "/images/product-4.png"],
    sizes: ["28", "30", "32", "34", "36"],
    category: "hombres",
    subcategory: "clasicos",
    ref: "REF 4002",
    description: "Jean de corte slim con tela de alta calidad y durabilidad. Diseño moderno que se adapta perfectamente a tu figura.",
  },
  {
    id: "3",
    name: "Pantalón Cargo",
    price: 245000,
    discount: 25,
    image: "/images/product-4.png",
    images: ["/images/product-4.png", "/images/product-1.png", "/images/product-2.png", "/images/product-3.png"],
    sizes: ["28", "30", "32", "34", "36"],
    category: "hombres",
    subcategory: "cargo",
    ref: "REF 4003",
    description: "Pantalón cargo con múltiples bolsillos, ideal para aventuras. Diseño funcional y cómodo para uso diario.",
  },
  {
    id: "4",
    name: "Chino Clásico",
    price: 179000,
    discount: 20,
    image: "/images/product-4.png",
    images: ["/images/product-4.png", "/images/product-1.png", "/images/product-2.png", "/images/product-3.png"],
    sizes: ["28", "30", "32", "34", "36"],
    category: "hombres",
    subcategory: "clasicos",
    ref: "REF 4004",
    description: "Pantalón chino versátil para looks casuales y formales.",
  },
  {
    id: "5",
    name: "Bermuda Casual",
    price: 125000,
    discount: 30,
    image: "/images/product-5.png",
    images: ["/images/product-5.png", "/images/product-1.png", "/images/product-2.png", "/images/product-3.png"],
    sizes: ["28", "30", "32", "34", "36"],
    category: "hombres",
    subcategory: "bermudas",
    ref: "REF 4005",
    description: "Bermuda cómoda perfecta para días calurosos de verano.",
  },
  {
    id: "6",
    name: "Jean Recto Mujer",
    price: 199000,
    discount: 18,
    image: "/images/product-6.png",
    images: ["/images/product-6.png", "/images/product-7.png", "/images/product-8.png", "/images/product-1.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "mujer",
    subcategory: "clasicos",
    ref: "REF 5001",
    description: "Jean de corte recto que realza la figura femenina.",
  },
  {
    id: "7",
    name: "Pantalón Palazzo",
    price: 229000,
    discount: 22,
    image: "/images/product-7.png",
    images: ["/images/product-7.png", "/images/product-6.png", "/images/product-8.png", "/images/product-1.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "mujer",
    subcategory: "clasicos",
    ref: "REF 5002",
    description: "Pantalón palazzo elegante para ocasiones especiales.",
  },
  {
    id: "8",
    name: "Short Deportivo",
    price: 89000,
    discount: 35,
    image: "/images/product-8.png",
    images: ["/images/product-8.png", "/images/product-6.png", "/images/product-7.png", "/images/product-1.png"],
    sizes: ["XS", "S", "M", "L", "XL"],
    category: "mujer",
    subcategory: "bermudas",
    ref: "REF 5003",
    description: "Short deportivo cómodo para actividades físicas.",
  },
]

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return mockProducts.filter(product => product.category === category)
}

export const getProductsBySubcategory = (category: string, subcategory: string): Product[] => {
  if (subcategory.toLowerCase() === "todo") {
    return getProductsByCategory(category)
  }
  return mockProducts.filter(product => 
    product.category === category && 
    product.subcategory === subcategory.toLowerCase()
  )
}

export const formatCurrency = (amount: number): string => {
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