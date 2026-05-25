import IssueRecord from "../models/IssueRecord.js";
import Book from "../models/Book.js";
import sendEmail from "../utils/sendEmail.js";

const FINE_RATE = 10;

const calculateFine = (dueDate, compareDate = new Date()) => {
  const delay = (new Date(compareDate) - new Date(dueDate)) / (1000 * 60 * 60 * 24);
  const overdueDays = Math.ceil(delay);
  return overdueDays > 0 ? overdueDays * FINE_RATE : 0;
};

const sendIssueConfirmationEmail = async (student, bookTitle, dueDate) => {
  await sendEmail({
    to: student.email,
    subject: "Book Issued Successfully",
    text: `Hello ${student.name},

Your book "${bookTitle}" has been issued successfully.
Due Date: ${new Date(dueDate).toLocaleDateString()}.

Please return the book on time to avoid any fines.

Library Management System`,
  });
};

const sendReturnEmail = async (student, bookTitle, fineAmount) => {
  const text = fineAmount > 0
    ? `Hello ${student.name},

You have returned the book "${bookTitle}".
Your overdue fine is Rs.${fineAmount}.
Please contact the admin to settle the payment.

Library Management System`
    : `Hello ${student.name},

Thank you for returning the book "${bookTitle}" on time.
No fine is due.

Library Management System`;

  await sendEmail({
    to: student.email,
    subject: "Book Return Confirmation",
    text,
  });
};

export const issueBook = async (req, res) => {
  try {
    const studentId = req.user._id;
    const { bookId, dueDate } = req.body;

    const book = await Book.findById(bookId);

    if (!book || book.available < 1) {
      return res.status(400).json({ message: "Book not available" });
    }

    const alreadyIssued = await IssueRecord.findOne({
      student: studentId,
      book: bookId,
      status: "Issued",
    });

    if (alreadyIssued) {
      return res.status(400).json({ message: "You already have this book issued" });
    }

    const issue = await IssueRecord.create({
      student: studentId,
      book: bookId,
      dueDate,
    });

    book.available -= 1;
    await book.save();

    await sendIssueConfirmationEmail(req.user, book.title, dueDate);

    res.status(201).json(issue);
  } catch (error) {
    console.log("ISSUE ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const returnBook = async (req, res) => {
  try {
    const issue = await IssueRecord.findById(req.params.id)
      .populate("student", "name email")
      .populate("book", "title");

    if (!issue || issue.status === "Returned") {
      return res.status(400).json({ message: "Invalid record or already returned" });
    }

    issue.returnDate = new Date();
    issue.status = "Returned";
    issue.fine = calculateFine(issue.dueDate, issue.returnDate);
    issue.finePaid = issue.fine === 0;
    issue.paidAmount = 0;
    issue.paidAt = issue.fine === 0 ? new Date() : undefined;

    await issue.save();

    const book = await Book.findById(issue.book._id);
    if (book) {
      book.available += 1;
      await book.save();
    }

    await sendReturnEmail(issue.student, issue.book.title, issue.fine);

    res.json(issue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const payFine = async (req, res) => {
  try {
    const issue = await IssueRecord.findById(req.params.id)
      .populate("student", "name email")
      .populate("book", "title");

    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.fine <= 0 || issue.finePaid) {
      return res.status(400).json({ message: "No pending fine found for this record" });
    }

    issue.finePaid = true;
    issue.paidAmount = issue.fine;
    issue.paidAt = new Date();

    await issue.save();

    await sendEmail({
      to: issue.student.email,
      subject: "Fine Payment Recorded",
      text: `Hello ${issue.student.name},

Your fine payment for "${issue.book.title}" has been recorded.
Paid Amount: Rs.${issue.paidAmount}.

Thank you.

Library Management System`,
    });

    res.json(issue);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await IssueRecord.findById(req.params.id).populate("book", "_id title");

    if (!issue) {
      return res.status(404).json({ message: "Issue record not found" });
    }

    if (issue.status === "Issued" && issue.book) {
      const book = await Book.findById(issue.book._id);
      if (book) {
        book.available += 1;
        await book.save();
      }
    }

    await issue.deleteOne();

    res.json({ id: req.params.id, message: "Issue record deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const getAllIssueRecords = async (req, res) => {
  try {
    const records = await IssueRecord.find({})
      .populate("student", "name email")
      .populate("book", "title author category image")
      .sort({ createdAt: -1 });

    const updatedRecords = records.map((record) => {
      if (record.status === "Returned" || record.finePaid) {
        return record;
      }

      const liveFine = calculateFine(record.dueDate);
      return {
        ...record.toObject(),
        fine: liveFine,
      };
    });

    res.json(updatedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyIssueRecords = async (req, res) => {
  try {
    const records = await IssueRecord.find({ student: req.user._id })
      .populate("book", "title author category image")
      .sort({ createdAt: -1 });

    const updatedRecords = records.map((record) => {
      if (record.status === "Returned" || record.finePaid) {
        return record;
      }

      const liveFine = calculateFine(record.dueDate);
      return {
        ...record.toObject(),
        fine: liveFine,
      };
    });

    res.json(updatedRecords);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
