import jwt from 'jsonwebtoken';

/**
 * Generate an access token
 * @param {string} userId
 * @returns {string} JWT token
 */
/**
 * Utility: Generate Access Token (short-lived, ~15m)
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: "15m",
  });
};

/**
 * Generate a refresh token
 * @param {string} userId
 * @returns {string} JWT token
 */
/**
 * Utility: Generate Refresh Token (long-lived, ~7d)
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

export { generateAccessToken, generateRefreshToken };
