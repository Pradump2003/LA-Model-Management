// middleware/authMiddleware.js

/**
 * Simple API Key Protection
 * Requires header: x-api-key: your_secret_key
 */
exports.protect = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  const validApiKey = process.env.API_SECRET_KEY;

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Access denied. No API key provided.",
      hint: "Add header: x-api-key: your_secret_key",
    });
  }

  if (apiKey !== validApiKey) {
    return res.status(403).json({
      success: false,
      message: "Access denied. Invalid API key.",
    });
  }

  // API key is valid, proceed
  next();
};
