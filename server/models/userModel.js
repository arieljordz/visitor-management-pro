import mongoose from "mongoose";

const userModelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    picture: { type: String },
    password: { type: String },
    isVerified: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const userModel = mongoose.model("userModel", userModelSchema);
export default userModel;
