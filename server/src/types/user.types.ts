//types/user.types.ts
export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "user" | "admin";
  isEmailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
