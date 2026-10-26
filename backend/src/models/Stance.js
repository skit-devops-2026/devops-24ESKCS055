import mongoose from "mongoose";

/**
 * Mongoose schema storing an immutable user stance on a debate.
 * Enforces single-vote invariant per debate via unique compound index.
 */
const stanceSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    debate: { type: mongoose.Schema.Types.ObjectId, ref: "Debate", required: true },
    stance: { type: String, enum: ["for", "against", "neutral"], required: true },
  },
  { timestamps: true }
);

stanceSchema.index({ user: 1, debate: 1 }, { unique: true });

export default mongoose.model("Stance", stanceSchema);
