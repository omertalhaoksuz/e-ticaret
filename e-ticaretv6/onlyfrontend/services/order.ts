export interface OrderItemDto {
  productName: string;
  imageUrl: string;
  colorName: string;
  description: string;
  quantity: number;
}

export interface OrderDto {
  orderId: number;
  status: string;
  createdAt: string;
  items: OrderItemDto[];
  billingFullName: string;
  billingPhone: string;
  billingCity: string;
  billingDistrict: string;
  billingFullAddress: string;
}

export interface CreateOrderDto {
  billingAddressId: number;
}

export async function createOrder(data: CreateOrderDto, token: string): Promise<void> {
  const res = await fetch('/api/Order/create', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create order');
}

export async function getMyOrders(token: string): Promise<OrderDto[]> {
  const res = await fetch('/api/Order/my-orders', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
}

export async function getAllOrders(token: string): Promise<OrderDto[]> {
  const res = await fetch('/api/Order/all', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch all orders');
  return res.json();
}

export async function updateOrderStatus(orderId: number, status: string, token: string): Promise<void> {
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
