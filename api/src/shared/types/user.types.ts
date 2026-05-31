export type UserRole = 'admin' | 'user';

export default interface User {
  id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  username?: string;
  password?: string;
  refresh_token?: string;
  is_verified?: boolean;
  role?: UserRole;
}
