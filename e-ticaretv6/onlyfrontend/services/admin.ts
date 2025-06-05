// services/admin.ts

const BASE_URL = "https://localhost:7082/api";

// ✅ Genel fetch helper (isteğe bağlı, DRY prensibi için)
async function fetchWithAuth(endpoint: string, token: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to fetch ${endpoint}`);
  }

  return res.status !== 204 ? res.json() : null;
}

// ✅ Ürünleri listele
export async function getProducts(token: string) {
  return fetchWithAuth("/Product", token);
}

// ✅ Ürün sil
export async function deleteProduct(id: number, token: string) {
  return fetchWithAuth(`/Product/${id}`, token, { method: "DELETE" });
}

// ✅ Ürün oluştur (upload endpointi ile dosya ve renklerle birlikte)
export async function createProduct(data: any, token: string) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("description", data.description || "");
  if (data.image) {
    formData.append("image", data.image);
  }

  // Renk ID'leri varsa
  if (Array.isArray(data.colorOptionIds)) {
    data.colorOptionIds.forEach((id: number) => {
      formData.append("colorOptionIds", id.toString());
    });
  }

  const res = await fetch(`${BASE_URL}/Product/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ürün oluşturulamadı.");
  }

  return await res.json();
}

// ✅ Ürün güncelle (FormData ile)
export async function updateProduct(id: number, data: any, token: string) {
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("price", data.price.toString());
  formData.append("description", data.description || "");

  if (data.image) {
    formData.append("image", data.image); // yeni görsel varsa ekle
  }

  const res = await fetch(`${BASE_URL}/Product/update/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`, // ⚠️ Content-Type belirtilmez, fetch bunu otomatik ayarlar
    },
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Ürün güncellenemedi.");
  }

  return await res.json();
}


// ✅ Siparişleri listele (Admin)
export async function getOrders(token: string) {
  return fetchWithAuth("/Order/all", token);
}

// ✅ Sipariş durumunu güncelle
export async function updateOrderStatus(orderId: number, status: string, token: string) {
  return fetchWithAuth(`/Order/${orderId}/status`, token, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

// ✅ E-posta ile fatura gönder
export async function sendInvoiceEmail(orderId: number, token: string) {
  return fetchWithAuth(`/Order/${orderId}/invoice/send-email`, token, {
    method: "POST",
  });
}

// ✅ Fatura PDF indir
export async function downloadInvoicePdf(orderId: number, token: string) {
  const res = await fetch(`${BASE_URL}/Order/${orderId}/invoice/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error("PDF indirilemedi");

  const blob = await res.blob();
  return blob;
}
// ✅ Ürünü "Featured" olarak işaretle/güncelle
// services/admin.ts içinde

export async function updateFeaturedStatus(productId: number, featured: boolean, token: string) {
  const res = await fetch(`https://localhost:7082/api/Product/display-settings/${productId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      showOnHome: featured,
      showOnButton1: false,
      showOnButton2: false,
      showOnButton3: false,
      showOnButton4: false,
      showOnButton5: false,
    }),
  });

  // Eğer backend 204 NoContent dönerse json() çağırma!
  if (!res.ok && res.status !== 204) {
    const err = await res.text();
    throw new Error(err || "Featured durumu güncellenemedi");
  }
  

  return true;
  
}
// ✅ Admin istatistiklerini getir (toplam, bugün, ay, yıl)
export async function getAdminStats(token: string) {
  return fetchWithAuth("/Order/admin-stats", token);
}

// ✅ Belirli tarih aralığına göre özel istatistik getir
export async function getCustomStats(startDate: string, endDate: string, token: string) {
  return fetchWithAuth("/Order/custom-stats", token, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ startDate, endDate }),
  });
}


