import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";
import {
  wishlistProduct,
  removeWishlistedProduct,
} from "../wishlist/wishlistSlice";

export const fetchProducts = createAsyncThunk("fetchProducts", async (args) => {
  try {
    const { searchTerm, offset } = args;
    const result = await api.get(apiRoutes.fetchProducts(searchTerm, offset));
    return result.data;
  } catch (error) {
    console.log("🚀 ~ error:", error);
  }
});

export const addProduct = createAsyncThunk(
  "addProduct",
  async (data, thunkApi) => {
    try {
      await api.post(apiRoutes.addProduct(), data);
      thunkApi.dispatch(fetchProducts({ searchTerm: "", offset: 0 }));
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  },
);

export const editProduct = createAsyncThunk(
  "editProduct",
  async (data, thunkApi) => {
    const { productId, formData } = data;
    try {
      await api.put(apiRoutes.editProduct(productId), formData);
      thunkApi.dispatch(fetchProducts({ searchTerm: "", offset: 0 }));
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  },
);

export const deleteProduct = createAsyncThunk(
  "deleteProduct",
  async (data, thunkApi) => {
    const { id } = data;
    try {
      await api.delete(apiRoutes.deleteProduct(id));
      const state = thunkApi.getState();
      const currentOffset = state.products.offset;
      const searchTerm = state.products.searchTerm;
      thunkApi.dispatch(
        fetchProducts({ searchTerm: searchTerm, offset: currentOffset }),
      );
    } catch (error) {
      console.log("🚀 ~ error:", error);
    }
  },
);

const initialState = {
  loading: false,
  error: false,
  products: [],
  rows: 0,
  totalRows: 0,
  offset: 0,
  searchTerm: "",
};

const productSlice = createSlice({
  name: "product",
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
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.rows = action.payload.rows;
        state.totalRows = action.payload.totalRows;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(wishlistProduct.pending, (state, action) => {
        const productId = action.meta.arg.id;
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.is_wishlisted = true;
        }
      })
      .addCase(wishlistProduct.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.is_wishlisted = false;
        }
      })

      /* --- Optimistic Wishlist REMOVE (Turn Heart Gray) --- */
      .addCase(removeWishlistedProduct.pending, (state, action) => {
        const productId = action.meta.arg.id;
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.is_wishlisted = false;
        }
      })
      .addCase(removeWishlistedProduct.rejected, (state, action) => {
        const productId = action.meta.arg.id;
        const product = state.products.find((p) => p.id === productId);
        if (product) {
          product.is_wishlisted = true; // Rollback on failure
        }
      });
  },
});

export const { setOffset, setSearchTerm } = productSlice.actions;
export default productSlice.reducer;
