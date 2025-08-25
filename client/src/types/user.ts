export type UserRole = "admin" | "staff" | "user";

export interface User {
  _id: string;
  name: string;
  email: string;
  picture?: string;
  isVerified: boolean;
  role: UserRole;
  token?: string;
}
