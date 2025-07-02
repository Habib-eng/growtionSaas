// Centralized API client for authentication endpoints

const API_BASE_URL = 'http://localhost:3000';

export async function signUp({ name, email, password }: { name: string; email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Sign up failed');
  return result;
}

export async function signIn({ email, password }: { email: string; password: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/signin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || 'Sign in failed');
  return result;
}

export async function getProducts() {
  const token = localStorage.getItem('token') || '';
  const response = await fetch(`${API_BASE_URL}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}
