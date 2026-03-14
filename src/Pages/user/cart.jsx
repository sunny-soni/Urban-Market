import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCartProducts, updateProductQty, deleteProduct } from "../../redux/features/cart/getCartSlice";
import { FaTrash, FaShoppingBag, FaArrowLeft, FaMinus, FaPlus } from "react-icons/fa";
import Checkout from "../../components/cart/checkout";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { cart, loading, error } = useSelector((state) => state.getCart);

  useEffect(() => {
    dispatch(getCartProducts());
  }, [dispatch]);

  const handleQtyChange = (id, newQty) => {
    if (newQty < 1) return;
    dispatch(updateProductQty({ id, newQty }));
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-xl font-bold text-slate-400">Refreshing your cart...</div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-2xl text-center">
      <p className="text-red-600 dark:text-red-400 font-medium">{error}</p>
    </div>
  );

  if (!cart?.length) {
    return (
      <div className="max-w-md mx-auto mt-20 text-center p-10 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-slate-800 transition-colors">
        <div className="bg-indigo-50 dark:bg-indigo-950 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaShoppingBag className="text-4xl text-indigo-500" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Your cart is empty</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Ready to start shopping for the best deals?</p>
        <button 
          onClick={() => navigate("/app/products")}
          className="w-full bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition shadow-lg shadow-indigo-200 dark:shadow-none"
        >
          Explore Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 min-h-screen transition-colors duration-300 bg-transparent">
      {/* Back Button */}
      <div 
        className="flex items-center gap-2 mb-8 cursor-pointer group w-fit" 
        onClick={() => navigate(-1)}
      >
        <div className="p-2 rounded-full bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 group-hover:bg-indigo-600 group-hover:text-white transition-all">
          <FaArrowLeft size={12} /> 
        </div>
        <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">Back to Store</span>
      </div>

      <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter">My Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Side: Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all gap-4">
              <div className="flex gap-5 items-center w-full sm:w-auto">
                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center font-black text-slate-200 dark:text-slate-700 text-xs tracking-widest overflow-hidden">
                  {/* Placeholder for Product Image */}
                  IMG
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug">{item.name}</h3>
                  <p className="text-indigo-600 dark:text-indigo-400 font-black text-xl mt-1">₹{item.price.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-8">
                {/* Quantity Pill */}
                <div className="flex items-center bg-slate-50 dark:bg-slate-800 rounded-2xl p-1.5 border border-slate-100 dark:border-slate-700">
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                    disabled={item.quantity === 1}
                    className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 disabled:opacity-30 transition dark:text-white"
                  >
                    <FaMinus size={10} />
                  </button>
                  <span className="px-5 font-black text-slate-800 dark:text-slate-200 min-w-[45px] text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                    className="w-9 h-9 flex items-center justify-center bg-white dark:bg-slate-700 rounded-xl shadow-sm hover:bg-slate-100 dark:hover:bg-slate-600 transition dark:text-white"
                  >
                    <FaPlus size={10} />
                  </button>
                </div>

                <button 
                  onClick={() => dispatch(deleteProduct(item.id))}
                  className="p-3.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all"
                  title="Remove Item"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Order Summary */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none sticky top-24 transition-all">
          <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-8 tracking-tight">Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
              <span>Subtotal</span>
              <span className="text-slate-800 dark:text-slate-200">₹{calculateTotal().toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-slate-400 font-medium">
              <span>Delivery</span>
              <span className="text-green-500 font-bold uppercase text-[10px] tracking-widest bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-md">Free</span>
            </div>
            <div className="pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-end">
              <span className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Amount</span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">₹{calculateTotal().toLocaleString()}</span>
            </div>
          </div>

          <button
            className="w-full py-5 bg-indigo-600 text-white rounded-[1.5rem] font-bold shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3 uppercase tracking-widest text-sm"
            onClick={() => setIsOpen(true)}
          >
            <span>Proceed to Checkout</span>
          </button>
          
          <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-400 uppercase font-bold tracking-tighter">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
            Secure Payment Gateway
          </div>
        </div>
      </div>

      <Checkout isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
};

export default Cart;