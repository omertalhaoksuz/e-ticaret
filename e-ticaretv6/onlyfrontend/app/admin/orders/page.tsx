"use client";

import { useState, useEffect } from "react";
import { getOrders, updateOrderStatus } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Package, Check, Clock, X, MoreHorizontal } from "lucide-react";

interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
}

interface AdminOrder {
  orderId: number;
  userFullName: string;
  userEmail: string;
  status: string;
  items: OrderItem[];
  createdAt: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getOrders(token)
      .then(setOrders)
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleUpdateOrderStatus = async (orderId: number, status: string) => {
    if (!token) return;
    try {
      await updateOrderStatus(orderId, status, token);
      setOrders((prev) =>
        prev.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      alert("Failed to update order status");
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "flex items-center gap-1";
    switch (status) {
      case "pending":
        return (
          <Badge variant="secondary" className={baseClass}>
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case "processing":
        return (
          <Badge variant="secondary" className={`${baseClass} bg-blue-50 text-blue-700 border-blue-300`}>
            <Package className="h-3 w-3" />
            Processing
          </Badge>
        );
      case "completed":
        return (
          <Badge variant="secondary" className={`${baseClass} bg-green-50 text-green-700 border-green-300`}>
            <Check className="h-3 w-3" />
            Completed
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="secondary" className={`${baseClass} bg-red-50 text-red-700 border-red-300`}>
            <X className="h-3 w-3" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const calculateTotal = (items: OrderItem[]) =>
    items.reduce((acc, item) => acc + item.quantity * (item.price ?? 0), 0);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "pending", "processing", "completed", "rejected"].map((status) => (
          <Button
            key={status}
            variant={statusFilter === status ? "default" : "outline"}
            onClick={() => setStatusFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="table-auto w-full">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Order ID</th>
                  <th className="px-4 py-2 text-left">Customer</th>
                  <th className="px-4 py-2 text-left">Status</th>
                  <th className="px-4 py-2 text-left">Total</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders
                  .filter(order => statusFilter === "all" || order.status === statusFilter)
                  .map((order) => (
                    <tr key={order.orderId}>
                      <td className="px-4 py-2">{order.orderId}</td>
                      <td className="px-4 py-2">
                        {order.userFullName}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {order.userEmail}
                        </span>
                      </td>
                      <td className="px-4 py-2">{getStatusBadge(order.status)}</td>
                      <td className="px-4 py-2">
                        ${calculateTotal(order.items).toFixed(2)}
                      </td>
                      <td className="px-4 py-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "pending")}>
                              Mark as Pending
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "processing")}>
                              Mark as Processing
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "completed")}>
                              Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleUpdateOrderStatus(order.orderId, "rejected")}>
                              Mark as Rejected
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/orders/${order.orderId}`}>View Details</Link>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
