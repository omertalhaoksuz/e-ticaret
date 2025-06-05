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

// ✅ Tüm isteklerde 7082 portunu kullanıyoruz
const BASE_URL = "http://localhost:7082/api/Address";

export async function getAddresses(token?: string): Promise<AddressDto[]> {
  const res = await fetch(BASE_URL, {
    headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
  });
  if (!res.ok) throw new Error('Failed to fetch addresses');
  return res.json();
}

// ✅ Artık ID döndürür
export async function createAddress(data: AddressDto, token: string): Promise<AddressDto> {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create address');
  return res.json();
}

export async function updateAddress(id: number, data: AddressDto, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update address');
}

export async function deleteAddress(id: number, token: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to delete address');
}
