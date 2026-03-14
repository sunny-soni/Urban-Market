import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../redux/features/products/productIdSlice";
import { useEffect, useState } from "react";
import { addToCart } from "../../../redux/features/cart/getCartSlice";
import { wishlistProduct, removeWishlistedProduct } from "../../../redux/features/wishlist/wishlistSlice";
import { FaHeart, FaRegHeart, FaShoppingCart, FaArrowLeft, FaPlus, FaMinus, FaLock, FaShippingFast } from "react-icons/fa";

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { product, loading, error } = useSelector((state) => state.productById);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  const handleWishlist = () => {
    const data = { id };
    if (product.is_wishlisted) {
      dispatch(removeWishlistedProduct(data));
    } else {
      dispatch(wishlistProduct(data));
    }
  };

  const addCartItems = () => {
    const data = {
      user_id: localStorage.getItem("userId"),
      product_id: id,
      quantity: quantity,
    };
    dispatch(addToCart(data));
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-slate-950">
      <h2 className="text-xl font-bold text-slate-800 dark:text-white">Product not found</h2>
      <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 font-bold text-sm">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 p-6 md:p-12 transition-colors duration-300">
      {/* The key fix: Added 'max-w-6xl' and 'mx-auto' to constrain the whole layout
      */}
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Back Navigation Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold uppercase text-[9px] tracking-[0.2em] mb-10 transition-colors"
        >
          <FaArrowLeft size={10} /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          
          {/* Image Container with constrained size */}
          <div className="relative group lg:max-w-md lg:mx-auto">
            <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
              <img
                src="https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80"
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            {/* Elegant Wishlist Toggle Button */}
            <button 
              onClick={handleWishlist}
              className="absolute top-6 right-6 p-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl shadow-xl transition-all active:scale-90"
            >
              {product.is_wishlisted ? (
                <FaHeart className="text-red-500 text-lg" />
              ) : (
                <FaRegHeart className="text-slate-400 hover:text-red-400 text-lg" />
              )}
            </button>
          </div>

          {/* Details Section - Aligned and compact */}
          <div className="flex flex-col justify-center">
            <div className="mb-8">
              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.3em] mb-3 block">
                Premium Collection
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {product.description}
              </p>
            </div>

            <div className="flex items-center gap-6 mb-12">
              <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 tracking-tighter">
                ₹{product.price}
              </span>
              {/* Corrected stock status design to match original */}
              <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                product.stock > 0 
                ? "bg-green-50 text-green-600 dark:bg-green-500/10" 
                : "bg-red-50 text-red-600 dark:bg-red-500/10"
              }`}>
                {product.stock > 0 ? `${product.stock} units available` : "Sold Out"}
              </div>
            </div>

            {/* Compact Actions Section */}
            <div className="space-y-6">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quantity Controller Pill */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 p-1.5 rounded-full border border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    disabled={quantity === 1}
                    className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30"
                  >
                    <FaMinus size={11} className="text-slate-600 dark:text-slate-300" />
                  </button>
                  <span className="w-10 text-center font-bold text-slate-800 dark:text-white text-lg">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    disabled={quantity >= product.stock}
                    className="p-3 hover:bg-white dark:hover:bg-slate-700 rounded-full transition-colors disabled:opacity-30"
                  >
                    <FaPlus size={11} className="text-slate-600 dark:text-slate-300" />
                  </button>
                </div>

                <div className="flex-1 min-w-[200px]">
                  <button
                    disabled={product.stock <= 0}
                    onClick={addCartItems}
                    className="w-full py-5 bg-slate-900 dark:bg-indigo-600 text-white rounded-full font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:opacity-95 transition-all active:scale-[0.98] disabled:bg-slate-200 dark:disabled:bg-slate-800"
                  >
                    <FaShoppingCart size={13}/> Add to Cart
                  </button>
                </div>
              </div>

              {/* Simplified Trust Badges */}
              <div className="flex gap-10 pt-8 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <FaShippingFast className="text-indigo-600 text-xl"/>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Free Shipping</span>
                </div>
                <div className="flex items-center gap-3">
                  <FaLock className="text-indigo-600 text-lg"/>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Secure Payment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;