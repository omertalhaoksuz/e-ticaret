"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"

// Mock color data
const initialColors = [
  { id: 1, name: "Red", hex: "#FF0000" },
  { id: 2, name: "Blue", hex: "#0000FF" },
  { id: 3, name: "Green", hex: "#00FF00" },
  { id: 4, name: "Yellow", hex: "#FFFF00" },
  { id: 5, name: "Black", hex: "#000000" },
  { id: 6, name: "White", hex: "#FFFFFF" },
]

export default function ColorsPage() {
  const [colors, setColors] = useState(initialColors)
  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#000000")

  const handleAddColor = () => {
    if (!newColorName.trim()) return

    const newColor = {
      id: colors.length > 0 ? Math.max(...colors.map((c) => c.id)) + 1 : 1,
      name: newColorName,
      hex: newColorHex,
    }

    setColors([...colors, newColor])
    setNewColorName("")
    setNewColorHex("#000000")
  }

  const handleDeleteColor = (id: number) => {
    setColors(colors.filter((color) => color.id !== id))
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Colors</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Color</CardTitle>
          <CardDescription>Add colors that can be assigned to products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2 flex-1">
              <Label htmlFor="color-name">Color Name</Label>
              <Input
                id="color-name"
                placeholder="e.g., Midnight Blue"
                value={newColorName}
                onChange={(e) => setNewColorName(e.target.value)}
              />
            </div>

            <div className="space-y-2 w-full sm:w-[180px]">
              <Label htmlFor="color-hex">Color Value</Label>
              <div className="flex gap-2">
                <Input
                  id="color-hex"
                  type="color"
                  value={newColorHex}
                  onChange={(e) => setNewColorHex(e.target.value)}
                  className="w-12 p-1 h-10"
                />
                <Input value={newColorHex} onChange={(e) => setNewColorHex(e.target.value)} className="flex-1" />
              </div>
            </div>

            <div className="flex items-end">
              <Button onClick={handleAddColor} className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Color
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Colors</CardTitle>
          <CardDescription>Manage your product color options</CardDescription>
        </CardHeader>
        <CardContent>
          {colors.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No colors added yet. Add your first color above.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {colors.map((color) => (
                <div key={color.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hex }} />
                    <div>
                      <p className="font-medium">{color.name}</p>
                      <p className="text-xs text-muted-foreground">{color.hex}</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteColor(color.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Delete {color.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
