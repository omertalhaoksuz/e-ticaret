export interface User {
  id: string;
  fullName?: string;
  role?: string;
  email?: string;
  token?: string;
  // diğer alanlar
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

export async function login(data: LoginDto): Promise<User> {
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
export interface UpdateProfileDto {
  fullName: string;
  phone: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfile(data: UpdateProfileDto, token: string): Promise<void> {
  const res = await fetch('/api/Auth/update', {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Profile update failed');
  }
}

export async function changePassword(data: ChangePasswordDto, token: string): Promise<void> {
  const res = await fetch('/api/Auth/change-password', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Password change failed');
  }
}

