"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { addToCart } from "@/services/cart"
import { useAuth } from "@/contexts/AuthContext"
import { getColors } from "@/services/color"

interface Product {
  id: number
  name: string
  price: number
  imageUrl?: string | null
}

interface Props {
  product: Product | null
  onClose: () => void
}

export default function ProductDetailModal({ product, onClose }: Props) {
  const [colors, setColors] = useState<any[]>([])
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>()
  const [userDescription, setUserDescription] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const { token } = useAuth()

  useEffect(() => {
    getColors().then(setColors).catch(console.error)
  }, [])

  const getImageUrl = (url: string | undefined | null) => {
    if (!url) return "/fallback.jpg"
    if (url.startsWith("/uploads/")) return `https://localhost:7082${url}`
    return url
  }

  const productColors = product
    ? colors.filter(
        (color: any) =>
          !color.productColorOptions ||
          color.productColorOptions.some((pco: any) => pco.productId === product.id)
      )
    : []

  const handleAddToCart = async () => {
    if (!product || !token) return

    await addToCart(
      {
        productId: product.id,
        colorOptionId: selectedColorId,
        description: userDescription,
        quantity,
      },
      token
    )
    onClose()
  }

  return (
    <Dialog open={!!product} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{product?.name}</DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <div className="relative aspect-square">
            <Image
              src={getImageUrl(product?.imageUrl)}
              alt={product?.name || ""}
              fill
              className="object-cover rounded"
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold">{product?.name}</h3>
            <p className="text-xl font-bold my-2">${product?.price?.toFixed(2)}</p>

            {productColors.length > 0 ? (
              <>
                <label className="block text-sm font-medium mb-2">Choose a Color</label>
                <Select
                  value={selectedColorId?.toString()}
                  onValueChange={(val) => setSelectedColorId(parseInt(val))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a color" />
                  </SelectTrigger>
                  <SelectContent>
                    {productColors.map((color: any) => (
                      <SelectItem key={color.id} value={color.id.toString()}>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-4 h-4 rounded-full border"
                            style={{ backgroundColor: color.hex }}
                          />
                          {color.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <p className="text-sm italic text-red-600 mb-4">
                No color options available. Please specify your desired color in the description.
              </p>
            )}

            <label htmlFor="user-description" className="block text-sm font-medium mt-4">
              Your Description
            </label>
            <textarea
              id="user-description"
              rows={3}
              className="w-full border border-gray-300 rounded p-2"
              placeholder="Write your description..."
              value={userDescription}
              onChange={(e) => setUserDescription(e.target.value)}
            />

            <label htmlFor="quantity" className="block text-sm font-medium mt-4">
              Quantity
            </label>
            <Input
              id="quantity"
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
            />

            <Button className="mt-4 w-full" onClick={handleAddToCart}>
              Add to Cart
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
