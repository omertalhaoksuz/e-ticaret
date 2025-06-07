"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Product {
  id: number
  name: string
  price: number
  imageUrl: string | null
  description: string | null
  category: string
}

export default function PagesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [menus, setMenus] = useState<any[]>([])
  const [selectedMenuProducts, setSelectedMenuProducts] = useState<Record<string, number[]>>({})

  useEffect(() => {
    fetchProducts()
    fetchMenus()
  }, [])

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/product`)
    const data = await res.json()
    setProducts(data)
  }

  const fetchMenus = async () => {
    const res = await fetch(`${API_URL}/api/menu`)
    const data = await res.json()
    setMenus(data)

    const mapping: Record<string, number[]> = {}
    data.forEach((menu: any) => {
      const menuProducts = (menu.products || []).map((p: any) => p.id)
      mapping[`menu-${menu.id}`] = menuProducts

      for (const sub of menu.subMenus || []) {
        mapping[`submenu-${sub.id}`] = (sub.products || []).map((p: any) => p.id)
      }
    })
    setSelectedMenuProducts(mapping)
  }

  const handleCheckboxChange = (key: string, productId: number, checked: boolean) => {
    setSelectedMenuProducts((prev) => {
      const current = prev[key] || []
      return {
        ...prev,
        [key]: checked ? [...current, productId] : current.filter((id) => id !== productId),
      }
    })
  }

  const saveChanges = async (key: string) => {
    const [type, id] = key.split("-")
    const productIds = selectedMenuProducts[key] || []

    for (const pid of products.map(p => p.id)) {
      const isChecked = productIds.includes(pid)
      await fetch(`${API_URL}/api/${type}/${isChecked ? "AssignProduct" : "UnassignProduct"}?productId=${pid}&${type}Id=${id}`, {
        method: isChecked ? "POST" : "DELETE",
      })
    }

    toast.success("Changes saved!")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Menu Product Assignment</h1>
      <Tabs defaultValue={menus[0]?.id?.toString()} className="space-y-4">
        <TabsList>
          {menus.map((menu) => (
            <TabsTrigger key={menu.id} value={menu.id.toString()}>{menu.name}</TabsTrigger>
          ))}
        </TabsList>

        {menus.map((menu) => (
          <TabsContent key={menu.id} value={menu.id.toString()}>
            <Card>
              <CardHeader>
                <CardTitle>{menu.name}</CardTitle>
                <CardDescription>Assign/unassign products with checkboxes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <ProductCheckboxGrid
                  keyId={`menu-${menu.id}`}
                  title="Menu Products"
                  products={products}
                  selectedProductIds={selectedMenuProducts[`menu-${menu.id}`] || []}
                  onCheckboxChange={handleCheckboxChange}
                />

                {(menu.subMenus || []).map((sub: any) => (
                  <ProductCheckboxGrid
                    key={`submenu-${sub.id}`}
                    keyId={`submenu-${sub.id}`}
                    title={`Submenu: ${sub.name}`}
                    products={products}
                    selectedProductIds={selectedMenuProducts[`submenu-${sub.id}`] || []}
                    onCheckboxChange={handleCheckboxChange}
                  />
                ))}

                <div className="flex justify-end">
                  <Button onClick={() => saveChanges(`menu-${menu.id}`)}>Save Menu</Button>
                  {(menu.subMenus || []).map((sub: any) => (
                    <Button key={sub.id} onClick={() => saveChanges(`submenu-${sub.id}`)} className="ml-2">
                      Save {sub.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

function ProductCheckboxGrid({
  keyId,
  title,
  products,
  selectedProductIds,
  onCheckboxChange,
}: {
  keyId: string
  title: string
  products: Product[]
  selectedProductIds: number[]
  onCheckboxChange: (key: string, productId: number, checked: boolean) => void
}) {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.sort((a, b) => a.name.localeCompare(b.name)).map((product) => (
          <div key={product.id} className="flex items-center space-x-3 border rounded-lg p-3">
            <Checkbox
              id={`${keyId}-product-${product.id}`}
              checked={selectedProductIds.includes(product.id)}
              onCheckedChange={(checked) =>
                onCheckboxChange(keyId, product.id, Boolean(checked))
              }
            />
            <div className="flex items-center space-x-3 flex-1">
              <Image
                src={product.imageUrl ? `https://localhost:7082${product.imageUrl}` : "/placeholder.svg"}
                alt={product.name}
                width={40}
                height={40}
                className="rounded-md object-cover"
              />
              <div>
                <Label htmlFor={`${keyId}-product-${product.id}`} className="font-medium cursor-pointer">
                  {product.name}
                </Label>
                <p className="text-sm text-muted-foreground">${product.price.toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
