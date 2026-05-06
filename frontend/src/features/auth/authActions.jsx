// frontend/src/features/auth/authActions.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../utils/api.js'; // Import your custom instance

// Register - Public route (token won't exist yet, which is fine)
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
  try {
    const { data } = await API.post('/auth/register', userData);
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

// Login - Public route
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
  try {
    const { data } = await API.post('/auth/login', userData);
    if (data) {
      localStorage.setItem('user', JSON.stringify(data));
    }
    return data;
  } catch (error) {
    const message = error.response?.data?.message || error.message;
    return thunkAPI.rejectWithValue(message);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  localStorage.removeItem('user');
});