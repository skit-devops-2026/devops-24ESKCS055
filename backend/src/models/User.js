import mongoose from "mongoose";

/**
 * Mongoose schema representing an application user or administrator.
 * Distinguishes administrative privileges and stores civic profile metadata.
 */
const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true, lowercase: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    bio: { type: String, default: "" },
    profilePic: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);