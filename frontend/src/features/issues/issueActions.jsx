import { createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../utils/api.js";

/*
=====================================
BOOKS
=====================================
*/

// GET ALL BOOKS
export const fetchBooks = createAsyncThunk(
  "books/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/books");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

/* ... other book actions remain same ... */

/*
=====================================
ISSUE / BORROW SYSTEM
=====================================
*/

// BORROW BOOK
export const issueBookAction = createAsyncThunk(
  "issues/issueBook",
  async (bookId, thunkAPI) => {
    try {
      const state = thunkAPI.getState();

      // Ensure user is logged in
      const studentId = state.auth.user?._id;
      
      if (!studentId) {
        return thunkAPI.rejectWithValue("User not authenticated");
      }

      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      // Payload structure based on common backend requirements
      // Some backends expect 'student' and 'book' instead of 'studentId' and 'bookId'
      // Backend expects 'bookId' and 'dueDate' in body. 
      // 'studentId' is taken from req.user._id in backend middleware.
      const payload = {
        bookId,
        dueDate,
      };

      console.log("Sending Issue Request:", payload);

      const { data } = await API.post("/issues", payload);

      return data;
    } catch (error) {
      console.error("Issue Book Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// GET MY BORROWED BOOKS
export const fetchMyIssues = createAsyncThunk(
  "issues/fetchMine",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/issues/my-records");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// RETURN BOOK
export const returnBookAction = createAsyncThunk(
  "issues/return",
  async (issueId, thunkAPI) => {
    try {
      const { data } = await API.put(`/issues/${issueId}/return`);
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);

// ADMIN - GET ALL ISSUES
export const fetchAllIssues = createAsyncThunk(
  "issues/fetchAll",
  async (_, thunkAPI) => {
    try {
      const { data } = await API.get("/issues/all");
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || error.message
      );
    }
  }
);
