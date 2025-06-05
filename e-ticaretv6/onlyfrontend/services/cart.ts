const BASE_URL = "https://localhost:7082";

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

// ✅ Sepeti getir
export async function getCartItems(token: string): Promise<CartItemDto[]> {
  const res = await fetch(`${BASE_URL}/api/Cart`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to fetch cart items");
  return res.json();
}

// ✅ Sepete ürün ekle/güncelle
export async function addToCart(data: AddToCartDto, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/Cart/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to add to cart");
}

// ✅ Sepetten ürün sil
export async function removeCartItem(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/Cart/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("Failed to remove cart item");
}
