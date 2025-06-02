"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface OrderItem {
  productName: string
  imageUrl: string
  colorName: string
  description: string
  quantity: number
}

interface Order {
  orderId: number
  status: string
  createdAt: string
  items: OrderItem[]
  billingFullName: string
  billingPhone: string
  billingCity: string
  billingDistrict: string
  billingFullAddress: string
}

export default function OrdersPage() {
  const { token, user } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch("https://localhost:7082/api/Order/my-orders", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error("Failed to fetch orders")
        }

        const data = await response.json()
        setOrders(data)
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [token, router])

  const downloadInvoice = async (orderId: number) => {
    try {
      const response = await fetch(`https://localhost:7082/api/Order/${orderId}/invoice/pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("PDF indirilemedi.")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = `invoice-${orderId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (err) {
      console.error("Fatura indirme hatası:", err)
    }
  }

  if (!user || loading) return <p className="p-6">Loading...</p>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <p>You have no orders yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order.orderId} className="mb-6">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">Order #{order.orderId}</div>
                  <div className="text-sm text-muted-foreground">
                    Ordered on {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <Badge
                  variant="default"
                  className={
                    order.status === "Delivered"
                      ? "bg-green-600 text-white"
                      : "bg-gray-300 text-black"
                  }
                >
                  {order.status}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {order.items.map((item, index) => (
                  <li key={index} className="flex flex-col sm:flex-row justify-between">
                    <span>
                      {item.productName} x {item.quantity} ({item.colorName})
                    </span>
                    <span className="text-sm text-muted-foreground">{item.description}</span>
                  </li>
                ))}
              </ul>
              <Separator className="my-4" />
              <div className="text-sm text-muted-foreground">
                <strong>Billing:</strong> {order.billingFullName}, {order.billingPhone}, {order.billingCity}/
                {order.billingDistrict} - {order.billingFullAddress}
              </div>
              <Button
                variant="outline"
                onClick={() => downloadInvoice(order.orderId)}
                className="mt-4"
              >
                Fatura PDF
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
