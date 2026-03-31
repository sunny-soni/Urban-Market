// chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

export const chatWidgetPost = createAsyncThunk("chat/post", async (data, { rejectWithValue }) => {
  try {
    // Note: If using streaming, ensure your axios instance 
    // is configured for 'responseType: "stream"' or use fetch if axios struggles with headers
    const response = await api.post(apiRoutes.chat(), data);
    return response; 
  } catch (error) {
    return rejectWithValue(error.response?.data || "Something went wrong");
  }
});

const initialState = {
  loading: false,
  error: null,
  data: "",
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    // Reducer for manual updates if needed
    setChatData: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(chatWidgetPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chatWidgetPost.fulfilled, (state, action) => {
        state.loading = false;
        // We don't store the stream in Redux; we store the final result if needed
      })
      .addCase(chatWidgetPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setChatData } = chatSlice.actions;
export default chatSlice.reducer;