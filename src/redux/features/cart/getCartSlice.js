import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

/* =======================
   GET CART
======================= */
export const getCartProducts = createAsyncThunk(
  "cart/getCart",
  async (_, thunkAPI) => {
    try {
      const result = await api.get(apiRoutes.getCart());
      return result.data.products;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch cart"
      );
    }
  }
);

/* =======================
   UPDATE QUANTITY
======================= */
export const updateProductQty = createAsyncThunk(
  "cart/updateQty",
  async (data, thunkAPI) => {
    try {
      await api.put(apiRoutes.updateProductQty(data.id), {
        quantity: data.newQty,
      });

      // 🔥 IMPORTANT: refresh cart after update
      thunkAPI.dispatch(getCartProducts());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to update quantity"
      );
    }
  }
);

/* =======================
   ADD TO CART
======================= */
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (data, thunkAPI) => {
    try {
      await api.post(apiRoutes.addToCart(), data);

      // 🔥 refresh cart after add
      thunkAPI.dispatch(getCartProducts());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add to cart"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "cart/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await api.delete(apiRoutes.deleteProductFromCart(id));

      // 🔥 refresh cart after add
      thunkAPI.dispatch(getCartProducts());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to add to cart"
      );
    }
  }
);

/* =======================
   SLICE
======================= */
const initialState = {
  loading: false,
  error: null,
  cart: [],
};

const getCartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET CART
      .addCase(getCartProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCartProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCartProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // UPDATE / ADD (only control loading & error)
      .addCase(updateProductQty.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProductQty.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProductQty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default getCartSlice.reducer;
