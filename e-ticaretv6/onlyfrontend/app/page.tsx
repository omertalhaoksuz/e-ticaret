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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { getProducts } from "@/services/admin";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");

  useEffect(() => {
    getProducts("").then((data) => {
      const filtered = data.filter((p: any) => p.showOnHome);
      setProducts(filtered);
    });
  }, []);

  const openProductModal = (product: any) => {
    setSelectedProduct(product);
    setSelectedColor(product.colors?.[0] || "");
  };

  const closeProductModal = () => {
    setSelectedProduct(null);
    setSelectedColor("");
  };

  const addToCart = () => {
    alert(
      `Added ${selectedProduct.name} to cart${selectedColor ? ` in ${selectedColor}` : ""}`
    );
    closeProductModal();
  };

  const getImageUrl = (url: string | undefined) => {
    if (!url) return "/fallback.jpg";
    if (url.startsWith("/uploads/")) return `https://localhost:7082${url}`;
    return url;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="mb-16">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl font-bold mb-4">Welcome to 3D Print Hub</h1>
            <p className="text-lg mb-6">
              We provide high-quality 3D printing services and products for
              professionals, hobbyists, and businesses. With our state-of-the-art
              equipment and expert team, we deliver exceptional results for all
              your 3D printing needs.
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
                <h3 className="font-bold text-xl mb-2">{selectedProduct?.name}</h3>
                <p className="font-bold text-lg mb-4">${selectedProduct?.price?.toFixed(2)}</p>
                {selectedProduct?.colors?.length > 0 && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2">Color</label>
                    <Select value={selectedColor} onValueChange={setSelectedColor}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a color" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProduct.colors.map((color: string) => (
                          <SelectItem key={color} value={color}>
                            {color}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <DialogDescription className="mb-4">
                  {selectedProduct?.description}
                </DialogDescription>
                <Button className="mt-auto" onClick={addToCart}>
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
