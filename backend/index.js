import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";

import sendEmail from "./utils/sendEmail.js"; // ✅ ADD THIS


console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/*
========================================
TEST EMAIL ROUTE
========================================
*/

app.post("/api/test-email", async (req, res) => {
  try {
    console.log("khan")
    await sendEmail({
      to: req.body.email,
      subject: "Test Email",
      text: "Email working 🚀",
    });
    console.log("skjf")

    res.json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/*
========================================
ROUTES
========================================
*/

app.use("/api/auth", authRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/issues", issueRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});