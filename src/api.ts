const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // Auth
  login: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Login failed');
    return res.json();
  },
  sendCode: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/send-code`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Failed to send code');
    return res.json();
  },
  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Registration failed');
    return res.json();
  },

  // Comics
  getComics: async () => {
    const res = await fetch(`${API_URL}/comics`);
    return res.json();
  },
  getComic: async (id: string) => {
    const res = await fetch(`${API_URL}/comics/${id}`);
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  getChapters: async (comicId: string) => {
    const res = await fetch(`${API_URL}/comics/${comicId}/chapters`);
    return res.json();
  },
  getChapterPages: async (comicId: string, chapterNumber: string) => {
    const res = await fetch(`${API_URL}/comics/${comicId}/chapter/${chapterNumber}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  unlockChapter: async (chapterId: string) => {
    const res = await fetch(`${API_URL}/comics/unlock/${chapterId}`, {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Payments (Razorpay)
  createOrder: async (amount: number, coins: number) => {
    const res = await fetch(`${API_URL}/payments/create-order`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ amount, coins })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  verifyPayment: async (paymentData: any) => {
    const res = await fetch(`${API_URL}/payments/verify-payment`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(paymentData)
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Uploads
  uploadComic: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/upload/comic`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }, // Browser sets Content-Type boundary automatically for FormData
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  uploadChapter: async (formData: FormData) => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_URL}/upload/chapter`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },

  // Users & Profile
  getProfile: async () => {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  toggleBookmark: async (comicId: string) => {
    const res = await fetch(`${API_URL}/users/bookmarks/toggle`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ comicId })
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  },
  checkBookmark: async (comicId: string) => {
    const res = await fetch(`${API_URL}/users/bookmarks/check/${comicId}`, {
      headers: getHeaders()
    });
    if (!res.ok) return { bookmarked: false };
    return res.json();
  }
};
