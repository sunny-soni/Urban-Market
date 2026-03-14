import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";
import { getCartProducts } from "../cart/getCartSlice";

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (_, thunkAPI) => {
    try {
      const result = await api.get(apiRoutes.getOrders());
      console.log("🚀 ~ result:", result)
      return result.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch orders"
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (data, thunkAPI) => {
    try {
      await api.post(apiRoutes.createOrder(), data);

      thunkAPI.dispatch(getOrders());
      thunkAPI.dispatch(getCartProducts());
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to create the order"
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
  orders: [],
};

const getOrderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // GET CART
      .addCase(getOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export default getOrderSlice.reducer;
