import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const protect = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id };

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const optionalAuth = (req, res, next) => {
  req.user = { id: null }
  const token = req.cookies.token;
  if (!token) {
    console.error("No token found");
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user.id = decoded.id;
  } catch (err) {
    console.error(err);
  }
  next();
};
