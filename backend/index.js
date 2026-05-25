import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import IssueRecord from "./models/IssueRecord.js";
import sendEmail from "./utils/sendEmail.js"; // ✅ ADD THIS
import cron from "node-cron";


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

cron.schedule("0 9 * * *", async () => {
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const startOfTomorrow = new Date(tomorrow.setHours(0, 0, 0, 0));
    const endOfTomorrow = new Date(tomorrow.setHours(23, 59, 59, 999));

    const records = await IssueRecord.find({
      status: "Issued",
      dueDate: {
        $gte: startOfTomorrow,
        $lte: endOfTomorrow,
      },
    }).populate("student", "name email").populate("book", "title");

    for (const record of records) {
      await sendEmail({
        to: record.student.email,
        subject: "Reminder: Book due tomorrow",
        text: `Hello ${record.student.name},\n\nYour borrowed book "${record.book.title}" is due tomorrow (${new Date(record.dueDate).toLocaleDateString()}).\nPlease return it on time to avoid fines.\n\nLibrary Management System`,
      });
    }

    if (records.length > 0) {
      console.log(`Sent ${records.length} due-date reminder emails.`);
    }
  } catch (error) {
    console.log("Due-date reminder error:", error.message);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});