import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editProduct } from "../../../redux/features/products/productSlice";
import { fetchProductById } from "../../../redux/features/products/productIdSlice";
import { useEffect } from "react";
import {
  FaTimes,
  FaBox,
  FaInfoCircle,
  FaTag,
  FaWarehouse,
} from "react-icons/fa";

const schema = yup.object({
  name: yup.string().required("Product name is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price is required"),
  description: yup.string().required("Description is required"),
  stock: yup
    .number()
    .typeError("Stock must be a number")
    .required("Stock is required"),
});

const EditProduct = ({ isOpen, setIsOpen, productId }) => {
  const dispatch = useDispatch();
  const { product, loading } = useSelector((state) => state.productById);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (isOpen && productId) {
      dispatch(fetchProductById(productId));
    }
  }, [dispatch, productId, isOpen]);

  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        price: product.price,
        description: product.description,
        stock: product.stock,
      });
    }
  }, [product, reset]);

  const onSubmit = (data) => {
    dispatch(editProduct({ productId, formData : data }));
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800 dark:text-white tracking-tight">
              Edit Product
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Update inventory details
            </p>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-slate-400 font-bold animate-pulse uppercase tracking-widest">
            Loading Data...
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                <FaBox size={10} /> Product Name
              </label>
              <input
                {...register("name")}
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none bg-slate-50 dark:bg-slate-800 dark:text-white ${
                  errors.name
                    ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20"
                    : "border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                <FaInfoCircle size={10} /> Description
              </label>
              <textarea
                {...register("description")}
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border transition-all outline-none bg-slate-50 dark:bg-slate-800 dark:text-white resize-none ${
                  errors.description
                    ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20"
                    : "border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500"
                }`}
              />
              {errors.description && (
                <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                  <FaTag size={10} /> Price (₹)
                </label>
                <input
                  type="number"
                  {...register("price")}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none bg-slate-50 dark:bg-slate-800 dark:text-white ${
                    errors.price
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20"
                      : "border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500"
                  }`}
                />
                {errors.price && (
                  <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-2 ml-1 flex items-center gap-2">
                  <FaWarehouse size={10} /> Stock Level
                </label>
                <input
                  type="number"
                  {...register("stock")}
                  className={`w-full px-4 py-3 rounded-xl border transition-all outline-none bg-slate-50 dark:bg-slate-800 dark:text-white ${
                    errors.stock
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20"
                      : "border-slate-100 dark:border-slate-700 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/20 focus:border-blue-500"
                  }`}
                />
                {errors.stock && (
                  <p className="text-red-500 text-[10px] font-bold mt-2 ml-1 uppercase">
                    {errors.stock.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t dark:border-slate-800 mt-4">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-6 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"
              >
                Discard
              </button>
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-lg shadow-blue-200 dark:shadow-none transition-all active:scale-95"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
