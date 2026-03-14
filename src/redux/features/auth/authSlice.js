import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials) => {
    const res = await api.post(apiRoutes.login(), credentials);
    return res.data;
  },
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (credentials) => {
    const res = await api.post(apiRoutes.register(), credentials);
    return res.data;
  },
);

const initialState = {
  userId: null,
  token: null,
  isAuthenticated: null,
  loading: false,
  error: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
    rehydrateUser: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.role = action.payload.role;
      state.userId = action.payload.userId;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.userId = action.payload.userId;
        state.role = action.payload.userId == 1 ? "admin" : "user";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("userId", action.payload.userId);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, rehydrateUser } = authSlice.actions;
export default authSlice.reducer;
