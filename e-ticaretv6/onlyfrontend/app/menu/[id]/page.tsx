"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import ProductCard from "@/components/ProductCard"
import ProductDetailModal from "@/components/ProductDetailModal"

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string | null
  description?: string | null
}

export default function MenuPage() {
  const params = useParams()
  const [menu, setMenu] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/menu/${params.id}`)
      .then((res) => res.json())
      .then((data) => setMenu(data))
      .catch(console.error)
  }, [params.id])

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{menu?.name} Products</h1>

      {/* Üst Menüye Ait Ürünler */}
      {menu?.products?.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {menu.products.map((product: Product) => (
            <ProductCard key={product.id} product={product} onClick={() => handleCardClick(product)} />
          ))}
        </div>
      )}

      {/* Alt Menülere Ait Ürünler */}
      {menu?.subMenus?.map((sub: any) => (
        <div key={sub.id} className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">{sub.name}</h2>
          {sub.products.length === 0 ? (
            <p className="text-muted italic">No products in this sub menu.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {sub.products.map((product: Product) => (
                <ProductCard key={product.id} product={product} onClick={() => handleCardClick(product)} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Modal */}
      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
