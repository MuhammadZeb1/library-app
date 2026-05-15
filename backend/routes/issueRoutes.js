import express from "express";

import {
  issueBook,
  returnBook,
  getAllIssueRecords,
  getMyIssueRecords,
} from "../controllers/issueController.js";

import {
  protect,
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

/*
====================================
ADMIN ROUTES
====================================
*/

// Get ALL issue records (admin only)
router.get(
  "/all",
  protect,
  getAllIssueRecords
);

export default router;