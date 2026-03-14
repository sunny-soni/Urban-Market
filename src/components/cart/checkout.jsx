import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm, useWatch } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { createOrder } from "../../redux/features/orders/orderSlice";
import { FaTimes, FaMapMarkerAlt, FaPhoneAlt, FaUser, FaWallet, FaArrowLeft, FaCreditCard, FaQrcode } from "react-icons/fa";
import { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";

const schema = yup.object({
  full_name: yup.string().trim().min(3, "Too short").required("Full name is required"),
  address: yup.string().required("Delivery address is required"),
  mobile: yup
    .string()
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(10, "Minimum 10 digits")
    .required("Mobile number is required"),
  mode_of_payment: yup.string().oneOf(["COD", "Card"], "Select a payment method").required(),
});

const Checkout = ({ isOpen, setIsOpen, totalAmount }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth);
  const [showPaymentSelection, setShowPaymentSelection] = useState(false);
  const [onlineMethod, setOnlineMethod] = useState("razorpay"); // 'razorpay' or 'upi'

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { mode_of_payment: "COD" }
  });

  // Watch the payment mode to change button text dynamically
  const selectedMode = useWatch({ control, name: "mode_of_payment" });

  if (!isOpen) return null;

  const handleRazorpay = (formData) => {
    const options = {
      key: "YOUR_RAZORPAY_KEY", // Enter your key here
      amount: totalAmount * 100,
      currency: "INR",
      name: "UrbanMarket",
      description: "Order Payment",
      handler: function (response) {
        finalizeOrder({ ...formData, paymentId: response.razorpay_payment_id });
      },
      prefill: { name: formData.full_name, contact: formData.mobile },
      theme: { color: "#4f46e5" },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const finalizeOrder = (data) => {
    const finalData = {
      ...data,
      userId: user?.userId,
      totalAmount: totalAmount,
    };
    dispatch(createOrder(finalData));
    setIsOpen(false);
    setShowPaymentSelection(false);
  };

  const onSubmit = (data) => {
    if (data.mode_of_payment === "Card") {
      setShowPaymentSelection(true);
    } else {
      finalizeOrder(data);
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center z-[100] p-4"
      onClick={() => setIsOpen(false)}
    >
      <div 
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 dark:border-slate-800 transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <button 
            onClick={() => showPaymentSelection ? setShowPaymentSelection(false) : setIsOpen(false)}
            className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
          >
            <FaArrowLeft size={16} />
          </button>
          <div className="text-center">
            <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">
              {showPaymentSelection ? "Payment Method" : "Checkout"}
            </h2>
          </div>
          <button onClick={() => setIsOpen(false)} className="p-2 -mr-2 text-slate-400"><FaTimes size={18} /></button>
        </div>

        {!showPaymentSelection ? (
          /* SECTION 1: SHIPPING DETAILS FORM */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Full Name</label>
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input {...register("full_name")} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
              {errors.full_name && <p className="text-red-500 text-[9px] font-bold mt-1 ml-1">{errors.full_name.message}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Shipping Address</label>
              <div className="relative">
                <FaMapMarkerAlt className="absolute left-4 top-4 text-slate-300" />
                <textarea {...register("address")} rows="2" className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none" />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2 ml-1">Mobile</label>
              <div className="relative">
                <FaPhoneAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                <input {...register("mobile")} className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500/20" />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 ml-1">Order Type</label>
              <div className="grid grid-cols-2 gap-3">
                {['COD', 'Card'].map((mode) => (
                  <label key={mode} className="relative flex items-center justify-center p-3 border dark:border-slate-800 rounded-xl cursor-pointer has-[:checked]:bg-indigo-600 has-[:checked]:text-white transition-all text-slate-500 font-bold text-xs">
                    <input type="radio" value={mode} {...register("mode_of_payment")} className="sr-only" />
                    {mode === 'COD' ? 'Cash' : 'Online'}
                  </label>
                ))}
              </div>
            </div>

            <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-indigo-100 mt-4 active:scale-95 transition-all">
              {selectedMode === "Card" ? "Continue to Payment" : "Place Order"}
            </button>
          </form>
        ) : (
          /* SECTION 2: DUAL PAYMENT SELECTION (ONLINE ONLY) */
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
              <button onClick={() => setOnlineMethod("razorpay")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${onlineMethod === "razorpay" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>
                <FaCreditCard /> Card/Net
              </button>
              <button onClick={() => setOnlineMethod("upi")} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${onlineMethod === "upi" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-400"}`}>
                <FaQrcode /> UPI QR
              </button>
            </div>

            {onlineMethod === "razorpay" ? (
              <div className="text-center py-4">
                <p className="text-sm text-slate-500 mb-8 font-medium">Safe & Secure payments via Razorpay</p>
                <button onClick={handleSubmit(handleRazorpay)} className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest active:scale-95 transition-all">
                  Pay ₹{totalAmount}
                </button>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-white p-4 inline-block rounded-3xl shadow-inner mb-6 border-4 border-slate-50">
                  <QRCodeCanvas value={`upi://pay?pa=yourname@upi&pn=UrbanMarket&am=${totalAmount}&cu=INR`} size={160} />
                </div>
                <button onClick={handleSubmit((data) => finalizeOrder({...data, paymentId: 'UPI_SCAN'}))} className="w-full py-4 border-2 border-indigo-600 text-indigo-600 rounded-2xl font-black uppercase text-xs tracking-widest">
                  Paid? Complete Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;