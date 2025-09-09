// models/Appointment.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { IAppointment } from "../types/appointment.types";

export interface IAppointmentDocument extends Omit<IAppointment, "id" | "visitorId" | "hostId">, Document {
  visitorId: mongoose.Types.ObjectId;
  hostId: mongoose.Types.ObjectId;
}

const appointmentSchema = new Schema<IAppointmentDocument>(
  {
    visitorId: {
      type: Schema.Types.ObjectId,
      ref: "Visitor",
      required: [true, "Visitor is required"],
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
    },
    purpose: {
      type: String,
      required: [true, "Purpose is required"],
      trim: true,
      maxlength: [200, "Purpose cannot exceed 200 characters"],
    },
    visitDate: {
      type: Date,
      required: [true, "Visit date is required"],
    },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret: any) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes
appointmentSchema.index({ visitorId: 1, visitDate: -1 });
appointmentSchema.index({ status: 1 });

export default mongoose.model<IAppointmentDocument>("Appointment", appointmentSchema);
