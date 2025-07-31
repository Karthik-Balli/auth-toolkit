import jwt from 'jsonwebtoken';

/**
 * Generate an access token
 * @param {string} userId
 * @returns {string} JWT token
 */
const generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
};

/**
 * Generate a refresh token
 * @param {string} userId
 * @returns {string} JWT token
 */
const generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
};

export { generateAccessToken, generateRefreshToken };
