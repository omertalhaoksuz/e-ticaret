export interface CartItemDto {
  id?: number;
  productId: number;
  product: {
    name: string;
    price: number;
    imageUrl: string;
  };
  colorOptionId?: number;
  description?: string;
  quantity: number;
}

export interface AddToCartDto {
  productId: number;
  colorOptionId?: number;
  description?: string;
  quantity: number;
}

export async function getCartItems(token: string): Promise<CartItemDto[]> {
  const res = await fetch('/api/Cart', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch cart items');
  return res.json();
}

export async function addToCart(data: AddToCartDto, token: string): Promise<void> {
  const res = await fetch('/api/Cart/add', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
}

export async function removeCartItem(id: number, token: string): Promise<void> {
  const res = await fetch(`/api/Cart/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to remove cart item');
}
