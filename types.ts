
export interface User {
  id: string;
  name: string;
  password?: string;
  email: string;
  admin: boolean;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  id_genre: string;
  description: string;
  cover: string;
  price: number;
  status: boolean;
}

export interface Sold {
  id: string;
  id_users: string;
  id_books: string;
  date: string;
}

export type Genre = {
  id: string;
  name: string;
  number: number;
  icon: string;
}
