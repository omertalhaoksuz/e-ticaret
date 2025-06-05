"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvoiceItem {
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  description?: string;
}

interface Invoice {
  orderId: number;
  fullName: string;
  email: string;
  orderDate: string;
  status: string;
  items: InvoiceItem[];
  billingFullName?: string;
  billingPhone?: string;
  billingCity?: string;
  billingDistrict?: string;
  billingFullAddress?: string;
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;

    fetch(`https://localhost:7082/api/Order/${id}/invoice`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then(setInvoice)
      .catch(() => alert("Failed to load invoice"));
  }, [id, token]);

  if (!invoice) return <div className="p-6">Loading...</div>;

  const total = invoice.items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <Card className="m-6">
      <CardHeader>
        <CardTitle>Order #{invoice.orderId} Details</CardTitle>
        <p>Status: <strong>{invoice.status}</strong></p>
      </CardHeader>
      <CardContent>
        <p><strong>Customer:</strong> {invoice.fullName} ({invoice.email})</p>
        <p><strong>Order Date:</strong> {new Date(invoice.orderDate).toLocaleString()}</p>
        <hr className="my-4" />
        <h3 className="text-lg font-semibold">Items</h3>
        <ul className="mb-4 space-y-2">
          {invoice.items.map((item, index) => (
            <li key={index} className="text-sm">
              <strong>{item.productName}</strong> — {item.color ?? "No Color"} — {item.quantity} x ${item.price.toFixed(2)}
              {item.description && (
                <p className="text-muted-foreground italic mt-1">Note: {item.description}</p>
              )}
            </li>
          ))}
        </ul>
        <p><strong>Total:</strong> ${total.toFixed(2)}</p>
        <hr className="my-4" />
        <h3 className="text-lg font-semibold">Billing Address</h3>
        <p>{invoice.billingFullName}</p>
        <p>{invoice.billingPhone}</p>
        <p>{invoice.billingDistrict}, {invoice.billingCity}</p>
        <p>{invoice.billingFullAddress}</p>
      </CardContent>
    </Card>
  );
}
