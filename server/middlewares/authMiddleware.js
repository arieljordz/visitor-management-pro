import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies?.token; // or whatever you named your cookie

    const cookies = req.cookies;
    // console.log("req:", req);
    // console.log("cookies:", cookies);
    // console.log("token:", token);
    if (!token) {
      return res.status(401).json({ message: "No token, unauthorized" });
    }

    // console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // use your actual secret
    // console.log("decoded:", decoded);
    const user = await userModel.findById(decoded.userId).select("-password");
    // console.log("user:", user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user; // ✅ attach to request
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};
