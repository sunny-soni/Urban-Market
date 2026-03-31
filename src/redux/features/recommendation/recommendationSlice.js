import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

export const fetchRecommendedProducts = createAsyncThunk(
  "recommendation/fetchRecommendedProducts",
  async (args) => {
    try {
      const { searchTerm, offset } = args;
      const result = await api.get(
        apiRoutes.recommendations(searchTerm, offset),
      );
      return result.data;
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  },
);

const initialState = {
  loading: false,
  error: null,
  recommendations: [],
  rows: 0,
  totalRows: 0,
  offset: 0,
  searchTerm: "",
};

const getRecommendationSlice = createSlice({
  name: "recommendations",
  initialState,
  reducers: {
    setOffset: (state, action) => {
      state.offset = action.payload;
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendedProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecommendedProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.recommendations = action.payload.products;
        state.rows = action.payload.rows;
        state.totalRows = action.payload.totalRows;
      })
      .addCase(fetchRecommendedProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setOffset, setSearchTerm } = getRecommendationSlice.actions;
export default getRecommendationSlice.reducer;
