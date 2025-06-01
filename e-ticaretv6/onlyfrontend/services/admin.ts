// Ürünleri listele
export async function getProducts(token: string) {
  const res = await fetch('/api/Product', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Ürün silme
export async function deleteProduct(id: number, token: string) {
  const res = await fetch(`/api/Product/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete product');
}

// Ürün ekle
export async function createProduct(data: any, token: string) {
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
export async function updateProduct(id: number, data: any, token: string) {
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
// Siparişleri listele
export async function getOrders(token: string) {
  const res = await fetch('/api/Order/all', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

// Sipariş durumu güncelle
export async function updateOrderStatus(orderId: number, status: string, token: string) {
  const res = await fetch(`/api/Order/${orderId}/status`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error('Failed to update order status');
}
// Invoice
export async function sendInvoiceEmail(orderId: number, token: string) {
  const res = await fetch(`/api/Order/${orderId}/invoice/send-email`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to send invoice');
  }

  return res.json();
}
