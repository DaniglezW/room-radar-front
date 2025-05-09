import { LoginRequest, RegisterRequest, PracticeResponse } from '../types/Auth';

const API_BASE = process.env.NEXT_PUBLIC_AUTH_URL + '/auth';

export async function loginUser(data: LoginRequest): Promise<PracticeResponse> {
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al iniciar sesión');
  return await res.json();
}

export async function registerUser(data: RegisterRequest): Promise<PracticeResponse> {
  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al registrarse');
  return await res.json();
}
