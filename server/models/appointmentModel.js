import mongoose from "mongoose";

const appointmentModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    company: { type: String },
    hostName: { type: String, required: true },
    purpose: { type: String, required: true },
    visitDate: { type: Date, required: true },
    appointmentDate: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const appointmentModel = mongoose.model(
  "appointmentModel",
  appointmentModelSchema
);
export default appointmentModel;
