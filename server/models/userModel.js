import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userSchema);
export default userModel;
