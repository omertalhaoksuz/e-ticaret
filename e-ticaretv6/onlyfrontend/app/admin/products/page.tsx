"use client";

import { useState, useEffect } from "react";
import { getProducts, deleteProduct, createProduct, updateProduct } from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    imageUrl: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getProducts(token)
      .then(setProducts)
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      alert("Failed to delete product");
    }
  };

  const handleCreateProduct = async () => {
    if (!token) return;
    try {
      await createProduct(newProduct, token);
      setProducts([...products, newProduct]);
      setNewProduct({
        name: "",
        price: 0,
        imageUrl: "",
        description: "",
      });
    } catch (error) {
      alert("Failed to create product");
    }
  };

  const handleUpdateProduct = async (id: number) => {
    if (!token) return;
    try {
      await updateProduct(id, newProduct, token);
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...newProduct } : product
      );
      setProducts(updatedProducts);
    } catch (error) {
      alert("Failed to update product");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Product Management</h1>

      {/* Create Product */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="text"
            placeholder="Product Name"
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            className="mb-4"
          />
          <Input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: +e.target.value })}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="Image URL"
            value={newProduct.imageUrl}
            onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
            className="mb-4"
          />
          <Input
            type="text"
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="mb-4"
          />
          <Button onClick={handleCreateProduct}>Create Product</Button>
        </CardContent>
      </Card>

      {/* Product List */}
      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {products.map((product) => (
              <li key={product.id} className="py-2 flex justify-between">
                <div>{product.name}</div>
                <div>
                  <Button onClick={() => handleUpdateProduct(product.id)}>Update</Button>
                  <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
