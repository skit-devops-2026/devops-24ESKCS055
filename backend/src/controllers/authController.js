import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

/**
 * Signs a standard JWT with a 7-day expiration.
 *
 * @param {object} payload - Identity claims for the token.
 * @returns {string} Signed JWT string.
 */
const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "sayso_jwt_secret_dev", { expiresIn: "7d" });

/**
 * Handles user registration with uniqueness validation and password hashing.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const signup = async (req, res) => {
  try {
    const { fullName, username, email, password } = req.body;
    if (!fullName || !username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const cleanFullName = fullName.trim();
    const cleanUsername = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername === "admin") {
      return res.status(400).json({ message: "Username 'admin' is reserved. Please choose another." });
    }

    if (cleanUsername.length < 3) {
      return res.status(400).json({ message: "Username must be at least 3 characters" });
    }

    if (!password) {
      return res.status(400).json({ message: "Password is required" });
    }

    const existingUser = await User.findOne({
      $or: [{ username: cleanUsername }, { email: cleanEmail }],
    });

    if (existingUser) {
      if (existingUser.username === cleanUsername) {
        return res.status(400).json({ message: "This username is already taken. Please choose another." });
      }
      return res.status(400).json({ message: "This email address is already registered." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      fullName: cleanFullName,
      username: cleanUsername,
      email: cleanEmail,
      password: hashedPassword,
      role: "user",
    });

    const token = signToken({ id: user._id, username: user.username, role: "user" });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: "user",
        bio: user.bio || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during registration" });
  }
};

/**
 * Authenticates credentials against predefined administrator configuration or user database.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const cleanInput = username.trim().toLowerCase();
    const adminUser = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
    const adminPass = process.env.ADMIN_PASSWORD || "admin@123";

    // Handle administrative credentials
    if (cleanInput === adminUser && password === adminPass) {
      const token = signToken({ id: "admin", username: "admin", role: "admin" });
      res.cookie("jwt", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        token,
        user: {
          _id: "admin",
          id: "admin",
          fullName: "Platform Administrator",
          username: "admin",
          email: "admin@sayso.org",
          role: "admin",
          bio: "Editorial curator and platform administrator.",
        },
      });
    }

    // Handle standard user accounts
    const user = await User.findOne({
      $or: [{ username: cleanInput }, { email: cleanInput }],
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Username or password is incorrect" });
    }

    const token = signToken({ id: user._id, username: user.username, role: user.role });

    res.cookie("jwt", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      token,
      user: {
        _id: user._id,
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        role: user.role,
        bio: user.bio || "",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error during authentication" });
  }
};

/**
 * Returns current authenticated session identity.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const checkAuth = async (req, res) => {
  try {
    if (req.user.id === "admin") {
      return res.json({
        _id: "admin",
        id: "admin",
        fullName: "Platform Administrator",
        username: "admin",
        email: "admin@sayso.org",
        role: "admin",
        bio: "Editorial curator and platform administrator.",
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      _id: user._id,
      id: user._id,
      fullName: user.fullName,
      username: user.username,
      email: user.email,
      role: user.role,
      bio: user.bio || "",
    });
  } catch {
    res.status(500).json({ message: "Server error checking session" });
  }
};

/**
 * Clears authentication token cookie.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export const logout = (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
  });
  res.json({ message: "Logged out successfully" });
};