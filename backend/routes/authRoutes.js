import express from 'express';
import { register, login } from '../controllers/authController.js';
// import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user (Student or Admin)
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user profile (Example of a protected route)
 * @access  Private
 */
// router.get('/me', protect, (req, res) => {
//   res.status(200).json(req.user);
// });

export default router;