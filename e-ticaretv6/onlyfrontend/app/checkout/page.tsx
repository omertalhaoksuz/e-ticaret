"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { getCartItems, CartItemDto } from "@/services/cart";
import { createOrder } from "@/services/order";

export default function CheckoutPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    fullAddress: "",
  });

  useEffect(() => {
    if (!token) return;

    getCartItems(token)
      .then(setCartItems)
      .catch(console.error)
      .finally(() => setLoading(false));

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Address`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setAddresses(data); // ❗ Tüm adresleri yükle
      })
      .catch(console.error);
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSelectAddress = (addressId: number) => {
    const address = addresses.find((a) => a.id === addressId);
    if (!address) return;

    setSelectedAddressId(address.id);
    setForm({
      fullName: address.fullName,
      phone: address.phone,
      city: address.city,
      district: address.district,
      fullAddress: address.fullAddress,
    });
  };

  const calculateTotal = () =>
    cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );

  const handleOrderSubmit = async () => {
    if (!selectedAddressId || !token) return;
    try {
      await createOrder({ billingAddressId: selectedAddressId }, token);
      router.push("/thank-you");
    } catch (err: any) {
      alert(err.message || "Order failed.");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Billing Form */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Billing Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 && (
            <div className="space-y-2">
              <label className="block font-medium">Select a Saved Address</label>
              <select
                className="w-full border rounded px-3 py-2"
                onChange={(e) => handleSelectAddress(Number(e.target.value))}
                defaultValue=""
              >
                <option value="" disabled>
                  -- Choose an address --
                </option>
                {addresses.map((addr) => (
                  <option key={addr.id} value={addr.id}>
                    {addr.title} - {addr.city}/{addr.district}
                  </option>
                ))}
              </select>
            </div>
          )}

          <Input
            name="fullName"
            placeholder="Full Name"
            value={form.fullName}
            onChange={handleChange}
          />
          <Input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
          />
          <Input
            name="city"
            placeholder="City"
            value={form.city}
            onChange={handleChange}
          />
          <Input
            name="district"
            placeholder="District"
            value={form.district}
            onChange={handleChange}
          />
          <Input
            name="fullAddress"
            placeholder="Full Address"
            value={form.fullAddress}
            onChange={handleChange}
          />
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between">
              <span>
                {item.product.name} × {item.quantity}
              </span>
              <span>${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>${calculateTotal().toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleOrderSubmit}
            disabled={!selectedAddressId}
          >
            Place Order
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
