import express from "express";

import {
  issueBook,
  returnBook,
  getAllIssueRecords,
  getMyIssueRecords,
  payFine,
  deleteIssue,
} from "../controllers/issueController.js";

import {
  protect,
  adminOnly,
} from "../middleware/authMiddleware.js";

const router = express.Router();

/*
====================================
STUDENT ROUTES
====================================
*/

// Issue a book (student)
router.post("/", protect, issueBook);

// Get logged-in student's records
router.get(
  "/my-records",
  protect,
  getMyIssueRecords
);

// Return book
router.put("/:id/return", protect, returnBook);

// Admin can mark a fine as paid
router.put("/:id/pay-fine", protect, adminOnly, payFine);

// Admin can delete an issue record
router.delete("/:id", protect, adminOnly, deleteIssue);

/*
====================================
ADMIN ROUTES
====================================
*/

// Get ALL issue records (admin only)
router.get(
  "/all",
  protect,
  adminOnly,
  getAllIssueRecords
);

export default router;