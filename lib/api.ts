import { Book, User, Sold, Genre } from '../types';

export const API_BASE_URL = '/api'; // Backend API manzili (server.ts or PHP)

/**
 * Umumiy fetch funksiyasi. Backendga so'rov yuborish uchun ishlatiladi.
 */
export async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API xatosi: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data as T;
  } catch (error) {
    console.error(`Fetch xatosi (${endpoint}):`, error);
    throw error;
  }
}

// ==========================================
// AUTHENTICATION (Avtorizatsiya)
// ==========================================

export async function loginUser(email: string, password: string): Promise<{ user: User, token?: string }> {
  return fetchApi<{ user: User, token?: string }>('/login.php', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function registerUser(userData: Omit<User, 'id'>): Promise<{ user: User }> {
  return fetchApi<{ user: User }>('/register.php', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// ==========================================
// USERS (Foydalanuvchilar - Admin uchun)
// ==========================================

export async function getUsers(): Promise<User[]> {
  return fetchApi<User[]>('/users.php', { 
    method: 'GET' 
  });
}

export async function deleteUser(id: number): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/users.php?id=${id}`, { 
    method: 'DELETE' 
  });
}

export async function toggleUserAdmin(id: number, admin: boolean): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/users.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ admin }),
  });
}

// ==========================================
// BOOKS (Kitoblar)
// ==========================================

export async function getBooks(): Promise<Book[]> {
  return fetchApi<Book[]>('/books.php', { 
    method: 'GET' 
  });
}

export async function searchBooksFromBackend(query: string): Promise<Book[]> {
  return fetchApi<Book[]>(`/books.php?search=${encodeURIComponent(query)}`, { 
    method: 'GET' 
  });
}

export async function createBook(bookData: Omit<Book, 'id'>): Promise<Book> {
  return fetchApi<Book>('/books.php', {
    method: 'POST',
    body: JSON.stringify(bookData),
  });
}

export async function getBookById(id: string): Promise<Book> {
  return fetchApi<Book>(`/books.php?id=${id}`, { 
    method: 'GET' 
  });
}

// Bitta kitobni tahrirlash (ID va o'zgargan ma'lumotlar yuboriladi)
export async function updateBook(id: number, bookData: Partial<Book>): Promise<Book> {
  return fetchApi<Book>(`/books.php?id=${id}`, {
    method: 'PUT',
    body: JSON.stringify(bookData),
  });
}

export async function deleteBook(id: number): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(`/books.php?id=${id}`, { 
    method: 'DELETE' 
  });
}

// ==========================================
// GENRES (Janrlar)
// ==========================================

export async function getGenres(): Promise<Genre[]> {
  return fetchApi<Genre[]>('/genres.php', { 
    method: 'GET' 
  });
}

// ==========================================
// SOLD (Sotilganlar)
// ==========================================

export async function getSoldItems(): Promise<Sold[]> {
  return fetchApi<Sold[]>('/sold.php', { 
    method: 'GET' 
  });
}

export async function getUserSoldItems(userId: string): Promise<Sold[]> {
  return fetchApi<Sold[]>(`/sold.php?user_id=${userId}`, { 
    method: 'GET' 
  });
}

export async function createSoldItem(soldData: Omit<Sold, 'id'>): Promise<Sold> {
  return fetchApi<Sold>('/sold.php', {
    method: 'POST',
    body: JSON.stringify(soldData),
  });
}
