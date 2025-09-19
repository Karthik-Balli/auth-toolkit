import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { generateAccessToken, generateRefreshToken } from '../utils/generateToken.js';
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Creating a generateToken function to create JWT tokens
const generateToken = (userId) => {
    return jwt.sign({ id: userId}, process.env.JWT_SECRET, {
        expiresIn: '15m',
    });
}

// @desc   Register new user
// @route  POST /api/auth/register
// @access Public
export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if(!name || !email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const userExists = await User.findOne({ email });
        if(userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            provider: 'local',
        });

        const accessToken = generateToken(user._id);

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

// @ desc    Login User
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        if(!email || !password) {
            return res.status(400).json({ message: 'Please fill in all fields' });
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateToken(user._id, 'access');
        const refreshToken = generateToken(user._id, 'refresh');

        res.status(200).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' });
    }
}

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
        password: null, // skip password
      });
      await user.save();
    }

    // issue your JWT here
    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
      },
    });
  } catch (err) {
    console.error("Google login error:", err);
    res.status(500).json({ error: "Google login failed" });
  }
};


// @desc   Logout user (handled on frontend)
// @route  POST /api/auth/logout
// @access Public
export const logoutUser = (req, res) => {
  // Optionally blacklist token in future if needed
  res.status(200).json({ message: 'User logged out successfully' });
};

// @desc Get Current User
// @route GET /api/auth/current
// @access Private
export const getCurrentUser = async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Not authorized, user not found in request' });
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

