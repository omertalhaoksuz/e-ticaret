export interface User {
  id: string;
  fullName?: string;
  role?: string;
  email?: string;
  token?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export interface UpdateProfileDto {
  fullName: string;
  phone: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

// ✅ Login işlemi
export async function login(data: LoginDto): Promise<User> {
  const res = await fetch("https://localhost:7082/api/Auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Login failed");
  }

  const result = await res.json();

  const user: User = {
    id: result.id,
    fullName: result.fullName,
    email: result.email,
    role: result.role,
    token: result.token,
  };

  localStorage.setItem("token", user.token!);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

// ✅ Register işlemi
export async function register(data: RegisterDto): Promise<User> {
  const res = await fetch("https://localhost:7082/api/Auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Registration failed");
  }

  const result = await res.json();

  const user: User = {
    id: result.id,
    fullName: result.fullName,
    email: result.email,
    role: result.role,
    token: result.token,
  };

  localStorage.setItem("token", user.token!);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
}

// Profil güncelleme
export async function updateProfile(data: UpdateProfileDto, token: string): Promise<void> {
  const res = await fetch("https://localhost:7082/api/Auth/update", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Profile update failed");
  }
}

// Şifre değiştirme
export async function changePassword(data: ChangePasswordDto, token: string): Promise<void> {
  const res = await fetch("https://localhost:7082/api/Auth/change-password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Password change failed");
  }
}
