import mongoose from "mongoose";

/**
 * Mongoose schema representing a user's commentary / opinion on a debate.
 * Bound to the user's locked stance with a strict 1000 character ceiling.
 */
const responseSchema = new mongoose.Schema(
  {
    debate: { type: mongoose.Schema.Types.ObjectId, ref: "Debate", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: { type: String, required: true },
    stance: { type: String, enum: ["for", "against", "neutral"], required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

export default mongoose.model("Response", responseSchema);
