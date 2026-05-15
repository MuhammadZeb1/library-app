import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api.js';

// GET ALL BOOKS
export const fetchBooks = createAsyncThunk('books/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await API.get('/books');
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// GET SINGLE BOOK
export const fetchBookById = createAsyncThunk('books/fetchSingle', async (id, thunkAPI) => {
  try {
    const { data } = await API.get(`/books/${id}`);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

/**
 * CREATE BOOK
 * @param {FormData} bookData - Should contain title, author, isbn, etc., and the 'image' file.
 */
export const addBook = createAsyncThunk('books/add', async (bookData, thunkAPI) => {
  try {
    // When sending FormData, Axios automatically sets 'Content-Type: multipart/form-data'
    const { data } = await API.post('/books', bookData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

/**
 * UPDATE BOOK
 * @param {Object} payload - Object containing { id, bookData }
 * @param {FormData} payload.bookData - The FormData containing updated text fields and/or a new image.
 */
export const updateBook = createAsyncThunk('books/update', async ({ id, bookData }, thunkAPI) => {
  try {
    const { data } = await API.put(`/books/${id}`, bookData);
    return data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});

// DELETE BOOK
export const deleteBook = createAsyncThunk('books/delete', async (id, thunkAPI) => {
  try {
    await API.delete(`/books/${id}`);
    return id; 
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || error.message);
  }
});