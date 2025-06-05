"use client"

import { useEffect, useState } from "react"
import { X, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { getColors, createColor, deleteColor, ColorDto } from "@/services/color"
import { toast } from "react-toastify"

export default function ColorsPage() {
  const [colors, setColors] = useState<ColorDto[]>([])
  const [newColorName, setNewColorName] = useState("")
  const [newColorHex, setNewColorHex] = useState("#000000")

  useEffect(() => {
    loadColors()
  }, [])

  const loadColors = async () => {
    try {
      const data = await getColors()
      setColors(data)
    } catch (err: any) {
      toast.error(err.message || "Failed to load colors")
    }
  }

  const handleAddColor = async () => {
    if (!newColorName.trim()) return

    try {
      await createColor({ name: newColorName, hex: newColorHex })
      toast.success("Color added!")
      setNewColorName("")
      setNewColorHex("#000000")
      loadColors()
    } catch (err: any) {
      toast.error(err.message || "Failed to add color")
    }
  }

  const handleDeleteColor = async (id: number) => {
    try {
      await deleteColor(id)
      toast.success("Color deleted!")
      loadColors()
    } catch (err: any) {
      toast.error(err.message || "Failed to delete color")
    }
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
            <p className="text-center py-8 text-muted-foreground">No colors added yet.</p>
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
                    onClick={() => handleDeleteColor(color.id!)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
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
