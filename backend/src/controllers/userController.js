import User from "../models/User.js";
import Response from "../models/Response.js";
import Stance from "../models/Stance.js";

/**
 * Retrieves public profile information and user debate activity.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").lean();
    if (!user) return res.status(404).json({ message: "User not found" });

    const userResponses = await Response.find({ user: user._id })
      .populate("debate", "title category status")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
        createdAt: user.createdAt,
      },
      responses: userResponses,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve user profile" });
  }
};

/**
 * Updates editable account profile fields (fullName, email, bio).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const updateProfile = async (req, res) => {
  try {
    const { fullName, email, bio } = req.body;
    const cleanName = fullName?.trim();
    const cleanEmail = email?.trim().toLowerCase();

    if (!cleanName) {
      return res.status(400).json({ message: "Full name cannot be empty" });
    }
    if (!cleanEmail) {
      return res.status(400).json({ message: "Email cannot be empty" });
    }

    if (req.user.id === "admin") {
      return res.json({
        _id: "admin",
        id: "admin",
        fullName: cleanName,
        username: "admin",
        email: cleanEmail,
        role: "admin",
        bio: bio?.trim() || "Editorial curator and platform administrator.",
      });
    }

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      {
        fullName: cleanName,
        email: cleanEmail,
        ...(bio !== undefined && { bio: bio.trim() }),
      },
      { new: true }
    ).select("-password");

    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: updated._id,
      id: updated._id,
      fullName: updated.fullName,
      username: updated.username,
      email: updated.email,
      role: updated.role,
      bio: updated.bio || "",
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to update profile" });
  }
};

/**
 * Permanently removes user account and cascades deletion to associated stances and responses.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    if (userId === "admin") {
      return res.status(400).json({ message: "Administrator account cannot be deleted" });
    }

    await Promise.all([
      Response.deleteMany({ user: userId }),
      Stance.deleteMany({ user: userId }),
      User.findByIdAndDelete(userId),
    ]);

    res.cookie("jwt", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });

    res.json({ message: "Account and associated activity successfully deleted" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete account" });
  }
};