import jwt from "jsonwebtoken";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token", success: false });
    }

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.id = decoded.userId; // ✅ now you can use req.id in controllers

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ message: "Not authorized, invalid token", success: false });
  }
};
