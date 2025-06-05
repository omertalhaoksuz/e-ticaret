"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { getAdminStats, getCustomStats } from "@/services/admin"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { CalendarIcon, Users, DollarSign, Package } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export default function AdminDashboard() {
  const { token } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [customStats, setCustomStats] = useState<any>(null)
  const [period, setPeriod] = useState("weekly")

  useEffect(() => {
    if (!token) return
    getAdminStats(token)
      .then(setStats)
      .catch(() => alert("İstatistikler alınamadı"))
      .finally(() => setLoading(false))
  }, [token])

  const handleCustomStats = async () => {
    if (!token || !date) return
    const start = new Date(date)
    start.setHours(0, 0, 0, 0)
    const end = new Date(date)
    end.setHours(23, 59, 59, 999)

    try {
      const res = await getCustomStats(start.toISOString(), end.toISOString(), token)
      setCustomStats(res)
    } catch {
      alert("Custom stats yüklenemedi.")
    }
  }

  if (loading) return <div className="p-6">Loading dashboard...</div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[180px] justify-start">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.toLocaleDateString() || "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Orders</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.todayOrders ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.todayRevenue?.toFixed(2) ?? "0.00"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.monthRevenue?.toFixed(2) ?? "0.00"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yearly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.yearRevenue?.toFixed(2) ?? "0.00"}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="topProducts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="topProducts">Top Products</TabsTrigger>
          <TabsTrigger value="customStats">Custom Stats</TabsTrigger>
        </TabsList>

        <TabsContent value="topProducts">
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats?.topProducts ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="productName" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalSold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customStats">
          <Card>
            <CardHeader>
              <CardTitle>Custom Date Range Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={handleCustomStats}>Get Stats for Selected Date</Button>
              {customStats && (
                <div>
                  <p className="font-semibold">Orders: {customStats.orderCount}</p>
                  <p className="font-semibold">Revenue: ${customStats.revenue?.toFixed(2)}</p>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={customStats.productSales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="productName" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="totalSold" fill="#10b981" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
