const BASE_URL = "https://localhost:7082/api/Color";

export interface ColorDto {
  id?: number;
  name: string;
  hex: string;
}

// ✅ Renkleri listele (herkese açık)
export async function getColors(): Promise<ColorDto[]> {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch colors");
  return res.json();
}

// ✅ Yeni renk ekle (Admin token gerekir)
export async function createColor(data: ColorDto): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to create color");
  }
}

// ✅ Renk sil (Admin token gerekir)
export async function deleteColor(id: number): Promise<void> {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData?.message || "Failed to delete color");
  }
}
