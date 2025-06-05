"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getProducts } from "@/services/admin";
import { getColors } from "@/services/color";
import { Input } from "@/components/ui/input";
import { addToCart } from "@/services/cart";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [userDescription, setUserDescription] = useState<string>("");
  const [selectedColorId, setSelectedColorId] = useState<number | undefined>();
  const [quantity, setQuantity] = useState<number>(1);
  const { token } = useAuth();

  useEffect(() => {
    getProducts("")
      .then((data) => {
        const filtered = data.filter((p: any) => p.showOnHome);
        setProducts(filtered);
      })
      .catch(console.error);

    getColors()
      .then((data) => {
        console.log("Colors fetched:", data);
        setColors(data);
      })
      .catch(console.error);
  }, []);

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setUserDescription("");
    setSelectedColorId(undefined);
    setQuantity(1);
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setUserDescription("");
    setSelectedColorId(undefined);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedProduct || !token) return;

    try {
      await addToCart(
        {
          productId: selectedProduct.id,
          colorOptionId: selectedColorId,
          description: userDescription,
          quantity,
        },
        token
      );
      alert("Product added to cart!");
      closeProductModal();
    } catch (err) {
      alert("Failed to add to cart.");
    }
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/fallback.jpg";
    if (url.startsWith("/uploads/")) return `https://localhost:7082${url}`;
    return url;
  };

  const productColors = selectedProduct
    ? colors.filter((color: any) =>
        !color.productColorOptions ||
        color.productColorOptions.some(
          (pco: any) => pco.productId === selectedProduct.id
        )
      )
    : [];

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to 3D Print Hub</h1>
            <p className="text-lg mb-6">
              We provide high-quality 3D printing services and products for
              professionals, hobbyists, and businesses.
            </p>
            <Button size="lg">Learn More</Button>
          </div>
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg"
              alt="3D Printing"
              width={400}
              height={400}
              className="rounded-lg"
            />
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Image
                  src={getImageUrl(product.imageUrl)}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => openProductModal(product)}
                >
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      <Dialog open={!!selectedProduct} onOpenChange={(open) => !open && closeProductModal()}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogClose className="absolute right-4 top-4">
              <span className="sr-only">Close</span>
            </DialogClose>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="aspect-square relative">
                <Image
                  src={getImageUrl(selectedProduct?.imageUrl)}
                  alt={selectedProduct?.name || "Product"}
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-xl mb-2">
                  {selectedProduct?.name}
                </h3>
                <p className="font-bold text-lg mb-4">
                  ${selectedProduct?.price?.toFixed(2)}
                </p>

                {productColors.length > 0 ? (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">
                      Choose a Color
                    </label>
                    <Select
                      value={selectedColorId?.toString()}
                      onValueChange={(val) => setSelectedColorId(parseInt(val))}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {productColors.map((color: any) => (
                          <SelectItem key={color.id} value={color.id.toString()}>
                            <div className="flex items-center gap-2">
                              <span
                                className="w-4 h-4 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : (
                  <p className="text-sm italic text-red-600 mb-4">
                    No color options available. Please specify your desired color in the description.
                  </p>
                )}

                <label
                  htmlFor="user-description"
                  className="block text-sm font-medium mb-2"
                >
                  Your Description
                </label>
                <textarea
                  id="user-description"
                  rows={3}
                  className="w-full rounded-md border border-gray-300 p-2 mb-4"
                  placeholder="Write your description or notes here..."
                  value={userDescription}
                  onChange={(e) => setUserDescription(e.target.value)}
                />

                <label
                  htmlFor="quantity"
                  className="block text-sm font-medium mb-2"
                >
                  Quantity
                </label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="mb-4"
                />

                <Button className="mt-auto" onClick={handleAddToCart}>
                  Add to Cart
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
