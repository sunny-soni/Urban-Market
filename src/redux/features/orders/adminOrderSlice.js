import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../../api/axios";
import apiRoutes from "../../../api/routes";

export const getAdminOrders = createAsyncThunk(
  "order/getAdminOrders",
  async (_, thunkAPI) => {
    try {
      const result = await api.get(apiRoutes.getAdminOrders());
      console.log("🚀 ~ result:", result);
      return result.data.orders;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch orders",
      );
    }
  },
);

export const updateAdminOrders = createAsyncThunk(
  "order/updateAdminOrders",
  async (data, thunkAPI) => {
    const { orderId, newStatus } = data;
    try {
      const result = await api.put(apiRoutes.updateAdminOrders(orderId), {
        status: newStatus,
      });
      return result.data.order;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data || "Failed to fetch orders",
      );
    }
  },
);

/* =======================
   SLICE
======================= */
const initialState = {
  loading: false,
  error: null,
  orders: [],
};

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(getAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateAdminOrders.fulfilled, (state, action) => {
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      });
  },
});

export default adminOrderSlice.reducer;
