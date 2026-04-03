import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { API } from "../pages/api.jsx";
import CartContext from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import { FaShoppingCart, FaHeart, FaChevronRight, FaStar, FaShieldAlt, FaTruck, FaUndo } from "react-icons/fa";
import toast from "react-hot-toast";

export default function ProductDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useContext(CartContext);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.log(err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Sign in to curate your selection", {
        icon: '🔒',
        style: { borderRadius: '12px', background: '#111', color: '#fff' }
      });
      navigate("/login");
      return;
    }

    addItem({ ...product, quantity });
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = () => {
    if (!product) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in to save your wishlist", {
        icon: '✨'
      });
      navigate("/login");
      return;
    }

    toggleWishlist(product._id);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h2 className="text-2xl font-medium text-gray-400">Product not found</h2>
        <Link to="/" className="text-[#C9A84C] hover:underline uppercase tracking-widest text-sm">Return Home</Link>
      </div>
    );
  }

  const isFavorite = isInWishlist(product._id);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <FaChevronRight size={8} className="opacity-50" />
          <Link to={`/category/${product.category}`} className="hover:text-[#C9A84C] transition-colors">{product.category}</Link>
          <FaChevronRight size={8} className="opacity-50" />
          <span className="text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-start">
          
          {/* IMAGE SECTION */}
          <div className="lg:col-span-7 group">
            <div className="relative aspect-[1/1] sm:aspect-[4/5] overflow-hidden rounded-2xl md:rounded-3xl bg-gray-50 shadow-2xl shadow-black/5 border border-gray-100">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <button 
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 md:top-6 md:right-6 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl z-20 ${
                  isFavorite ? "bg-[#C9A84C] scale-110 shadow-[#C9A84C]/40" : "bg-white/80 backdrop-blur-md scale-100 hover:scale-110"
                }`}
              >
                <FaHeart 
                  size={isFavorite ? 18 : 16} 
                  className="transition-all duration-500 md:w-6 md:h-6"
                  fill={isFavorite ? "white" : "#94a3b8"} 
                  stroke={isFavorite ? "white" : "#94a3b8"}
                  strokeWidth={isFavorite ? 0 : 2.5} 
                />
              </button>
            </div>
          </div>

          {/* DETAILS SECTION */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex text-[#C9A84C] gap-0.5">
                  {[...Array(5)].map((_, i) => <FaStar key={i} size={12} fill={i < 4 ? "currentColor" : "none"} stroke="currentColor" />)}
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">(4.8 / 112 Reviews)</span>
              </div>

              <h1 className="text-3xl md:text-5xl leading-tight text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
                {product.name}
              </h1>
              
              <p className="text-[11px] font-bold text-[#C9A84C] uppercase tracking-[0.4em]">
                {product.brand || "Kushalzz Marketplace Elite Selection"}
              </p>

              <div className="flex items-baseline gap-4 mt-6 md:mt-8">
                <span className="text-3xl md:text-4xl font-light text-slate-900" style={{ fontFamily: "'Jost', sans-serif" }}>₹{product.price}</span>
                <span className="text-base md:text-lg text-gray-300 line-through">₹{Math.round(product.price * 1.2)}</span>
                <span className="text-[10px] md:text-xs font-bold text-green-500 bg-green-50 px-2 md:px-2.5 py-1 rounded-full uppercase tracking-tighter">Save 20%</span>
              </div>

              <div className="h-[1px] w-full bg-gray-100 my-6 md:my-10" />

              <p className="text-slate-600 leading-relaxed text-sm font-light tracking-wide lg:max-w-md" style={{ fontFamily: "'Jost', sans-serif" }}>
                {product.description || "Experience unparalleled style with this masterfully crafted piece. Designed for a perfect fit and ultimate comfort, using only the finest materials for a truly premium aesthetic."}
              </p>

              <div className="space-y-8 mt-12">
                {/* Quantity & Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                  <div className="flex items-center justify-between border border-gray-200 rounded-full px-6 py-4 sm:w-40 bg-gray-50/50">
                    <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="text-slate-400 hover:text-slate-900 transition-colors">
                      <span className="text-xl">−</span>
                    </button>
                    <span className="font-bold text-slate-900 text-lg">{quantity}</span>
                    <button onClick={() => setQuantity(quantity + 1)} className="text-slate-400 hover:text-slate-900 transition-colors">
                      <span className="text-xl">+</span>
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-slate-900 text-white rounded-full py-4 md:py-5 px-8 md:px-10 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] transition-all duration-500 hover:bg-black hover:shadow-2xl hover:shadow-[#C9A84C]/10 flex items-center justify-center gap-3 md:gap-4 group"
                  >
                    <FaShoppingCart className="text-xs md:text-sm group-hover:scale-110 transition-transform group-hover:text-[#C9A84C]" />
                    Add to Collection
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-gray-50">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#C9A84C]">
                      <FaShieldAlt />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">100% Authentic</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#C9A84C]">
                      <FaTruck />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Global Express</p>
                  </div>
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-[#C9A84C]">
                      <FaUndo />
                    </div>
                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Luxury Support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
