import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized - No token provided" });
  }

  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined in environment variables");
    return res.status(500).json({
      success: false,
      message: "Internal Server Error - Missing configuration"
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id; // ✅ Extract user ID
    next();
  } catch (err) {
    console.error("Error in verifyToken:", err);
    return res.status(401).json({
      success: false,
      message: "Unauthorized - Invalid or expired token"
    });
  }
};
