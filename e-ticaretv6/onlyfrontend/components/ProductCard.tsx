// components/ProductCard.tsx
"use client"

import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string | null
}

interface Props {
  product: Product
  onClick?: () => void
}

export default function ProductCard({ product, onClick }: Props) {
  const getImageUrl = (url: string | null | undefined) => {
    if (!url) return "/fallback.jpg"
    if (url.startsWith("/uploads/")) return `https://localhost:7082${url}`
    return url
  }

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <Image
          src={getImageUrl(product.imageUrl)}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
        <p className="font-bold">${product.price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onClick} variant="default" className="w-full">
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}
