import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth/authSlice";
import productReducer from "./features/products/productSlice";
import productByIdReducer from "./features/products/productIdSlice";
import getCartReducer from "./features/cart/getCartSlice";
import orderReducer from "./features/orders/orderSlice";
import adminOrderReducer from "./features/orders/adminOrderSlice";
import wishlistSlice from "./features/wishlist/wishlistSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    productById: productByIdReducer,
    getCart: getCartReducer,
    orders: orderReducer,
    adminOrder: adminOrderReducer,
    wishlist: wishlistSlice,
  },
});
