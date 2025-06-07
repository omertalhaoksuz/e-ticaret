"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_URL

interface Menu {
  id: number
  name: string
  subMenus: SubMenu[]
}

interface SubMenu {
  id: number
  name: string
  menuId: number
}

interface Product {
  id: number
  name: string
}

export default function AdminMenuPage() {
  const [menus, setMenus] = useState<Menu[]>([])
  const [newMenuName, setNewMenuName] = useState("")
  const [newSubMenuName, setNewSubMenuName] = useState("")
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null)
  const [selectedSubMenuId, setSelectedSubMenuId] = useState<number | null>(null)
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetchMenus()
    fetchProducts()
  }, [])

  const fetchMenus = async () => {
    const res = await fetch(`${API_URL}/api/menu`)
    const data = await res.json()
    setMenus(data)
  }

  const fetchProducts = async () => {
    const res = await fetch(`${API_URL}/api/product`)
    const data = await res.json()
    setProducts(data)
  }

  const createMenu = async () => {
    if (!newMenuName.trim()) return

    const res = await fetch(`${API_URL}/api/menu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newMenuName }),
    })

    if (res.ok) {
      toast.success("Menu created")
      setNewMenuName("")
      fetchMenus()
    }
  }

  const assignProductToMenu = async () => {
    if (!selectedProductId || !selectedMenuId) return

    const res = await fetch(`${API_URL}/api/menu/AssignProduct?productId=${selectedProductId}&menuId=${selectedMenuId}`, {
      method: "POST",
    })

    if (res.ok) {
      toast.success("Product assigned to menu")
      setSelectedProductId(null)
      fetchMenus()
    } else {
      toast.error("Failed to assign product to menu")
    }
  }

  const createSubMenu = async () => {
    if (!newSubMenuName.trim() || !selectedMenuId) return

    const res = await fetch(`${API_URL}/api/submenu`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubMenuName, menuId: selectedMenuId }),
    })

    if (res.ok) {
      toast.success("Submenu created")
      setNewSubMenuName("")
      fetchMenus()
    }
  }

  const assignProductToSubMenu = async () => {
    if (!selectedProductId || !selectedSubMenuId) return

    const res = await fetch(`${API_URL}/api/submenu/AssignProduct?productId=${selectedProductId}&subMenuId=${selectedSubMenuId}`, {
      method: "POST",
    })

    if (res.ok) {
      toast.success("Product assigned to submenu")
      setSelectedProductId(null)
      setSelectedSubMenuId(null)
      fetchMenus()
    } else {
      toast.error("Failed to assign product to submenu")
    }
  }

  const deleteMenu = async (id: number) => {
    if (!confirm("Are you sure you want to delete this menu?")) return
    const res = await fetch(`${API_URL}/api/menu/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Menu deleted")
      fetchMenus()
    }
  }

  const deleteSubMenu = async (id: number) => {
    if (!confirm("Are you sure you want to delete this submenu?")) return
    const res = await fetch(`${API_URL}/api/submenu/${id}`, { method: "DELETE" })
    if (res.ok) {
      toast.success("Submenu deleted")
      fetchMenus()
    }
  }

  const editMenu = async (id: number) => {
    const newName = prompt("Enter new name for the menu:")
    if (!newName) return
    const res = await fetch(`${API_URL}/api/menu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) {
      toast.success("Menu updated")
      fetchMenus()
    } else {
      toast.error("Failed to update menu")
    }
  }

  const editSubMenu = async (id: number) => {
    const newName = prompt("Enter new name for the submenu:")
    if (!newName) return
    const res = await fetch(`${API_URL}/api/submenu/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    })
    if (res.ok) {
      toast.success("Submenu updated")
      fetchMenus()
    } else {
      toast.error("Failed to update submenu")
    }
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Menu Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Menu</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2">
          <Input placeholder="Menu name" value={newMenuName} onChange={(e) => setNewMenuName(e.target.value)} />
          <Button onClick={createMenu}>Create</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign Product to Menu (Direct)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <select className="border px-2 py-1 rounded" value={selectedMenuId ?? ""} onChange={(e) => setSelectedMenuId(parseInt(e.target.value))}>
            <option value="">Select Menu</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>{menu.name}</option>
            ))}
          </select>

          <select className="border px-2 py-1 rounded" value={selectedProductId ?? ""} onChange={(e) => setSelectedProductId(parseInt(e.target.value))}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <Button onClick={assignProductToMenu}>Assign</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Create Submenu</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <select className="border px-2 py-1 rounded" value={selectedMenuId ?? ""} onChange={(e) => setSelectedMenuId(parseInt(e.target.value))}>
            <option value="">Select Menu</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>{menu.name}</option>
            ))}
          </select>
          <Input placeholder="Submenu name" value={newSubMenuName} onChange={(e) => setNewSubMenuName(e.target.value)} />
          <Button onClick={createSubMenu}>Add</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Assign Product to Submenu</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <select className="border px-2 py-1 rounded" value={selectedSubMenuId ?? ""} onChange={(e) => setSelectedSubMenuId(parseInt(e.target.value))}>
            <option value="">Select Submenu</option>
            {menus.flatMap((menu) =>
              menu.subMenus.map((sub) => (
                <option key={sub.id} value={sub.id}>{menu.name} → {sub.name}</option>
              ))
            )}
          </select>

          <select className="border px-2 py-1 rounded" value={selectedProductId ?? ""} onChange={(e) => setSelectedProductId(parseInt(e.target.value))}>
            <option value="">Select Product</option>
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <Button onClick={assignProductToSubMenu}>Assign</Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {menus.map((menu) => (
          <Card key={menu.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                {menu.name}
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" onClick={() => editMenu(menu.id)}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => deleteMenu(menu.id)}>Delete</Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1">
                {menu.subMenus.map((sub) => (
                  <li key={sub.id} className="flex justify-between items-center">
                    <span>{sub.name}</span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="secondary" onClick={() => editSubMenu(sub.id)}>Edit</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSubMenu(sub.id)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}