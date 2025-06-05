"use client";

import { useState, useEffect, useRef } from "react";
import {
  getProducts,
  deleteProduct,
  updateProduct,
  updateFeaturedStatus,
  createProduct,
} from "@/services/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

export default function AdminProductPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: 0,
    description: "",
    featured: false,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    getProducts(token)
      .then(setProducts)
      .catch((error) => alert(error.message))
      .finally(() => setLoading(false));
  }, [token]);

  const resetForm = () => {
    setEditingProduct(null);
    setNewProduct({ name: "", price: 0, description: "", featured: false });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const handleDeleteProduct = async (id: number) => {
    if (!token) return;
    try {
      await deleteProduct(id, token);
      setProducts(products.filter((product) => product.id !== id));
    } catch {
      alert("Failed to delete product");
    }
  };

  const handleEditClick = (product: any) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      description: product.description,
      featured: product.showOnHome,
    });
    setIsModalOpen(true);
  };

  const handleAddClick = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!token) return;

    if (editingProduct) {
      const formData = new FormData();
      formData.append("name", newProduct.name);
      formData.append("price", newProduct.price.toString());
      formData.append("description", newProduct.description);
      if (imageFile) formData.append("image", imageFile);

      try {
        const res = await fetch(`https://localhost:7082/api/Product/update/${editingProduct.id}`, {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        });

        if (!res.ok) throw new Error("Güncelleme başarısız");
        const updated = await res.json();

        await updateFeaturedStatus(editingProduct.id, newProduct.featured, token);

        setProducts(products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...updated, showOnHome: newProduct.featured }
            : p
        ));

        setIsModalOpen(false);
        resetForm();
      } catch {
        alert("Güncelleme başarısız");
      }
    } else {
      if (!imageFile) return alert("Lütfen görsel seçin.");

      try {
        const created = await createProduct(
          {
            ...newProduct,
            image: imageFile,
            colorOptionIds: [],
          },
          token
        );

        if (newProduct.featured) {
          await updateFeaturedStatus(created.id, true, token);
          created.showOnHome = true;
        }

        setProducts([...products, created]);
        setIsModalOpen(false);
        resetForm();
      } catch {
        alert("Ürün eklenemedi.");
      }
    }
  };

  const toggleFeatured = async (id: number, current: boolean) => {
    if (!token) return;
    try {
      await updateFeaturedStatus(id, !current, token);
      setProducts(products.map(p => p.id === id ? { ...p, showOnHome: !current } : p));
    } catch {
      alert("Featured güncellenemedi");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={handleAddClick}>Add Product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="table-auto w-full text-sm">
            <thead>
              <tr>
                <th className="text-left p-2">Image</th>
                <th className="text-left p-2">Name</th>
                <th className="text-left p-2">Price</th>
                <th className="text-left p-2">Description</th>
                <th className="text-left p-2">Featured</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-t">
                  <td className="p-2">
                    <img
                      src={`https://localhost:7082${product.imageUrl}`}
                      alt={product.name}
                      className="h-12 w-12 object-cover border rounded"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src = "/fallback.jpg")
                      }
                    />
                  </td>
                  <td className="p-2">{product.name}</td>
                  <td className="p-2">${product.price?.toFixed(2)}</td>
                  <td className="p-2">{product.description}</td>
                  <td className="p-2">
                    <button
                      onClick={() => toggleFeatured(product.id, product.showOnHome)}
                      className={`text-xs px-2 py-1 rounded ${product.showOnHome
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"}`}
                    >
                      {product.showOnHome ? "Yes" : "No"}
                    </button>
                  </td>
                  <td className="p-2 space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditClick(product)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            <DialogClose />
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Product Name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Price"
              value={newProduct.price}
              onChange={(e) =>
                setNewProduct({ ...newProduct, price: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              placeholder="Description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
            {editingProduct && (
              <div className="flex items-center space-x-4">
                <img
                  src={`https://localhost:7082${editingProduct.imageUrl}`}
                  alt="Current"
                  className="h-20 w-20 object-cover border rounded"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/fallback.jpg")
                  }
                />
                <span className="text-sm text-gray-500">Current Image</span>
              </div>
            )}
            <Input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setImageFile(file);
              }}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={newProduct.featured}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, featured: e.target.checked })
                }
              />
              <label>Show on Homepage</label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>
                {editingProduct ? "Update Product" : "Create Product"}
              </Button>
              <Button onClick={() => { setIsModalOpen(false); resetForm(); }} variant="secondary">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
