import AddProducts from "./addProducts";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/features/products/productSlice";
import ProductCard from "../../../components/products/productCard";
import { FaSearch, FaPlus } from "react-icons/fa";
import Pagination from "../../../components/pagination/pagination";
import {
  setOffset,
  setSearchTerm,
} from "../../../redux/features/products/productSlice";

function Products() {
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const { products, totalRows, searchTerm, offset } = useSelector((state) => {
    return state.products;
  });
  const { userId } = useSelector((state) => state.auth);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      dispatch(fetchProducts({ searchTerm, offset }));
      isFirstRender.current = false;
      return;
    }

    const delayDebounceFn = setTimeout(() => {
      dispatch(fetchProducts({ searchTerm, offset }));
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, offset, dispatch]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
    dispatch(setOffset(0));
    setCurrentPage(1);
  };

  return (
    <div className="p-4 min-h-screen bg-transparent transition-colors duration-300">
      {userId == 1 && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Bar Container */}
          <div className="relative w-full max-w-md">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search inventory..."
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500 dark:text-white transition-all shadow-sm"
              onChange={(e) => handleSearchChange(e)}
            />
          </div>

          {/* Add Product Button */}
          <button
            className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 text-white px-6 py-3 font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
            onClick={() => setIsOpen(true)}
          >
            <FaPlus size={14} />
            <span>Add Product</span>
          </button>
        </div>
      )}

      {/* Product Grid - Responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-2 py-2">
        {products?.length > 0 &&
          products?.map((item, index) => {
            return (
              <ProductCard
                key={item.id}
                id={item?.id}
                name={item?.name}
                price={item?.price}
              />
            );
          })}
      </div>

      {/* Pagination Section */}
      <div className="mt-10 border-t border-slate-100 dark:border-slate-800 pt-6">
        <Pagination
          totalRows={totalRows}
          setOffset={setOffset}
          limit={limit}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          dispatch={dispatch}
        />
      </div>

      <AddProducts isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}

export default Products;
