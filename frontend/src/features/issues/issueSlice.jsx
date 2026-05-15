import { createSlice } from "@reduxjs/toolkit";

import {
  issueBookAction,
  fetchMyIssues,
  returnBookAction,
  fetchAllIssues,
} from "./issueActions.jsx";

const initialState = {
  issues: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

const issueSlice = createSlice({
  name: "issues",

  initialState,

  reducers: {
    resetIssueState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      /*
      =========================
      FETCH MY ISSUES
      =========================
      */
      .addCase(fetchMyIssues.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchMyIssues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.issues = action.payload;
      })

      .addCase(fetchMyIssues.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /*
      =========================
      FETCH ALL ISSUES (ADMIN)
      =========================
      */
      .addCase(fetchAllIssues.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(fetchAllIssues.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.issues = action.payload;
      })

      .addCase(fetchAllIssues.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /*
      =========================
      ISSUE A BOOK
      =========================
      */
      .addCase(issueBookAction.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(issueBookAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.issues.push(action.payload);
      })

      .addCase(issueBookAction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      /*
      =========================
      RETURN BOOK
      =========================
      */
      .addCase(returnBookAction.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(returnBookAction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        const index = state.issues.findIndex(
          (issue) => issue._id === action.payload._id
        );

        if (index !== -1) {
          state.issues[index] = action.payload;
        }
      })

      .addCase(returnBookAction.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetIssueState } = issueSlice.actions;

export default issueSlice.reducer;