import { API_BASE_URL } from '@/lib/api';

export async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ message: 'An unexpected error occurred' }));
    throw new Error(errorData.message || `HTTP Error ${res.status}`);
  }

  return res.json();
}
