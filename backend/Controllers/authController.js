import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper to generate JWT
const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

/**
 * @desc    Register user (NO Token returned)
 * @route   POST /api/auth/register
 */
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user - Password hashing happens in the User Model middleware
    const user = await User.create({ name, email, password, role });

    if (user) {
      res.status(201).json({
        message: "User registered successfully. Please login to continue.",
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Login user (Token generated and sent)
 * @route   POST /api/auth/login
 */
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    // Check password using bcrypt
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id) // Token sent ONLY here
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};