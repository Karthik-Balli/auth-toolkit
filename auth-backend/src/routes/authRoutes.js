import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser, googleLogin } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

// Google OAuth (SPA token verification)
router.post("/google", googleLogin);

// Private routes
router.get('/me', protect, getCurrentUser);

export default router;