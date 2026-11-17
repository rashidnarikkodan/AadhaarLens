const rawUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/+$/, '');
const API_BASE_URL = rawUrl.endsWith('/api') ? rawUrl : `${rawUrl}/api`;

export async function uploadAadhaar(data: FormData) {
  const response = await fetch(`${API_BASE_URL}/aadhaar`, {
    method: 'POST',
    body: data,
  });
  return await response.json();
}
