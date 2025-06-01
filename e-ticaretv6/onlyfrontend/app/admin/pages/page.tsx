"use client"

import { useState } from "react"
import Image from "next/image"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { GripVertical, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

// Mock product data
const allProducts = [
  {
    id: 1,
    name: "Ender 3 Pro 3D Printer",
    price: 239.99,
    category: "Printers",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 2,
    name: "Premium PLA Filament",
    price: 24.99,
    category: "Filaments",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 3,
    name: "3D Printing Service - Standard",
    price: 49.99,
    category: "Services",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 4,
    name: "Nozzle Replacement Kit",
    price: 19.99,
    category: "Accessories",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 5,
    name: "Build Plate",
    price: 49.99,
    category: "Accessories",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 6,
    name: "Prusa i3 MK3S+ Kit",
    price: 349.99,
    category: "Printers",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 7,
    name: "PETG Filament",
    price: 29.99,
    category: "Filaments",
    image: "/placeholder.svg?height=80&width=80",
  },
  {
    id: 8,
    name: "3D Modeling Service",
    price: 99.99,
    category: "Services",
    image: "/placeholder.svg?height=80&width=80",
  },
]

// Mock page data
const initialPageData = {
  home: {
    featured: [1, 2, 3, 4],
  },
  printers: {
    products: [1, 6],
  },
  filaments: {
    products: [2, 7],
  },
  accessories: {
    products: [4, 5],
  },
  services: {
    products: [3, 8],
  },
}

export default function PagesPage() {
  const [pageData, setPageData] = useState(initialPageData)
  const [selectedProducts, setSelectedProducts] = useState<Record<string, number[]>>({
    home: [...pageData.home.featured],
    printers: [...pageData.printers.products],
    filaments: [...pageData.filaments.products],
    accessories: [...pageData.accessories.products],
    services: [...pageData.services.products],
  })

  const handleCheckboxChange = (pageKey: string, productId: number, checked: boolean) => {
    if (checked) {
      setSelectedProducts({
        ...selectedProducts,
        [pageKey]: [...selectedProducts[pageKey], productId],
      })
    } else {
      setSelectedProducts({
        ...selectedProducts,
        [pageKey]: selectedProducts[pageKey].filter((id) => id !== productId),
      })
    }
  }

  const handleDragEnd = (result: any, pageKey: string) => {
    if (!result.destination) return

    const items = Array.from(selectedProducts[pageKey])
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSelectedProducts({
      ...selectedProducts,
      [pageKey]: items,
    })
  }

  const savePageSettings = (pageKey: string) => {
    // In a real app, this would call an API to save the page settings
    if (pageKey === "home") {
      setPageData({
        ...pageData,
        home: {
          ...pageData.home,
          featured: selectedProducts.home,
        },
      })
    } else {
      setPageData({
        ...pageData,
        [pageKey]: {
          ...pageData[pageKey as keyof typeof pageData],
          products: selectedProducts[pageKey],
        },
      })
    }

    alert(`${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} page settings saved!`)
  }

  const getProductById = (id: number) => {
    return allProducts.find((product) => product.id === id)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Pages</h1>

      <Tabs defaultValue="home" className="space-y-4">
        <TabsList>
          <TabsTrigger value="home">Home Page</TabsTrigger>
          <TabsTrigger value="printers">Printers</TabsTrigger>
          <TabsTrigger value="filaments">Filaments</TabsTrigger>
          <TabsTrigger value="accessories">Accessories</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="home">
          <PageSettings
            title="Home Page"
            description="Manage featured products on the home page"
            products={allProducts}
            selectedProductIds={selectedProducts.home}
            onCheckboxChange={(productId, checked) => handleCheckboxChange("home", productId, checked)}
            onDragEnd={(result) => handleDragEnd(result, "home")}
            onSave={() => savePageSettings("home")}
          />
        </TabsContent>

        <TabsContent value="printers">
          <PageSettings
            title="Printers Page"
            description="Manage products displayed on the printers page"
            products={allProducts.filter((p) => p.category === "Printers")}
            selectedProductIds={selectedProducts.printers}
            onCheckboxChange={(productId, checked) => handleCheckboxChange("printers", productId, checked)}
            onDragEnd={(result) => handleDragEnd(result, "printers")}
            onSave={() => savePageSettings("printers")}
          />
        </TabsContent>

        <TabsContent value="filaments">
          <PageSettings
            title="Filaments Page"
            description="Manage products displayed on the filaments page"
            products={allProducts.filter((p) => p.category === "Filaments")}
            selectedProductIds={selectedProducts.filaments}
            onCheckboxChange={(productId, checked) => handleCheckboxChange("filaments", productId, checked)}
            onDragEnd={(result) => handleDragEnd(result, "filaments")}
            onSave={() => savePageSettings("filaments")}
          />
        </TabsContent>

        <TabsContent value="accessories">
          <PageSettings
            title="Accessories Page"
            description="Manage products displayed on the accessories page"
            products={allProducts.filter((p) => p.category === "Accessories")}
            selectedProductIds={selectedProducts.accessories}
            onCheckboxChange={(productId, checked) => handleCheckboxChange("accessories", productId, checked)}
            onDragEnd={(result) => handleDragEnd(result, "accessories")}
            onSave={() => savePageSettings("accessories")}
          />
        </TabsContent>

        <TabsContent value="services">
          <PageSettings
            title="Services Page"
            description="Manage products displayed on the services page"
            products={allProducts.filter((p) => p.category === "Services")}
            selectedProductIds={selectedProducts.services}
            onCheckboxChange={(productId, checked) => handleCheckboxChange("services", productId, checked)}
            onDragEnd={(result) => handleDragEnd(result, "services")}
            onSave={() => savePageSettings("services")}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function PageSettings({
  title,
  description,
  products,
  selectedProductIds,
  onCheckboxChange,
  onDragEnd,
  onSave,
}: {
  title: string
  description: string
  products: any[]
  selectedProductIds: number[]
  onCheckboxChange: (productId: number, checked: boolean) => void
  onDragEnd: (result: any) => void
  onSave: () => void
}) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Select Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center space-x-3 border rounded-lg p-3">
                  <Checkbox
                    id={`product-${product.id}`}
                    checked={selectedProductIds.includes(product.id)}
                    onCheckedChange={(checked) => onCheckboxChange(product.id, checked as boolean)}
                  />
                  <div className="flex items-center space-x-3 flex-1">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <Label htmlFor={`product-${product.id}`} className="font-medium cursor-pointer">
                        {product.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium">Selected Products Order</h3>
              <p className="text-sm text-muted-foreground">Drag to reorder</p>
            </div>

            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="selected-products">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {selectedProductIds.length === 0 ? (
                      <p className="text-center py-8 text-muted-foreground border rounded-lg">
                        No products selected. Select products above to display on this page.
                      </p>
                    ) : (
                      selectedProductIds.map((id, index) => {
                        const product = products.find((p) => p.id === id)
                        if (!product) return null

                        return (
                          <Draggable key={id} draggableId={`product-${id}`} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="flex items-center border rounded-lg p-3"
                              >
                                <div {...provided.dragHandleProps} className="mr-3 text-muted-foreground">
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div className="flex items-center space-x-3 flex-1">
                                  <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.name}
                                    width={40}
                                    height={40}
                                    className="rounded-md object-cover"
                                  />
                                  <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
                                  </div>
                                </div>
                                <Badge>{index + 1}</Badge>
                              </div>
                            )}
                          </Draggable>
                        )
                      })
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSave}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
