// services/api.ts

export interface User {
  id: string;
  fullName?: string;
  role?: string;
  userName?: string;
  normalizedUserName?: string;
  email?: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: boolean;
  twoFactorEnabled: boolean;
  lockoutEnd?: string;  // ISO date string
  lockoutEnabled: boolean;
  accessFailedCount: number;
}

// Giriş için gönderilecek veri
export interface LoginDto {
  email: string;
  password: string;
}

// Kayıt için gönderilecek veri
export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

// Adres tipi
export interface AddressDto {
  id?: number;
  title: string;
  fullName: string;
  phone: string;
  city: string;
  district: string;
  fullAddress: string;
  isBillingAddress: boolean;
}

// Sepet öğesi tipi
export interface CartItemDto {
  id?: number;
  productId: number;
  colorOptionId: number;
  description: string;
  quantity: number;
}

// Auth Servisleri

export async function login(data: LoginDto): Promise<User & { token?: string }> {
  const res = await fetch('/api/Auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }
  return res.json();
}

export async function register(data: RegisterDto): Promise<User> {
  const res = await fetch('/api/Auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function updateProfile(data: { fullName: string; phone: string }): Promise<void> {
  const res = await fetch('/api/Auth/update', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Profile update failed');
}

// Address Servisleri

export async function getAddresses(): Promise<AddressDto[]> {
  const res = await fetch('/api/Address');
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
}

export async function createAddress(data: AddressDto): Promise<void> {
  const res = await fetch('/api/Address', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create address');
}

export async function updateAddress(id: number, data: AddressDto): Promise<void> {
  const res = await fetch(`/api/Address/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update address');
}

export async function deleteAddress(id: number): Promise<void> {
  const res = await fetch(`/api/Address/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete address');
}

// Cart Servisleri

export async function getCartItems(): Promise<CartItemDto[]> {
  const res = await fetch('/api/Cart');
  if (!res.ok) throw new Error('Failed to fetch cart items');
  return res.json();
}

export async function addToCart(data: CartItemDto): Promise<void> {
  const res = await fetch('/api/Cart/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to add to cart');
}

export async function removeCartItem(id: number): Promise<void> {
  const res = await fetch(`/api/Cart/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to remove cart item');
}
