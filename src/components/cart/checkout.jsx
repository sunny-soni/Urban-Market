import React, { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  FaTimes,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaUser,
  FaArrowLeft,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import { createOrder } from "../../redux/features/orders/orderSlice";
import api from "../../api/axios";
import confetti from "canvas-confetti";

const schema = yup.object({
  full_name: yup
    .string()
    .trim()
    .min(3, "Too short")
    .required("Full name is required"),
  address: yup.string().required("Delivery address is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]+$/, "Digits only")
    .min(10, "10 digits min")
    .required("Required"),
  mode_of_payment: yup
    .string()
    .oneOf(["COD", "Card"], "Select a method")
    .required(),
});

/* --- Main Checkout Component --- */
const Checkout = ({ isOpen, setIsOpen, totalAmount }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Success
  const [placedOrderId, setPlacedOrderId] = useState(null);

  const {
    register,
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { mode_of_payment: "COD" },
  });

  const selectedMode = useWatch({ control, name: "mode_of_payment" });

  if (!isOpen) return null;

  const finalizeOrder = async (formData, paymentId = "COD") => {
    const finalData = {
      ...formData,
      userId: user?.userId,
      totalAmount,
      paymentId,
    };

    const response = await dispatch(createOrder(finalData));

    if (response.payload) {
      setPlacedOrderId(response.payload.id);

      // Fire Confetti with high z-index
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4f46e5", "#818cf8", "#ffffff"],
        zIndex: 9999,
      });

      setStep(3);
    }
  };

  const onShippingSubmit = (data) => {
    if (data.mode_of_payment === "Card") setStep(2);
    else finalizeOrder(data);
  };

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={() => setIsOpen(false)}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Step 3: Success View */}
        {step === 3 ? (
          <div className="text-center py-6 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-4xl text-green-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
              Success!
            </h2>
            <p className="text-slate-500 text-sm font-medium mb-8 px-4">
              Order{" "}
              <span className="text-indigo-600 font-bold">
                #{placedOrderId}
              </span>{" "}
              is being processed.
            </p>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/my-orders");
              }}
              className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 transition-all"
            >
              Track Order
            </button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => (step === 2 ? setStep(1) : setIsOpen(false))}
                className="text-slate-400 hover:text-indigo-600 transition-colors"
              >
                <FaArrowLeft size={16} />
              </button>
              <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tighter">
                {step === 1 ? "Shipping" : "Payment"}
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Step 1: Shipping Form */}
            {step === 1 && (
              <form
                onSubmit={handleSubmit(onShippingSubmit)}
                className="space-y-5"
              >
                <div className="space-y-4">
                  <div className="relative">
                    <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      {...register("full_name")}
                      placeholder="Full Name"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    />
                  </div>
                  <div className="relative">
                    <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-300" />
                    <textarea
                      {...register("address")}
                      placeholder="Address"
                      rows="2"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm resize-none"
                    />
                  </div>
                  <div className="relative">
                    <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                    <input
                      {...register("mobile")}
                      placeholder="Mobile Number"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  {["COD", "Card"].map((m) => (
                    <label
                      key={m}
                      className="flex-1 text-center py-3 border dark:border-slate-800 rounded-2xl cursor-pointer font-black uppercase text-[10px] tracking-widest has-[:checked]:bg-indigo-600 has-[:checked]:text-white transition-all text-slate-400"
                    >
                      <input
                        type="radio"
                        value={m}
                        {...register("mode_of_payment")}
                        className="sr-only"
                      />
                      {m === "COD" ? "Cash" : "Razorpay"}
                    </label>
                  ))}
                </div>
                {errors.mode_of_payment && (
                  <p className="text-red-500 text-[10px] text-center font-bold uppercase">
                    {errors.mode_of_payment.message}
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-100 mt-4"
                >
                  {selectedMode === "Card" ? "Next Step" : "Place Order"}
                </button>
              </form>
            )}

            {/* Step 2: Razorpay Payment */}
            {step === 2 && (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                <button
                  onClick={async () => {
                    try {
                      const { data } = await api.post(
                        "/api/payments/create-order",
                        {
                          amount: totalAmount,
                        },
                      );

                      const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        amount: data.amount,
                        currency: data.currency,
                        order_id: data.orderId,

                        handler: async function (response) {
                          await api.post(
                            "/api/payments/verify-payment",
                            response,
                          );
                          finalizeOrder(
                            getValues(),
                            response.razorpay_payment_id,
                          );
                        },

                        prefill: {
                          name: getValues("full_name"),
                          contact: getValues("mobile"),
                        },

                        theme: {
                          color: "#4f46e5",
                        },
                      };

                      const rzp = new window.Razorpay(options);
                      rzp.open();
                    } catch (err) {
                      console.error("Payment error:", err);
                    }
                  }}
                  className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl"
                >
                  Pay ₹{totalAmount}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Checkout;
