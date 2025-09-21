import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import {
  generateAccessToken,
  generateRefreshToken,
} from '../utils/generateToken.js';
import { OAuth2Client } from 'google-auth-library';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// HELPER FUNCTION: Set HTTPOnly refresh token cookie
const setRefreshTokenCookie = (res, refreshToken) => {
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

// HELPER FUNCTION: Clear refresh token cookie
const clearRefreshTokenCookie = (res) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    path: '/',
  });
};

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      provider: 'local',
    });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route POST /api/auth/login
 * @desc Authenticate user & set refresh token cookie
 */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Please fill in all fields' });
    }

    // 2. Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // 2.1Check if user has password (for Google OAuth users)
    if (!user.password) {
      return res.status(400).json({ message: 'Please login with Google' });
    }

    // 3. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid credentials' });

    // 4. Generate tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // 5. Set HTTPOnly refresh token cookie
    setRefreshTokenCookie(res, refreshToken);

    // 6. Send response with access token
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc Google OAuth (SPA flow)
// @route POST /api/auth/google
// @access Public
export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = new User({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub, // unique Google user id
        picture: payload.picture,
        password: null, // No password for Google users
        provider: 'google',
      });
      await user.save({ validateBeforeSave: false });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    setRefreshTokenCookie(res, refreshToken);

    res.json({
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error('Google login error:', err);
    res.status(500).json({ error: 'Google login failed' });
  }
};

/**
 * @route POST /api/auth/logout
 * @desc Clear refresh token cookie
 */
export const logoutUser = (req, res) => {
  clearRefreshTokenCookie(res);
  res.status(200).json({ message: 'Logged out successfully' });
};

// @desc Get Current User
// @route GET /api/auth/current
// @access Private
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.user || !req.user.id) {
      return res
        .status(401)
        .json({ message: 'Not authorized, user not found in request' });
    }

    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user); // Return full user object from DB (without password)
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @route POST /api/auth/refresh
 * @desc Issue new access token if refresh token valid
 */
export const refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    // 1. Check if token exists
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    // 2. Verify refresh token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // 3. Find user (🔧 FIXED: Properly await the database call)
    const user = await User.findById(decoded.id);
    if (!user) {
      clearRefreshTokenCookie(res);
      return res.status(404).json({ message: 'User not found' });
    }

    // 4. Generate new access token
    const accessToken = generateAccessToken(user._id);

    return res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      test: 'Refresh success',
      accessToken,
    });
  } catch (err) {
    console.error('Refresh Error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
