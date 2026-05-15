// backend/models/Book.js
import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  isbn: { type: String, required: true, unique: true },
  // 'available' helps track current stock vs total quantity
  available: { type: Number, required: true } ,
  image: { type: String,},
}, { timestamps: true });

const Book = mongoose.model('Book', bookSchema);
export default Book;