import User from "../models/User.js";
import Post from "../models/Post.js";

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    const posts = await Post.find({ author: user._id })
      .populate("author", "fullName username profilePic")
      .sort({ createdAt: -1 });
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
    const userId = req.user._id;
    await Post.deleteMany({ author: userId });
    await User.updateMany({ followers: userId }, { $pull: { followers: userId } });
    await User.updateMany({ following: userId }, { $pull: { following: userId } });
    await User.findByIdAndDelete(userId);

    res.cookie("jwt", "", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 0,
    });
    res.status(200).json({ message: "Account deleted" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleFollow = async (req, res) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    const targetUser = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);
    if (!targetUser) return res.status(404).json({ message: "User not found" });

    const targetIdStr = targetUser._id.toString();
    const currentIdStr = currentUser._id.toString();

    const isFollowing = currentUser.following.some((id) => id.toString() === targetIdStr);
    if (isFollowing) {
      currentUser.following = currentUser.following.filter((id) => id.toString() !== targetIdStr);
      targetUser.followers = targetUser.followers.filter((id) => id.toString() !== currentIdStr);
    } else {
      currentUser.following.push(targetUser._id);
      targetUser.followers.push(currentUser._id);
    }
    await currentUser.save();
    await targetUser.save();
    res.status(200).json({
      following: currentUser.following,
      targetFollowers: targetUser.followers,
      isFollowing: !isFollowing,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};