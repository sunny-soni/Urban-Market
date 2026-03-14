import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../../redux/features/products/productSlice";
import ProductCard from "../../../components/products/productCard";
import { FaSearch } from "react-icons/fa";
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
    setSearchTerm(e.target.value);
    setOffset(0);
    setCurrentPage(1);
  };

  return (
    <div className="p-4 min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="flex justify-end mb-4">
        <div className="relative w-full max-w-sm mr-4">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all"
            onChange={(e) => handleSearchChange(e)}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 px-2 py-2">
        {products?.length &&
          products?.map((item, index) => {
            return (
              <ProductCard
                key={item.id}
                id={item?.id}
                name={item?.name}
                price={item?.price}
                isWishlisted={item?.is_wishlisted}
              />
            );
          })}
      </div>

      <Pagination
        totalRows={totalRows}
        setOffset={setOffset}
        limit={limit}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dispatch={dispatch}
      />
    </div>
  );
}

export default Products;
