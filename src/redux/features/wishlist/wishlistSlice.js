import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

/* =======================
   GET CART
======================= */
export const getWishlist = createAsyncThunk(
  "wishlist/getWishlist",
  async (_, thunkAPI) => {
    try {
      const result = await api.get(apiRoutes.getWishlist());
      return result.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cart",
      );
    }
  },
);

/* =======================
  WISHLIST
======================= */
export const wishlistProduct = createAsyncThunk(
  "wishlist/add",
  async (data, thunkAPI) => {
    try {
      await api.post(apiRoutes.wishlistProduct(data?.id));
      return data.id; // Return ID for the reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

export const removeWishlistedProduct = createAsyncThunk(
  "wishlist/remove",
  async (data, thunkAPI) => {
    try {
      await api.delete(apiRoutes.removeWishlistedProduct(data?.id));
      return data.id; // Return ID for the reducer
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || "Error");
    }
  }
);

/* =======================
   SLICE
======================= */
const initialState = {
  loading: false,
  error: null,
  wishlist: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(wishlistProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(wishlistProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(wishlistProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeWishlistedProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeWishlistedProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(removeWishlistedProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default wishlistSlice.reducer;
