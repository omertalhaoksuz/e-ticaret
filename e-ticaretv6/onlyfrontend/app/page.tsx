"use client"

import { useState } from "react"
import Image from "next/image"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

// Mock data - would come from API in real app
const featuredProducts = [
  {
    id: 1,
    name: "Ender 3 Pro 3D Printer",
    price: 239.99,
    image: "/placeholder.svg?height=300&width=300",
    description:
      "Perfect for beginners and hobbyists. The Ender 3 Pro offers excellent print quality at an affordable price.",
    colors: ["Black", "White"],
  },
  {
    id: 2,
    name: "Premium PLA Filament",
    price: 24.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "High-quality PLA filament for precise and reliable 3D printing. Available in various colors.",
    colors: ["Red", "Blue", "Green", "Yellow"],
  },
  {
    id: 3,
    name: "3D Printing Service - Standard",
    price: 49.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Professional 3D printing service for your custom designs. Fast turnaround and high-quality results.",
    colors: [],
  },
  {
    id: 4,
    name: "Nozzle Replacement Kit",
    price: 19.99,
    image: "/placeholder.svg?height=300&width=300",
    description: "Complete nozzle replacement kit compatible with most popular 3D printers.",
    colors: [],
  },
]

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [selectedColor, setSelectedColor] = useState<string>("")

  const openProductModal = (product: any) => {
    setSelectedProduct(product)
    setSelectedColor(product.colors && product.colors.length > 0 ? product.colors[0] : "")
  }

  const closeProductModal = () => {
    setSelectedProduct(null)
    setSelectedColor("")
  }

  const addToCart = () => {
    // In a real app, this would add the product to the cart
    alert(`Added ${selectedProduct.name} to cart${selectedColor ? ` in ${selectedColor}` : ""}`)
    closeProductModal()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* About Section */}
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to 3D Print Hub</h1>
            <p className="text-lg mb-6">
              We provide high-quality 3D printing services and products for professionals, hobbyists, and businesses.
              With our state-of-the-art equipment and expert team, we deliver exceptional results for all your 3D
              printing needs.
            </p>
            <Button size="lg">Learn More</Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=400&width=400"
              alt="3D Printing"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button variant="default" className="w-full" onClick={() => openProductModal(product)}>
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Product Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative">
                <Image
                  src={selectedProduct?.image || "/placeholder.svg?height=300&width=300"}
                  alt={selectedProduct?.name || "Product"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <h3 className="font-bold text-xl mb-2">{selectedProduct?.name}</h3>
                <p className="font-bold text-lg mb-4">${selectedProduct?.price?.toFixed(2)}</p>

                {selectedProduct?.colors && selectedProduct.colors.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.colors.map((color: string) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <DialogDescription className="mb-4">{selectedProduct?.description}</DialogDescription>

                <Button className="mt-auto" onClick={addToCart}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
