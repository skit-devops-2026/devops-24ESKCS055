import mongoose from "mongoose";

/**
 * Mongoose schema representing a curated debate topic.
 * Status tracks whether a topic is currently active or archived in history.
 */
const debateSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    category: { type: String, required: true, default: "Society & Culture", trim: true },
    status: { type: String, enum: ["current", "archived"], default: "current" },
    postedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Debate", debateSchema);
