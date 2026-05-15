import express from "express";
import {
  getBooks,
  addBook,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js"; // Import Multer

const router = express.Router();

// Public routes
router.get("/", getBooks);
router.get("/:id", protect, getBookById);

// Protected routes (accepting image uploads)
router.post("/", protect, upload.single('image'), addBook); // Added Multer
router.put("/:id", protect, upload.single('image'), updateBook); // Added Multer
router.delete("/:id", protect, deleteBook);

export default router;