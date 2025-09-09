//types/appointment.types.ts
import { IUser } from "./user.types";
import { IVisitor } from "./visitor.types";

export interface IAppointment {
  id: string;
  visitorId: string | IVisitor; // ObjectId or populated visitor
  hostId: string | IUser;       // ObjectId or populated host
  purpose: string;
  visitDate: Date;
  status: "pending" | "approved" | "declined";
  createdAt: Date;
  updatedAt: Date;
}
