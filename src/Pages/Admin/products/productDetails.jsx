import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductById } from "../../../redux/features/products/productIdSlice";
import { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt, FaChevronLeft, FaBoxes, FaTag, FaHistory } from "react-icons/fa";
import EditProduct from "../../Admin/products/editProduct"; // Adjust path as needed

const ProductDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const role = localStorage.getItem("role");
  const { product, loading, error } = useSelector((state) => state.productById);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="animate-pulse text-blue-500 font-black tracking-widest uppercase">Fetching System Data...</div>
    </div>
  );

  if (error || !product) return (
    <div className="text-center mt-20 bg-white dark:bg-slate-900 p-10 rounded-3xl max-w-md mx-auto shadow-xl">
      <p className="text-red-500 font-bold">Product entry not found in database.</p>
      <button onClick={() => navigate(-1)} className="mt-4 text-blue-600 font-bold underline">Return to Inventory</button>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-8 transition-colors">
      {/* Admin Breadcrumb */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-600 transition mb-8 font-bold text-xs uppercase tracking-widest"
      >
        <FaChevronLeft size={10} /> Inventory Management
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 bg-white dark:bg-slate-900 shadow-xl rounded-[2.5rem] p-8 md:p-12 border border-slate-100 dark:border-slate-800 transition-all">
        
        {/* Product Preview Image (4 Cols) */}
        <div className="lg:col-span-5 flex justify-center items-center bg-slate-50 dark:bg-slate-800 rounded-[2rem] overflow-hidden border dark:border-slate-700">
          <img
            src="https://img.freepik.com/free-photo/lavender-field-sunset-near-valensole_268835-3910.jpg?semt=ais_hybrid&w=740&q=80"
            alt={product.name}
            className="object-cover w-full h-full max-h-[500px]"
          />
        </div>

        {/* Management Info (7 Cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest">
                <FaTag /> Product SKU: {id.substring(0, 8)}
              </span>
              <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                product.stock > 10 
                  ? "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800"
                  : "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800"
              }`}>
                {product.stock} Units In Stock
              </span>
            </div>

            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 italic">
              {product.name}
            </h1>
            
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-lg border-l-4 border-slate-200 dark:border-slate-700 pl-4 mb-8">
              {product.description || "No database description provided for this record."}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Unit Price</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">₹{product.price}</p>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border dark:border-slate-800">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Stock Level</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <FaBoxes className="text-blue-500" /> {product.stock}
                </p>
              </div>
            </div>
          </div>

          {/* Admin Action Console */}
          <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Management Console</h3>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setIsEditOpen(true)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-2xl font-bold transition-all active:scale-95 shadow-lg shadow-blue-200 dark:shadow-none"
              >
                <FaEdit /> Edit Records
              </button>
              
              <button
                className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 px-6 py-4 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <FaHistory /> View Logs
              </button>

              <button
                className="p-4 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/20 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                title="Delete from Inventory"
              >
                <FaTrashAlt />
              </button>
            </div>
          </div>
        </div>
      </div>

      <EditProduct isOpen={isEditOpen} setIsOpen={setIsEditOpen} productId={id} />
    </div>
  );
};

export default ProductDetails;