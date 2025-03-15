const jwt = require("jsonwebtoken");

const generateTokenAndSetCookie = (res, userId) => {
  if (!userId) {
    throw new Error("User ID is required to generate a token.");
  }

  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables.");
  }

  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side access (XSS protection)
    secure: process.env.NODE_ENV === "production", // Only send over HTTPS in production
    sameSite: "strict", // Prevents CSRF attacks
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
  });

  return token;
};

module.exports = { generateTokenAndSetCookie }; // ✅ Fixed Export
