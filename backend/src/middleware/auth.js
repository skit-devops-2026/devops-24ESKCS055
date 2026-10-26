import jwt from "jsonwebtoken";

/**
 * Validates JWT token from Authorization header or cookie.
 * Attaches decoded identity claims { id, _id, role, username } to express request.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.jwt;

  if (!token) {
    return res.status(401).json({ message: "Not authorized - No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "sayso_jwt_secret_dev");
    const resolvedId = decoded.id || decoded._id || decoded.userId;
    req.user = {
      ...decoded,
      id: resolvedId,
      _id: resolvedId,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session token" });
  }
};

/**
 * Restricts access to administrator roles.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

/**
 * Restricts access to regular user roles.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export const userOnly = (req, res, next) => {
  if (req.user?.role !== "user") {
    return res.status(403).json({ message: "Only users can perform this action" });
  }
  next();
};
