"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, MapPin, User, Mail, Phone, CreditCard, Banknote, Loader2, CheckCircle2 } from "lucide-react";
import { LeoMartLogo } from "../(auth)/_components/type/AuthComponent";
import { useAuth } from "@/lib/context/AuthContext";
import { initiateKhaltiAction } from "@/lib/actions/payment-action";
import { createCodOrderAction } from "@/lib/actions/order-action";

interface CartItem {
  product: any;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Cart state loaded from localStorage
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Form Fields
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Shipping Address Fields
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("Kathmandu");
  const [district, setDistrict] = useState("Kathmandu");
  const [landmark, setLandmark] = useState("");
  const [postalCode, setPostalCode] = useState("");

  // Payment Method State: "Cash on Delivery" | "Khalti"
  const [paymentMethod, setPaymentMethod] = useState<"Cash on Delivery" | "Khalti">("Cash on Delivery");

  // UI / Error / Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    // Load cart items from localStorage
    try {
      const savedCart = localStorage.getItem("leo_mart_cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
    } catch (e) {
      console.error("Error reading cart from localStorage:", e);
    }
    setIsLoaded(true);
  }, []);

  // Autofill user details if logged in
  useEffect(() => {
    if (user) {
      if (user.fullname && !fullname) setFullname(user.fullname);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryCharge = cart.length > 0 ? 100 : 0;
  const totalAmount = subtotal + deliveryCharge;

  const validateForm = () => {
    setErrorMsg("");

    if (cart.length === 0) {
      setErrorMsg("Your cart is empty. Please add products before checking out.");
      return false;
    }
    if (!fullname.trim()) {
      setErrorMsg("Full name is required.");
      return false;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Valid email address is required.");
      return false;
    }
    if (!phone.trim() || phone.trim().length < 7) {
      setErrorMsg("Valid contact phone number is required.");
      return false;
    }
    if (!street.trim()) {
      setErrorMsg("Street address (house no / street name) is required.");
      return false;
    }
    if (!city.trim()) {
      setErrorMsg("City is required.");
      return false;
    }
    if (!district.trim()) {
      setErrorMsg("District is required.");
      return false;
    }

    return true;
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setErrorMsg("");

    const customerInfo = { fullname, email, phone };
    const shippingAddress = { street, city, district, landmark, postalCode };
    const itemsPayload = cart.map((i) => ({
      productId: i.product._id,
      quantity: i.quantity,
    }));

    try {
      if (paymentMethod === "Cash on Delivery") {
        // --- CASH ON DELIVERY FLOW ---
        const res = await createCodOrderAction({
          customerInfo,
          shippingAddress,
          items: itemsPayload,
        });

        if (res.success && res.order) {
          // Clear cart
          localStorage.removeItem("leo_mart_cart");
          router.push(`/order-success?orderId=${res.order._id}`);
        } else {
          setErrorMsg(res.message || "Failed to place Cash on Delivery order.");
          setIsProcessing(false);
        }
      } else {
        // --- KHALTI PAYMENT FLOW ---
        const res = await initiateKhaltiAction({
          customerInfo,
          shippingAddress,
          items: itemsPayload,
        });

        if (res.success && res.payment_url) {
          // Save temporary user address details to localStorage for reference
          localStorage.setItem(
            "leo_mart_last_checkout",
            JSON.stringify({ customerInfo, shippingAddress })
          );

          // Immediately redirect to Khalti official payment gateway
          window.location.href = res.payment_url;
        } else {
          setErrorMsg(res.message || "Khalti payment initiation failed. Please try again.");
          setIsProcessing(false);
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred during checkout.");
      setIsProcessing(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFC] text-black font-sans flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-purple-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm shadow-purple-500/5">
        <div className="flex items-center gap-6">
          <Link href="/">
            <LeoMartLogo size={28} />
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-purple-600 font-semibold text-sm">Checkout</span>
        </div>
        <Link
          href="/groceries"
          className="flex items-center gap-1.5 text-xs text-purple-600 hover:text-purple-800 font-bold transition"
        >
          <ArrowLeft size={16} />
          Return to Store
        </Link>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 md:px-12 py-10">
        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Customer Details, Address, Payment Methods */}
          <div className="lg:col-span-7 space-y-8">
            
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-2xl font-semibold text-center animate-in fade-in duration-200">
                {errorMsg}
              </div>
            )}

            {/* 1. Customer Information */}
            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-5">
              <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
                <User className="text-purple-600" size={20} />
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Customer Details</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    placeholder="e.g. Ram Bahadur Thapa"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ram@example.com"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address Option */}
            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-5">
              <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
                <MapPin className="text-purple-600" size={20} />
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Shipping Address</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col space-y-1 sm:col-span-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Street Address / House No.</label>
                  <input
                    type="text"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    placeholder="e.g. Lazimpat Marg, House #45"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Kathmandu"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">District / State</label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    placeholder="Kathmandu"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Landmark (Optional)</label>
                  <input
                    type="text"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    placeholder="e.g. Near Standard Chartered Bank"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>

                <div className="flex flex-col space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Postal Code (Optional)</label>
                  <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="44600"
                    className="w-full border border-purple-100/80 bg-purple-50/10 px-4 py-2.5 rounded-xl text-xs text-black outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Options */}
            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-5">
              <div className="flex items-center gap-2 border-b border-purple-50 pb-3">
                <CreditCard className="text-purple-600" size={20} />
                <h2 className="text-base font-bold text-gray-900 tracking-tight">Payment Method</h2>
              </div>

              <div className="space-y-3">
                {/* Radio Option 1: Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod("Cash on Delivery")}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === "Cash on Delivery"
                      ? "border-purple-600 bg-purple-50/30 shadow-md shadow-purple-500/5"
                      : "border-purple-100/80 bg-white hover:bg-purple-50/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "Cash on Delivery"}
                      onChange={() => setPaymentMethod("Cash on Delivery")}
                      className="accent-purple-600 h-4 w-4"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-100/80 text-purple-700 rounded-xl">
                        <Banknote size={20} />
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block">Cash on Delivery</span>
                        <span className="text-[10px] text-gray-400 block">Pay with cash when your groceries arrive</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "Cash on Delivery" && (
                    <CheckCircle2 className="text-purple-600" size={20} />
                  )}
                </label>

                {/* Radio Option 2: Khalti Payment */}
                <label
                  onClick={() => setPaymentMethod("Khalti")}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition cursor-pointer ${
                    paymentMethod === "Khalti"
                      ? "border-purple-600 bg-purple-50/30 shadow-md shadow-purple-500/5"
                      : "border-purple-100/80 bg-white hover:bg-purple-50/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      checked={paymentMethod === "Khalti"}
                      onChange={() => setPaymentMethod("Khalti")}
                      className="accent-purple-600 h-4 w-4"
                    />
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-purple-600 text-white rounded-xl font-bold text-xs">
                        KHALTI
                      </div>
                      <div>
                        <span className="font-bold text-sm text-gray-900 block flex items-center gap-1.5">
                          Khalti Online Payment
                          <span className="bg-purple-100 text-purple-700 text-[9px] font-extrabold px-2 py-0.5 rounded-full">
                            Instant ePayment v2
                          </span>
                        </span>
                        <span className="text-[10px] text-gray-400 block">Pay securely via Khalti Wallet / Mobile Banking</span>
                      </div>
                    </div>
                  </div>
                  {paymentMethod === "Khalti" && (
                    <CheckCircle2 className="text-purple-600" size={20} />
                  )}
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-purple-100/80 rounded-3xl p-6 md:p-8 shadow-xl shadow-purple-500/5 space-y-6 sticky top-24">
              <div className="flex items-center justify-between border-b border-purple-50 pb-4">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="text-purple-600" size={20} />
                  <h2 className="text-base font-bold text-gray-900 tracking-tight">Order Summary</h2>
                </div>
                <span className="text-xs text-gray-400 font-semibold">{cart.length} Items</span>
              </div>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1 divide-y divide-purple-50">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.product._id} className="pt-3 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl border border-purple-50 bg-purple-50/10 overflow-hidden shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-gray-800 truncate">{item.product.name}</h4>
                        <span className="text-[10px] text-gray-400">
                          Qty: {item.quantity} × Rs. {item.product.price.toLocaleString()}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-purple-700 shrink-0">
                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">No items in cart</p>
                )}
              </div>

              {/* Pricing Totals */}
              <div className="border-t border-purple-50 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-800">Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Charge</span>
                  <span className="font-semibold text-gray-800">Rs. {deliveryCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-purple-700 pt-2 border-t border-purple-50">
                  <span>Grand Total</span>
                  <span>Rs. {totalAmount.toLocaleString()}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing || cart.length === 0}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-3.5 rounded-2xl text-sm shadow-lg shadow-purple-500/15 active:scale-95 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Processing Payment...</span>
                  </>
                ) : paymentMethod === "Khalti" ? (
                  <span>Pay with Khalti</span>
                ) : (
                  <span>Place Order</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400">
                <ShieldCheck size={14} className="text-purple-600" />
                <span>SSL Encrypted & Guaranteed Safe Checkout</span>
              </div>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}
