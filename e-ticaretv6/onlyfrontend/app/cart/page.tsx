"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { useAuth } from "@/contexts/AuthContext";
import { getCartItems, addToCart, removeCartItem, AddToCartDto, CartItemDto } from "@/services/cart";

export default function CartPage() {
  const router = useRouter();
  const { token } = useAuth();

  const [cartItems, setCartItems] = useState<CartItemDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    setLoading(true);

    getCartItems(token)
      .then(setCartItems)
      .catch((error) => alert("Failed to load cart: " + error.message))
      .finally(() => setLoading(false));
  }, [token]);

  const updateQuantity = async (id: number, newQuantity: number) => {
    if (!token) return;
    if (newQuantity < 1) return;

    const item = cartItems.find(i => i.id === id);
    if (!item) return;

    try {
      const data: AddToCartDto = {
        productId: item.productId,
        colorOptionId: item.colorOptionId,
        description: item.description,
        quantity: newQuantity,
      };
      await addToCart(data, token);

      setCartItems(items =>
        items.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch {
      alert("Failed to update quantity");
    }
  };

  const removeItem = async (id: number) => {
    if (!token) return;

    try {
      await removeCartItem(id, token);
      setCartItems(items => items.filter(item => item.id !== id));
    } catch {
      alert("Failed to remove item");
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    router.push("/checkout");
  };

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

      {cartItems.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-4">
                Looks like you haven&apos;t added any products to your cart yet.
              </p>
              <Button onClick={() => router.push("/")}>Continue Shopping</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cart Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="divide-y">
                  {cartItems.map(item => (
                    <li key={item.id} className="py-4 flex items-center">
                      <div className="flex-shrink-0 mr-4">
                        <Image
                          src={item.product.imageUrl || "/placeholder.svg"}
                          alt={item.product.name}
                          width={80}
                          height={80}
                          className="rounded-md"
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-muted-foreground">${item.product.price.toFixed(2)}</p>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id!, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={e => updateQuantity(item.id!, Number.parseInt(e.target.value) || 1)}
                            className="h-8 w-12 rounded-none text-center"
                            min={1}
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id!, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id!)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">Remove</span>
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" size="lg" onClick={handleCheckout}>
                  Proceed to Checkout
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
