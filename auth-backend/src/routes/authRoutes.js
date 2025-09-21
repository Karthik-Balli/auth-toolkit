import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  googleLogin,
  refreshToken,
} from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Google OAuth (SPA token verification)
router.post('/google', googleLogin);
// Refresh token route
router.post('/refresh', refreshToken);

// Private routes
router.get('/me', protect, getCurrentUser);

export default router;