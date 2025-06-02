// User, LoginDto, RegisterDto, UpdateProfileDto ve ChangePasswordDto gibi interface'leri dışa aktarıyoruz.
export interface User {
  id: string;
  fullName?: string;
  role?: string;
  email?: string;
  token?: string;
  // Diğer alanlar (örneğin: profil fotoğrafı, adres vs.)
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

// Login işlemi
export async function login(data: LoginDto): Promise<User> {
  const res = await fetch('https://localhost:7082/api/Auth/login', {  // Backend API URL'ini doğru olarak ayarlıyoruz
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Login failed');
  }

  // Token'ı backend'den alıp, kullanıcının bilgilerini döndürüyoruz
  const user: User = await res.json();
  localStorage.setItem('token', user.token!);  // Token'ı localStorage'a kaydediyoruz
  return user;  // Kullanıcıyı döndürüyoruz
}

// Register işlemi
export async function register(data: RegisterDto): Promise<User> {
  const res = await fetch('https://localhost:7082/api/Auth/register', {  // Backend API URL'ini doğru olarak ayarlıyoruz
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Registration failed');
  }

  // Token'ı backend'den alıp, kullanıcının bilgilerini döndürüyoruz
  const user: User = await res.json();
  localStorage.setItem('token', user.token!);  // Token'ı localStorage'a kaydediyoruz
  return user;  // Kullanıcıyı döndürüyoruz
}

// Profile güncelleme
export async function updateProfile(data: UpdateProfileDto, token: string): Promise<void> {
  const res = await fetch('https://localhost:7082/api/Auth/update', {  // Backend API URL'ini doğru olarak ayarlıyoruz
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token'ı Authorization header'ına ekliyoruz
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Profile update failed');
  }
}

// Şifre değiştirme
export async function changePassword(data: ChangePasswordDto, token: string): Promise<void> {
  const res = await fetch('https://localhost:7082/api/Auth/change-password', {  // Backend API URL'ini doğru olarak ayarlıyoruz
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`  // Token'ı Authorization header'ına ekliyoruz
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Password change failed');
  }
}
