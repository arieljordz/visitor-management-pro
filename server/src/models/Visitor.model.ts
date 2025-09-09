// models/Visitor.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { IVisitor } from "../types/visitor.types";

// Extend IVisitor with Mongoose `Document`
export interface IVisitorDocument extends Omit<IVisitor, "id" | "hostId">, Document {
  hostId: mongoose.Types.ObjectId; // actual DB reference
}

const visitorSchema = new Schema<IVisitorDocument>(
  {
    firstname: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    middlename: {
      type: String,
      trim: true,
      maxlength: [50, "Middle name cannot exceed 50 characters"],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    fullname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
    company: {
      type: String,
      trim: true,
    },
    hostId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host is required"],
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

// Pre-save hook to auto-generate fullname
visitorSchema.pre<IVisitorDocument>("save", function (next) {
  const middleInitial = this.middlename
    ? `${this.middlename.charAt(0).toUpperCase()}.`
    : "";

  this.fullname = [this.firstname, middleInitial, this.lastname]
    .filter(Boolean)
    .join(" ");

  next();
});

// Indexes
visitorSchema.index({ email: 1 });
visitorSchema.index({ createdAt: -1 });

export default mongoose.model<IVisitorDocument>("Visitor", visitorSchema);
