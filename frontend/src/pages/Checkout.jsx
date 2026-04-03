import { useContext, useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import CartContext from "../context/CartContext";
import { API } from "../pages/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function Checkout() {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [loading, setLoading] = useState(false);

  // ----------------------------------
  // LOAD ADDRESS BOOK
  // ----------------------------------
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        const res = await API.get("/address");
        setAddresses(res.data || []);
        const def = res.data?.find((a) => a.isDefault);
        if (def) setSelectedAddress(def);
      } catch (err) {
        console.error("Load address error:", err.message);
        toast.error("Failed to load addresses");
      } finally {
        setLoadingAddresses(false);
      }
    };
    loadAddresses();
  }, []);

  // Redirect if cart empty
  useEffect(() => {
    if (cart.length === 0) navigate("/");
  }, [cart, navigate]);

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  // ----------------------------------
  // RAZORPAY PAYMENT FLOW
  // ----------------------------------
  const handlePaymentAndPlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a delivery address");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const { data: orderData } = await API.post("/payment/order", {
        amount: total,
      });

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_RtAEhhoLIQ49vG",
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Kushalzz Marketplace",
        description: "Boutique Luxury Purchase",
        order_id: orderData.id,
        handler: async (response) => {
          try {
            // 3. Verify Payment on Backend
            await API.post("/payment/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              shippingAddress: selectedAddress,
              items: cart,
              totalAmount: total
            });

            clearCart();
            toast.success("Order Placed Successfully! 🥂");
            navigate("/order-success");
          } catch (err) {
            toast.error("Payment Verification Failed.");
          }
        },
        prefill: {
          name: selectedAddress.fullName,
          contact: selectedAddress.phone
        },
        theme: { color: "#000000" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Order error:", err);
      toast.error("Failed to initialize boutique checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="max-w-7xl px-6 py-10 md:py-16 mx-auto">
        <h1 className="mb-8 md:mb-12 text-3xl md:text-5xl font-light text-slate-900 tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Checkout</h1>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-12">
            <section className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-4 mb-6 md:mb-8">
                <span className="w-8 h-8 rounded-full bg-[#C9A84C] flex items-center justify-center text-[10px] font-bold text-white uppercase">01</span>
                <h2 className="text-xl md:text-2xl font-normal text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Delivery Destination</h2>
              </div>

              {loadingAddresses ? (
                <div className="py-10 text-center">
                  <div className="animate-spin w-6 h-6 border-2 border-[#C9A84C] border-t-transparent rounded-full mx-auto" />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr._id}
                      onClick={() => setSelectedAddress(addr)}
                      className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-500 relative ${
                        selectedAddress?._id === addr._id
                          ? "border-[#C9A84C] bg-[#C9A84C]/5"
                          : "border-gray-100 hover:border-[#C9A84C]/40 bg-gray-50/30"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                         <p className="font-bold text-sm tracking-tight text-slate-800 uppercase">{addr.fullName}</p>
                         {addr.isDefault && <span className="text-[8px] font-bold bg-white px-2 py-1 rounded-full border border-gray-100 text-gray-400 uppercase">Default</span>}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed font-medium">
                        {addr.street}, {addr.city}<br />
                        {addr.state} — {addr.pincode}<br />
                        M: {addr.phone}
                      </p>
                      {selectedAddress?._id === addr._id && (
                        <div className="absolute top-4 right-4 text-[#C9A84C]">
                          <div className="w-2 h-2 rounded-full bg-[#C9A84C] animate-pulse" />
                        </div>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => navigate("/add-address")}
                    className="p-6 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#C9A84C] hover:border-[#C9A84C] transition-all"
                  >
                    <span className="text-xl">+</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest">Add New Address</span>
                  </button>
                </div>
              )}
            </section>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white rounded-2xl p-8 shadow-sm border border-gray-50">
              <h2 className="mb-6 text-xl md:text-2xl font-normal text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>Order Summary</h2>

              <div className="space-y-6 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={item._id} className="flex items-center gap-5 group">
                    <div className="relative overflow-hidden w-16 h-16 rounded-2xl border border-gray-100 bg-gray-50">
                      <img src={item.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-1">
                       <p className="font-bold text-[11px] text-slate-800 uppercase tracking-tight line-clamp-1">{item.name}</p>
                       <p className="text-[10px] text-[#C9A84C] font-bold mt-1 uppercase tracking-widest">{item.quantity} × ₹{item.price}</p>
                    </div>
                    <span className="text-xs font-bold text-slate-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex justify-between items-end">
                   <div>
                     <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Total Treasures</p>
                     <span className="text-3xl font-normal text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>₹{total}</span>
                   </div>
                   <div className="text-right text-xs font-bold text-green-500 uppercase">Complementary Shipping</div>
                </div>

                <button
                  onClick={handlePaymentAndPlaceOrder}
                  disabled={loading}
                  className="w-full mt-10 py-5 text-white bg-slate-900 rounded-2xl cursor-pointer hover:bg-black font-bold uppercase tracking-[0.2em] text-[10px] transition-all disabled:opacity-50 relative overflow-hidden group shadow-2xl"
                >
                   <div className="absolute inset-0 bg-gradient-to-r from-[#C9A84C]/0 via-[#C9A84C]/20 to-[#C9A84C]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                   {loading ? "Initializing..." : `Pay Securely ₹${total}`}
                </button>

                <Link to="/cart" className="block mt-6 text-[10px] font-bold text-center text-gray-400 uppercase tracking-widest hover:text-[#C9A84C]">
                  ← Modify Selection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #f1f1f1; border-radius: 10px; }
      `}</style>
    </div>
  );
}
