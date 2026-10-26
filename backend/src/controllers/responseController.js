import Stance from "../models/Stance.js";
import Response from "../models/Response.js";
import Debate from "../models/Debate.js";

/**
 * Retrieves the authenticated user's locked stance on a specific debate topic.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getUserStance = async (req, res) => {
  try {
    const { debateId } = req.params;
    const userId = req.user.id;

    const record = await Stance.findOne({ debate: debateId, user: userId }).lean();
    res.json({ stance: record?.stance || null });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user stance" });
  }
};

/**
 * Permanently locks a user's stance on a debate topic.
 * Idempotent: Subsequent calls preserve the initially chosen stance.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const recordStance = async (req, res) => {
  try {
    const { debateId } = req.params;
    const { stance } = req.body;
    const userId = req.user.id;

    if (!["for", "against", "neutral"].includes(stance)) {
      return res.status(400).json({ message: "Invalid stance selection" });
    }

    const existing = await Stance.findOne({ debate: debateId, user: userId });
    if (existing) {
      return res.json({ stance: existing.stance });
    }

    const created = await Stance.create({
      debate: debateId,
      user: userId,
      stance,
    });

    res.status(201).json({ stance: created.stance });
  } catch (error) {
    res.status(500).json({ message: "Failed to record stance" });
  }
};

/**
 * Posts or updates a user's commentary response on a debate topic.
 * Enforces maximum text limit of 1000 characters and binds to user's locked stance.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const postResponse = async (req, res) => {
  try {
    const { debateId } = req.params;
    const { text, stance: providedStance } = req.body;
    const userId = req.user.id;
    const username = req.user.username || "anonymous";

    const cleanText = text?.trim();
    if (!cleanText) {
      return res.status(400).json({ message: "Response text cannot be empty" });
    }
    if (cleanText.length > 1000) {
      return res.status(400).json({ message: "Response exceeds maximum length of 1000 characters" });
    }

    const debate = await Debate.findById(debateId);
    if (!debate) {
      return res.status(404).json({ message: "Debate topic not found" });
    }

    // Resolve or establish locked stance
    let userStanceRecord = await Stance.findOne({ debate: debateId, user: userId });
    if (!userStanceRecord && providedStance) {
      userStanceRecord = await Stance.create({
        debate: debateId,
        user: userId,
        stance: providedStance,
      });
    }

    if (!userStanceRecord) {
      return res.status(400).json({ message: "You must choose a stance before posting a response" });
    }

    // Check for existing response to update
    let response = await Response.findOne({ debate: debateId, user: userId });
    if (response) {
      response.text = cleanText;
      await response.save();
    } else {
      response = await Response.create({
        debate: debateId,
        user: userId,
        username,
        stance: userStanceRecord.stance,
        text: cleanText,
      });
    }

    const key = response._id.toString();
    res.status(200).json({
      id: key,
      _id: key,
      debateId: debateId.toString(),
      userId: userId.toString(),
      username: response.username,
      stance: response.stance,
      text: response.text,
      createdAt: response.createdAt,
      updatedAt: response.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to submit response" });
  }
};
