import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart, FaTrash, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus } from "react-icons/fa";
import { Link } from "react-router-dom";
import {
  getWishlist,
  removeWishlistedProduct,
} from "../../redux/features/wishlist/wishlistSlice";
import { addToCart } from "../../redux/features/cart/getCartSlice";

const Wishlist = () => {
  const dispatch = useDispatch();
  const { wishlist, loading } = useSelector((state) => state.wishlist);
  
  // State to manage quantities for each item in the wishlist
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  // Initialize quantities when wishlist is loaded
  useEffect(() => {
    if (wishlist.length > 0) {
      const initialQtys = {};
      wishlist.forEach((item) => {
        initialQtys[item.id] = 1;
      });
      setQuantities(initialQtys);
    }
  }, [wishlist]);

  const handleQuantity = (id, type, stock) => {
    setQuantities((prev) => {
      const currentQty = prev[id] || 1;
      if (type === "inc" && currentQty < stock) return { ...prev, [id]: currentQty + 1 };
      if (type === "dec" && currentQty > 1) return { ...prev, [id]: currentQty - 1 };
      return prev;
    });
  };

  const handleAddToCart = (product) => {
    const data = {
      user_id: localStorage.getItem("userId"),
      product_id: product.id,
      quantity: quantities[product.id] || 1,
    };
    dispatch(addToCart(data));
  };

  const handleRemove = (id) => {
    dispatch(removeWishlistedProduct({ id }));
  };

  if (loading)
    return (
      <div className="max-w-6xl mx-auto p-10 animate-pulse">
        <div className="h-10 bg-slate-200 w-48 rounded-xl mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto p-6 md:p-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
              <FaHeart className="text-2xl text-red-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                My Wishlist
              </h2>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">
                Saved for later
              </p>
            </div>
          </div>
          <Link
            to="/shop"
            className="hidden md:flex items-center gap-2 text-sm font-bold text-indigo-600 hover:gap-3 transition-all"
          >
            <FaArrowLeft size={12} /> Continue Shopping
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaHeart className="text-3xl text-slate-200 dark:text-slate-700" />
            </div>
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
              Your wishlist is empty
            </h3>
            <p className="text-slate-500 font-medium mb-8">
              Save items you love and they will appear here.
            </p>
            <Link
              to="/shop"
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 dark:shadow-none"
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <div
                key={product.id}
                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:-translate-y-2 transition-all duration-300"
              >
                {/* Product Image */}
                <div className="relative aspect-square mb-6 overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-800">
                  <img
                    src={product.image || "https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <button
                    onClick={() => handleRemove(product.id)}
                    className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-md text-slate-400 hover:text-red-500 rounded-2xl transition-colors shadow-sm"
                    title="Remove from wishlist"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>

                {/* Info */}
                <div className="space-y-1 mb-6 px-1">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white tracking-tight truncate">
                    {product.name}
                  </h4>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                      ₹{product.price}
                    </p>
                    <span
                      className={`text-[10px] font-black uppercase px-2 py-1 rounded-md ${product.stock > 0 ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </div>
                </div>

                {/* Action Section: Quantity Pill + Add to Cart */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                    <button
                      onClick={() => handleQuantity(product.id, "dec", product.stock)}
                      disabled={quantities[product.id] <= 1}
                      className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30"
                    >
                      <FaMinus size={10} className="text-slate-600 dark:text-slate-300" />
                    </button>
                    <span className="font-bold text-slate-800 dark:text-white">
                      {quantities[product.id] || 1}
                    </span>
                    <button
                      onClick={() => handleQuantity(product.id, "inc", product.stock)}
                      disabled={quantities[product.id] >= product.stock}
                      className="p-2.5 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30"
                    >
                      <FaPlus size={10} className="text-slate-600 dark:text-slate-300" />
                    </button>
                  </div>

                  <button
                    disabled={product.stock <= 0}
                    onClick={() => handleAddToCart(product)}
                    className="w-full py-4 bg-slate-900 dark:bg-indigo-600 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white rounded-full font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none"
                  >
                    <FaShoppingCart size={14} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;