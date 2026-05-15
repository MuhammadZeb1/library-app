import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  addBook,
  updateBook,
  fetchBookById,
} from "../features/books/bookActions.jsx";

const BookForm = () => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentBook, isSuccess } = useSelector(
    (state) => state.books
  );

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: 1,
    isbn: "",
  });

  const [image, setImage] = useState(null);

  useEffect(() => {
    if (id) {
      dispatch(fetchBookById(id));
    }
  }, [id, dispatch]);

  useEffect(() => {
    if (id && currentBook) {
      setFormData({
        title: currentBook.title || "",
        author: currentBook.author || "",
        category: currentBook.category || "",
        quantity: currentBook.quantity || 1,
        isbn: currentBook.isbn || "",
      });
    }

    if (isSuccess) {
      navigate("/admin-dashboard");
    }
  }, [currentBook, id, isSuccess, navigate]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    const data = new FormData();

    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("category", formData.category);
    data.append("quantity", formData.quantity);
    data.append("isbn", formData.isbn);

    if (image) {
      data.append("image", image);
    }

    if (id) {
      dispatch(updateBook({ id, bookData: data }));
    } else {
      dispatch(addBook(data));
    }
  };

  return (
    <div className="flex justify-center p-10">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 shadow-lg rounded-lg w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4">
          {id ? "Edit Book" : "Add New Book"}
        </h2>

        {/* Title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          className="w-full p-2 mb-3 border rounded"
          value={formData.title}
          onChange={handleChange}
          required
        />

        {/* Author */}
        <input
          type="text"
          name="author"
          placeholder="Author"
          className="w-full p-2 mb-3 border rounded"
          value={formData.author}
          onChange={handleChange}
          required
        />

        {/* Category */}
        <select
          name="category"
          className="w-full p-2 mb-3 border rounded"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          <option value="Programming">Programming</option>
          <option value="Science">Science</option>
          <option value="Mathematics">Mathematics</option>
          <option value="History">History</option>
          <option value="Islamic">Islamic</option>
          <option value="Novel">Novel</option>
          <option value="Computer Science">Computer Science</option>
        </select>

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          placeholder="Quantity"
          className="w-full p-2 mb-3 border rounded"
          value={formData.quantity}
          onChange={handleChange}
          required
        />

        {/* ISBN */}
        <input
          type="text"
          name="isbn"
          placeholder="ISBN"
          className="w-full p-2 mb-3 border rounded"
          value={formData.isbn}
          onChange={handleChange}
          required
        />

        {/* Image */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Book Cover Image
          </label>

          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        {/* Button */}
        <button className="w-full bg-green-600 text-white py-2 rounded font-bold hover:bg-green-700">
          {id ? "Update Book" : "Save Book"}
        </button>
      </form>
    </div>
  );
};

export default BookForm;