import bcrypt from "bcryptjs";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";

export const signup = async (req, res) => {
  const { fullName, username, email, password } = req.body;
  try {
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({
      email: { $regex: new RegExp(`^${cleanEmail}$`, "i") },
    });
    if (existingEmail) {
      return res.status(400).json({
        message: `Email "${cleanEmail}" is already registered. Please log in or use a different email.`,
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({
      username: { $regex: new RegExp(`^${cleanUsername}$`, "i") },
    });
    if (existingUsername) {
      return res.status(400).json({
        message: `Username "@${cleanUsername}" is already taken. Please choose another username.`,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName: cleanFullName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
    });
    await newUser.save();

    generateToken(newUser._id, res);

    res.status(201).json({
      _id: newUser._id,
      fullName: newUser.fullName,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
    });
  } catch (error) {
    console.log("Error in signup controller", error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0] || "Username or email";
      return res.status(400).json({ message: `${duplicateField} is already in use. Please choose another.` });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanInput = username.trim().toLowerCase();

    const user = await User.findOne({
      $or: [
        { username: cleanInput },
        { email: cleanInput },
        { username: username.trim() },
        { email: username.trim() },
      ],
    });
    if (!user) return res.status(400).json({ message: "Invalid username/email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid username/email or password" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  res.status(200).json({ message: "Logged out successfully" });
};

export const checkAuth = (req, res) => {
  res.status(200).json(req.user);
};