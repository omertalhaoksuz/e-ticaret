export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  colors: string[];
  productColorOptions: {
    colorOptionId: number;
    colorOption: string;
  }[];
  showOnHome: boolean;
  showOnButton1: boolean;
  showOnButton2: boolean;
  showOnButton3: boolean;
  showOnButton4: boolean;
  showOnButton5: boolean;
}

// Ürünleri listele
export async function getProducts(): Promise<Product[]> {
  const res = await fetch('/api/Product');
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Ürün detaylarını al
export async function getProductById(id: number): Promise<Product> {
  const res = await fetch(`/api/Product/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}

// Ürün ekle
export async function createProduct(data: Product, token: string): Promise<void> {
  const res = await fetch('/api/Product', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create product');
}

// Ürün güncelle
export async function updateProduct(id: number, data: Product, token: string): Promise<void> {
  const res = await fetch(`/api/Product/update/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update product');
}

// Ürün silme
export async function deleteProduct(id: number, token: string): Promise<void> {
  const res = await fetch(`/api/Product/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}
