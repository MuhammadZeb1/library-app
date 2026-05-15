import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice.jsx';
import bookReducer from '../features/books/bookSlice.jsx';
import issueReducer from '../features/issues/issueSlice.jsx';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    books: bookReducer,
    issues: issueReducer,
  },
});
