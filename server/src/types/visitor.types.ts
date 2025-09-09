//types/visitor.types.ts
import { Types } from "mongoose";
import { IUser } from "./user.types";

// Pure domain type (DTO-safe, no Mongoose `Document`)
export interface IVisitor {
  id: string;
  firstname: string;
  middlename?: string;
  lastname: string;
  fullname?: string;
  email: string;
  phone: string;
  address: string;
  company?: string;
  hostId: string | IUser; // can be ObjectId string or populated IUser
  createdAt: Date;
  updatedAt: Date;
}
