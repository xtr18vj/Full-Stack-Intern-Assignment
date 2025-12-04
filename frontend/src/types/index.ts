export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'ADMIN';
  createdAt?: string;
}

export interface Author {
  id: number;
  name: string;
  bio?: string;
  createdAt?: string;
  updatedAt?: string;
  books?: Book[];
  _count?: { books: number };
}

export interface Book {
  id: number;
  title: string;
  isbn: string;
  description?: string;
  publishedAt?: string;
  quantity: number;
  available: number;
  authorId: number;
  author?: Author;
  createdAt?: string;
  updatedAt?: string;
  _count?: { borrows: number };
}

export interface Borrow {
  id: number;
  userId: number;
  bookId: number;
  borrowedAt: string;
  dueAt: string;
  returnedAt?: string;
  user?: User;
  book?: Book;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
