import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";
import { wishlistProduct, removeWishlistedProduct } from "../wishlist/wishlistSlice";

export const fetchProductById = createAsyncThunk(
  "fetchProductsById",
  async (id) => {
    try {
      const result = await api.get(apiRoutes.fetchProductsById(id));
      // Assuming your backend returns { product: { ... } }
      return result.data.product; 
    } catch (error) {
      console.log("🚀 ~ error:", error);
      throw error;
    }
  },
);

const initialState = {
  loading: false,
  error: false,
  product: null, // Changed to null for a single object
};

const productById = createSlice({
  name: "productById",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(wishlistProduct.pending, (state, action) => {
        const productId = action.meta.arg.id;
        if (state.product && state.product.id == productId) {
          state.product.is_wishlisted = true;
        }
      })
      .addCase(wishlistProduct.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        if (state.product && state.product.id == productId) {
          state.product.is_wishlisted = false;
        }
      })

      .addCase(removeWishlistedProduct.pending, (state, action) => {
        const productId = action.meta.arg.id;
        if (state.product && state.product.id == productId) {
          state.product.is_wishlisted = false;
        }
      })
      .addCase(removeWishlistedProduct.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        if (state.product && state.product.id == productId) {
          state.product.is_wishlisted = true;
        }
      });
  },
});

export default productById.reducer;