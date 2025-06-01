"use client";

import { useEffect, useState } from "react";
import { getProducts, Product } from "@/services/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Loading state

  useEffect(() => {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));  // Set loading false when data is fetched
  }, []);

  if (loading) return <div className="text-center p-4">Loading products...</div>;
  if (error) return <div className="text-red-600 p-4">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border rounded p-4 shadow">
          <img
            src={product.imageUrl || "/placeholder.svg"} // Fallback image if imageUrl is not available
            alt={product.name}
            className="w-full h-48 object-cover mb-2"
          />
          <h2 className="text-lg font-semibold">{product.name}</h2>
          <p className="font-bold">${product.price.toFixed(2)}</p>
          <p className="text-sm text-muted-foreground">{product.description || "No description available"}</p> {/* Handle missing description */}
        </div>
      ))}
    </div>
  );
}
