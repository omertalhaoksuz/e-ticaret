"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/ProductCard"
import ProductDetailModal from "@/components/ProductDetailModal"

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string | null
  description?: string | null
}

export default function SubMenuPage() {
  const params = useParams()
  const [subMenu, setSubMenu] = useState<any>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/submenu/${params.id}`)
      .then((res) => res.json())
      .then((data) => setSubMenu(data))
      .catch(console.error)
  }, [params.id])

  const handleCardClick = (product: Product) => {
    setSelectedProduct(product)
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">{subMenu?.name} Products</h1>

      {subMenu?.products?.length === 0 ? (
        <p className="text-muted italic">No products in this sub menu.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {subMenu?.products?.map((product: Product) => (
            <ProductCard key={product.id} product={product} onClick={() => handleCardClick(product)} />
          ))}
        </div>
      )}

      <ProductDetailModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </div>
  )
}
