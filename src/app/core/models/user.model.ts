// User roles
export type UserRole = 'user' | 'admin';

// User model
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt?: string;
}

// Session stored in localStorage (no password)
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
