import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../redux/features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingBag, FaUserPlus, FaLock, FaArrowLeft } from "react-icons/fa";

const schema = yup.object({
  username: yup.string().required("Username is required").min(3, "At least 3 characters"),
  password: yup.string().required("Password is required").min(6, "At least 6 characters"),
});

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = (data) => {
    dispatch(registerUser(data))
    navigate("/app");
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/app/products");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-600 rounded-2xl rotate-3 shadow-lg shadow-indigo-200 dark:shadow-none mb-4">
            <FaShoppingBag className="text-white text-3xl -rotate-3" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Join Urban<span className="text-indigo-600">Market</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Create your account to start shopping.</p>
        </div>

        {/* Register Card */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Username */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Username
              </label>
              <div className="relative">
                <FaUserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  {...register("username")}
                  placeholder="Choose a unique username"
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none bg-white dark:bg-slate-800 dark:text-white ${
                    errors.username 
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20" 
                      : "border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.username.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  placeholder="Create a strong password"
                  {...register("password")}
                  className={`w-full pl-11 pr-4 py-3 rounded-xl border transition-all outline-none bg-white dark:bg-slate-800 dark:text-white ${
                    errors.password 
                      ? "border-red-400 ring-4 ring-red-50 dark:ring-red-900/20" 
                      : "border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-indigo-50 dark:focus:ring-indigo-900/20 focus:border-indigo-500"
                  }`}
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-2 ml-1 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* Back to Login */}
          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full flex items-center justify-center gap-2 text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
            >
              <FaArrowLeft className="text-xs" />
              <span>Back to Sign In</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-8 px-6">
          By registering, you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
};

export default Register;