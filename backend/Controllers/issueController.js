import IssueRecord from "../models/IssueRecord.js";
import Book from "../models/Book.js";
import nodemailer from "nodemailer";

/*
========================================
EMAIL TRANSPORTER
========================================
*/

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/*
========================================
SEND EMAIL FUNCTION
========================================
*/

const sendEmail = async ({
  to,
  subject,
  text,
}) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  });
};

/*
========================================
ISSUE BOOK
POST /api/issues
========================================
*/

export const issueBook = async (req, res) => {
  try {
    const studentId = req.user._id;

    const {
      bookId,
      dueDate,
    } = req.body;

    const book = await Book.findById(
      bookId
    );

    if (
      !book ||
      book.available < 1
    ) {
      return res.status(400).json({
        message:
          "Book not available",
      });
    }

    const alreadyIssued =
      await IssueRecord.findOne({
        student: studentId,
        book: bookId,
        status: "Issued",
      });

    if (alreadyIssued) {
      return res.status(400).json({
        message:
          "Already borrowed",
      });
    }

    const issue =
      await IssueRecord.create({
        student: studentId,
        book: bookId,
        dueDate,
      });

    // decrease stock
    book.available -= 1;

    await book.save();

    res.status(201).json(issue);

  } catch (error) {
    console.log(
      "ISSUE ERROR:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
RETURN BOOK
PUT /api/issues/:id/return
========================================
*/

export const returnBook = async (
  req,
  res
) => {
  try {

    const issue =
      await IssueRecord.findById(
        req.params.id
      )
        .populate(
          "student",
          "name email"
        )
        .populate(
          "book",
          "title"
        );

    if (
      !issue ||
      issue.status ===
        "Returned"
    ) {
      return res.status(400).json({
        message:
          "Invalid record or already returned",
      });
    }

    // return date
    issue.returnDate =
      new Date();

    issue.status = "Returned";

    /*
    ============================
    FINE LOGIC
    ============================
    */

    const delay =
      (new Date(
        issue.returnDate
      ) -
        new Date(
          issue.dueDate
        )) /
      (1000 *
        60 *
        60 *
        24);

    const lateDays =
      Math.ceil(delay);

    issue.fine =
      lateDays > 0
        ? lateDays * 10
        : 0;

    await issue.save();

    /*
    ============================
    INCREASE BOOK STOCK
    ============================
    */

    const book =
      await Book.findById(
        issue.book._id
      );

    if (book) {
      book.available += 1;

      await book.save();
    }

    /*
    ============================
    LATE RETURN EMAIL
    ============================
    */

    if (issue.fine > 0) {

      await sendEmail({
        to:
          issue.student.email,

        subject:
          "Library Fine Alert",

        text: `
Hello ${issue.student.name},

You returned the book "${issue.book.title}" late.

Late Fine: Rs.${issue.fine}

Please pay the fine.

Library Management System
        `,
      });

      console.log(
        "Fine email sent"
      );
    }

    res.json(issue);

  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

/*
========================================
ADMIN - GET ALL ISSUE RECORDS
GET /api/issues/all
========================================
*/

export const getAllIssueRecords =
  async (req, res) => {
    try {

      const records =
        await IssueRecord.find({})
          .populate(
            "student",
            "name email"
          )
          .populate(
            "book",
            "title author category image"
          )
          .sort({
            createdAt: -1,
          });

      /*
      ============================
      LIVE FINE CALCULATION
      ============================
      */

      const updatedRecords =
        records.map(
          (record) => {

            // returned books
            if (
              record.status ===
              "Returned"
            ) {
              return record;
            }

            const today =
              new Date();

            const delay =
              (today -
                new Date(
                  record.dueDate
                )) /
              (1000 *
                60 *
                60 *
                24);

            const lateDays =
              Math.ceil(delay);

            const liveFine =
              lateDays > 0
                ? lateDays * 10
                : 0;

            return {
              ...record.toObject(),

              fine: liveFine,
            };
          }
        );

      res.json(updatedRecords);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };

/*
========================================
STUDENT - GET MY ISSUE RECORDS
GET /api/issues/my-records
========================================
*/

export const getMyIssueRecords =
  async (req, res) => {
    try {

      const records =
        await IssueRecord.find({
          student:
            req.user._id,
        })
          .populate(
            "book",
            "title author category image"
          )
          .sort({
            createdAt: -1,
          });

      /*
      ============================
      LIVE FINE FOR STUDENT
      ============================
      */

      const updatedRecords =
        records.map(
          (record) => {

            if (
              record.status ===
              "Returned"
            ) {
              return record;
            }

            const today =
              new Date();

            const delay =
              (today -
                new Date(
                  record.dueDate
                )) /
              (1000 *
                60 *
                60 *
                24);

            const lateDays =
              Math.ceil(delay);

            const liveFine =
              lateDays > 0
                ? lateDays * 10
                : 0;

            return {
              ...record.toObject(),

              fine: liveFine,
            };
          }
        );

      /*
      ============================
      EMAIL REMINDER
      BEFORE DUE DATE
      ============================
      */

      for (const issue of records) {

        if (
          issue.status ===
          "Issued"
        ) {

          const today =
            new Date();

          const remainingDays =
            (new Date(
              issue.dueDate
            ) -
              today) /
            (1000 *
              60 *
              60 *
              24);

          const daysLeft =
            Math.ceil(
              remainingDays
            );

          // 1 day before due
          if (daysLeft === 1) {

            await sendEmail({
              to:
                req.user.email,

              subject:
                "Book Due Tomorrow",

              text: `
Hello ${req.user.name},

Reminder:
Your borrowed book is due tomorrow.

Please return it on time to avoid fines.

Library Management System
              `,
            });

            console.log(
              "Reminder email sent"
            );
          }
        }
      }

      res.json(updatedRecords);

    } catch (error) {

      res.status(500).json({
        message:
          error.message,
      });
    }
  };