import { useNavigate } from "react-router-dom";
import EditProduct from "../../Pages/Admin/products/editProduct";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaHeart, FaRegHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { deleteProduct } from "../../redux/features/products/productSlice";
import {
  wishlistProduct,
  removeWishlistedProduct,
} from "../../redux/features/wishlist/wishlistSlice";
import Toast from "../toast/toast";

const ProductCard = ({ id, name, price, isWishlisted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const role = localStorage.getItem("role");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const handleCardClick = () => {
    const path =
      role === "admin" ? `/admin/products/${id}` : `/app/products/${id}`;
    navigate(path);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsOpen(true);
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isWishlisted) {
      dispatch(wishlistProduct({ id, productDetailView: false }));
    } else {
      dispatch(removeWishlistedProduct({ id, productDetailView: false }));
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    dispatch(deleteProduct({ id })).then(() => {
      setToast({
        show: true,
        message: "Product record synchronized successfully!",
        type: "success",
      });
      setTimeout(() => setIsOpen(false), 2000);
    });
  };

  // Dynamic Theme Selection
  const isAdmin = role === "admin";
  // User color updated to indigo-600 as requested
  const themeTextColor = isAdmin
    ? "text-blue-600 dark:text-blue-400"
    : "text-indigo-600 dark:text-indigo-400";
  const wishlistHoverColor = isAdmin
    ? "group-hover/heart:text-blue-400"
    : "group-hover/heart:text-red-600";

  return (
    <>
      <div
        className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl dark:shadow-none border border-slate-100 dark:border-slate-800 transition-all duration-300 cursor-pointer"
        onClick={handleCardClick}
      >
        {isAdmin ? (
          <div className="absolute top-4 right-4 flex gap-2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-[-10px] group-hover:translate-y-0">
            <button
              onClick={handleEdit}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2.5 rounded-xl text-blue-600 shadow-lg hover:bg-blue-600 hover:text-white transition-colors"
              title="Edit Product"
            >
              <FaEdit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm p-2.5 rounded-xl text-red-600 shadow-lg hover:bg-red-600 hover:text-white transition-colors"
              title="Delete Product"
            >
              <FaTrashAlt size={16} />
            </button>
          </div>
        ) : (
          /* User Wishlist Heart (Indigo-600 Hover + Red Active State) */
          <button
            onClick={handleWishlist}
            className="absolute top-4 right-4 z-20 p-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-sm transition-all active:scale-90 group/heart"
          >
            {isWishlisted ? (
              <FaHeart className="text-red-600 text-sm drop-shadow-sm" />
            ) : (
              <FaRegHeart
                className={`text-red-400 ${wishlistHoverColor} text-sm transition-colors`}
              />
            )}
          </button>
        )}

        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src="https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80"
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 transition-colors">
          <h3 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight truncate mb-4">
            {name}
          </h3>

          <div className="flex items-center justify-between">
            <p
              className={`text-2xl font-black tracking-tighter ${themeTextColor}`}
            >
              <span className="text-sm font-bold mr-0.5">₹</span>
              {price}
            </p>

            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity">
              {isAdmin ? "Manage" : "View"}
            </span>
          </div>
        </div>
      </div>

      <EditProduct isOpen={isOpen} setIsOpen={setIsOpen} productId={id} />

      <Toast
        isOpen={toast.show}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    </>
  );
};

export default ProductCard;
