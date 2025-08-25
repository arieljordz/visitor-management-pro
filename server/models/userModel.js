import mongoose from "mongoose";

const userModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: true },
     role: { type: String, enum: ["admin", "staff", "user"], default: "user" },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userModelSchema);
export default userModel;
