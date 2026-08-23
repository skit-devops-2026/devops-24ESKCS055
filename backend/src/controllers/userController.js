import User from "../models/User.js";
import Post from "../models/Post.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id }).sort({ createdAt: -1 });
    res.status(200).json({ user, posts });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { fullName, bio, profilePic } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { fullName, bio, profilePic },
      { new: true }
    ).select("-password");
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const isFollowing = currentUser.following.includes(targetUser._id);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id) => id.toString() !== targetUser._id.toString());
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentUser._id.toString());
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }
    await currentUser.save();
    await targetUser.save();
    res.status(200).json({ following: currentUser.following });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};