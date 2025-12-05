import jwt from "jsonwebtoken";


const getSecret = () => {
  if (!process.env.JWT_SECRET) {
    console.warn("JWT_SECRET not set in environment variables.");
    return "default_secret";
  }
  return process.env.JWT_SECRET;
}

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, getSecret());
    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Unauthorized" });
  }
};

/**
 * Allows routes to work for both authenticated and unauthenticated users
 * Sets req.user.id if valid token exists, otherwise null
 * Used for routes that show different content based on auth status (e.g., event lists)
 */
export const optionalAuth = (req, res, next) => {
  req.user = { id: null }
  const token = req.cookies.token;
  if (!token) {
    console.error("No token found");
    return next();
  }
  try {
    const decoded = jwt.verify(token, getSecret());
    req.user.id = decoded.id;
  } catch (err) {
    console.error(err);
  }
  next();
};
