import { createSlice } from "@reduxjs/toolkit";

import {
  fetchBooks,
  fetchBookById,
  addBook,
  updateBook,
  deleteBook,
} from "./bookActions.jsx";

import {
  issueBookAction,
  fetchMyIssues,
  returnBookAction,
  fetchAllIssues,
} from "../issues/issueActions.jsx";

/*
=====================================
INITIAL STATE
=====================================
*/
const initialState = {
  // BOOKS
  books: [],
  currentBook: null,

  // ISSUES (BORROW SYSTEM)
  issues: [],

  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

/*
=====================================
SLICE
=====================================
*/
const bookSlice = createSlice({
  name: "books",
  initialState,

  reducers: {
    resetBookState: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = "";
    },

    clearCurrentBook: (state) => {
      state.currentBook = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      =========================
      BOOKS
      =========================
      */

      // FETCH BOOKS
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = action.payload;
      })

      // FETCH SINGLE BOOK
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.currentBook = action.payload;
      })

      // ADD BOOK
      .addCase(addBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.books.push(action.payload);
      })

      // UPDATE BOOK
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.books.findIndex(
          (b) => b._id === action.payload._id
        );

        if (index !== -1) {
          state.books[index] = action.payload;
        }
      })

      // DELETE BOOK
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false;
        state.books = state.books.filter(
          (book) => book._id !== action.payload
        );
      })

      /*
      =========================
      ISSUES (BORROW SYSTEM)
      =========================
      */

      // BORROW BOOK
      .addCase(issueBookAction.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.issues.push(action.payload);
      })

      // MY ISSUES
      .addCase(fetchMyIssues.fulfilled, (state, action) => {
        state.issues = action.payload;
      })

      // RETURN BOOK
      .addCase(returnBookAction.fulfilled, (state, action) => {
        const index = state.issues.findIndex(
          (i) => i._id === action.payload._id
        );

        if (index !== -1) {
          state.issues[index] = action.payload;
        }
      })

      // ADMIN ALL ISSUES
      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.issues = action.payload;
      })

      /*
      =========================
      GLOBAL ERROR HANDLER
      =========================
      */
      .addMatcher(
        (action) => action.type.endsWith("/rejected"),
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.message = action.payload;
        }
      );
  },
});

export const {
  resetBookState,
  clearCurrentBook,
} = bookSlice.actions;

export default bookSlice.reducer;