import Book from "../models/Book.js";
import fs from "fs";
import path from "path";

// @desc    Add new book with image
// @route   POST /api/books
export const addBook = async (req, res) => {
  try {
    const { title, author, category, quantity, isbn } = req.body;

    const bookExists = await Book.findOne({ isbn });

    // Prevent duplicate ISBN
    if (bookExists) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res
        .status(400)
        .json({ message: "Book with this ISBN already exists" });
    }

    // Save image path
    const imagePath = req.file
      ? `/uploads/${req.file.filename}`
      : "";

    const book = await Book.create({
      title,
      author,
      category,
      quantity,
      isbn,
      available: quantity,
      image: imagePath,
    });

    res.status(201).json(book);
  } catch (error) {
    // Delete uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get all books
// @route   GET /api/books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find({}).sort({ createdAt: -1 });

    res.json(books);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
export const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    res.json(book);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update a book
// @route   PUT /api/books/:id
export const updateBook = async (req, res) => {
  try {
    const { title, author, category, quantity, isbn } = req.body;

    const book = await Book.findById(req.params.id);

    if (!book) {
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Update quantity + availability
    if (quantity !== undefined) {
      const difference = quantity - book.quantity;

      book.available = book.available + difference;
      book.quantity = quantity;
    }

    // Update image
    if (req.file) {
      // Delete old image
      if (book.image) {
        const oldImagePath = path.join(
          "uploads",
          path.basename(book.image)
        );

        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      book.image = `/uploads/${req.file.filename}`;
    }

    // Update fields
    book.title = title || book.title;
    book.author = author || book.author;
    book.category = category || book.category;
    book.isbn = isbn || book.isbn;

    const updatedBook = await book.save();

    res.json(updatedBook);
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    console.log(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
export const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    // Delete image
    if (book.image) {
      const imagePath = path.join(
        "uploads",
        path.basename(book.image)
      );

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await book.deleteOne();

    res.json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};