import React, { useEffect } from "react";
import {
  FaAngleLeft,
  FaAngleRight,
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
} from "react-icons/fa";

const Pagination = ({
  totalRows,
  limit,
  setOffset,
  currentPage,
  setCurrentPage,
  dispatch
}) => {
  const windowSize = 3;

  const totalPages = Math.ceil(totalRows / limit) || 1;
  const startIndex = totalRows === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endIndex = Math.min(currentPage * limit, totalRows);

  const startPage = Math.floor((currentPage - 1) / windowSize) * windowSize + 1;
  const pageWindow = Array.from(
    { length: windowSize },
    (_, i) => startPage + i,
  ).filter((page) => page <= totalPages);

  const handlePrev = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  useEffect(() => {
    dispatch(setOffset((currentPage - 1) * limit));
  }, [currentPage, limit, setOffset, dispatch]);

  // Shared icon style to keep code clean
  const iconBaseClass = "transition-all duration-200 text-lg ";
  const getIconClass = (disabled) => 
    disabled 
      ? "text-slate-200 dark:text-slate-700 cursor-not-allowed" 
      : "text-slate-600 dark:text-slate-400 cursor-pointer hover:text-indigo-600 dark:hover:text-indigo-400 hover:scale-120";

  return (
    <div className="flex flex-col items-center gap-4 p-6 transition-colors">
      {/* Showing X to Y of Z text */}
      <div className="text-sm text-slate-500 dark:text-slate-400">
        Showing{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{startIndex}</span> to{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{endIndex}</span> of{" "}
        <span className="font-bold text-slate-900 dark:text-slate-100">{totalRows}</span>{" "}
        items
      </div>

      {/* Control Bar */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 transition-all">
        
        {/* First Page */}
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(1)}
          className="focus:outline-none"
        >
          <FaAngleDoubleLeft className={iconBaseClass + getIconClass(currentPage === 1)} />
        </button>

        {/* Previous Page */}
        <button
          disabled={currentPage === 1}
          onClick={handlePrev}
          className="focus:outline-none"
        >
          <FaAngleLeft className={iconBaseClass + getIconClass(currentPage === 1)} />
        </button>

        {/* Page Numbers */}
        <div className="flex gap-2 mx-2">
          {pageWindow.map((item) => (
            <button
              key={item}
              onClick={() => setCurrentPage(item)}
              className={`w-10 h-10 rounded-xl font-bold transition-all duration-300 ${
                item === currentPage
                  ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/40 scale-110"
                  : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-indigo-600"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {/* Next Page */}
        <button
          disabled={currentPage === totalPages}
          onClick={handleNext}
          className="focus:outline-none"
        >
          <FaAngleRight className={iconBaseClass + getIconClass(currentPage === totalPages)} />
        </button>

        {/* Last Page */}
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className="focus:outline-none"
        >
          <FaAngleDoubleRight className={iconBaseClass + getIconClass(currentPage === totalPages)} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;