import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { API } from "../pages/api";

import "swiper/css/pagination";
import "swiper/css/navigation";

import { FaArrowRight, FaMagic } from "react-icons/fa";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await API.get("/products");
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  

  return (
    <div className="w-full">

      {/* ================= HERO ================= */}
      <div className="px-6 pt-6 md:pt-10 mx-auto max-w-7xl">
        {/* Admin Quick Link */}
        {localStorage.getItem("role") === "admin" && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-8"
          >
            <Link 
              to="/admin" 
              className="group inline-flex items-center gap-4 bg-slate-900 shadow-2xl shadow-slate-200 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-[1.02]"
            >
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <div className="flex flex-col items-start translate-y-[-1px]">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#C9A84C] mb-0.5">Management Portal</span>
                <span className="text-sm font-medium tracking-wide" style={{ fontFamily: "'Jost', sans-serif" }}>Admin Dashboard</span>
              </div>
            </Link>
          </motion.div>
        )}

        <div className="overflow-hidden rounded-[2rem] md:rounded-[3rem] shadow-2xl shadow-black/5 relative h-[420px] md:h-[580px] w-full" style={{ willChange: "transform" }}>
          <video
            src="/videos/intro.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 object-cover w-full h-full"
            style={{ willChange: "transform" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
          
          <div className="absolute left-6 md:left-16 bottom-12 md:bottom-16 max-w-2xl text-white">
             <div style={{ animation: "fadeInUp 0.8s ease-out forwards" }}>
               <p className="text-[9px] md:text-[10px] font-bold text-[#FBCFE8] uppercase tracking-[0.4em] mb-3 md:mb-4 opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                  The Future of Fashion
               </p>
               <h1 className="text-3xl md:text-7xl font-light leading-tight mb-8 opacity-0" style={{ fontFamily: "'Playfair Display', serif", animationDelay: "0.4s", animationFillMode: "forwards" }}>
                  Kushalzz <span className="italic block text-[#C9A84C]">Marketplace™</span>
               </h1>
               <div className="mt-2 opacity-0" style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}>
                  <Link to="/search" className="inline-block px-10 py-4 bg-white text-black text-[9px] md:text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#C9A84C] hover:text-white transition-all duration-500 shadow-xl">
                      Explore All Collections
                  </Link>
               </div>
             </div>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <div className="mt-10 md:mt-20 px-6 py-12 md:py-24 mx-auto max-w-7xl bg-gray-50/50 rounded-[2rem] md:rounded-[4rem] border border-gray-50 mb-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 px-4">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              Treasures of the Season
            </h2>
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Curated Selections with Exceptional Value</p>
          </div>
          <Link to="/category/designer" className="mt-6 md:mt-0 text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.3em] hover:text-slate-900 transition-colors border-b border-[#C9A84C] pb-1 w-fit">
            View All Curations
          </Link>
        </div>

        <div className="grid gap-6 md:gap-10 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 px-2 md:px-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>

      {/* ================= BRAND HIGHLIGHTS (VIDEO BANNERS) ================= */}
      <div className="px-6 py-12 md:py-24 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 px-4">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl lg:text-5xl text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
              The Cinematic Edit
            </h2>
            <p className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.4em]">Where Fashion Meets Motion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {[
            {
              brand: "PUMA",
              subtitle: "Power In Motion",
              video: "/videos/puma.mp4",
              tag: "Athletic Excellence"
            },
            {
              brand: "NIKE",
              subtitle: "Air Superiority",
              video: "/videos/nike.mp4",
              tag: "Global Icon"
            },
            {
              brand: "ZARA",
              subtitle: "Urban Minimalist",
              video: "/videos/zara.mp4",
              tag: "Chic Essentials"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="relative group h-[500px] md:h-[650px] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-2xl shadow-black/5"
            >
              <video
                src={item.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-[3s]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-12 text-center">
                 <p className="text-[9px] font-bold text-[#C9A84C] uppercase tracking-[0.4em] mb-4 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    {item.tag}
                 </p>
                 <h3 className="text-3xl md:text-4xl font-light text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                    {item.brand} <span className="italic block text-xl mt-2 opacity-80 text-[#FBCFE8]">{item.subtitle}</span>
                 </h3>
                 <Link 
                   to={`/search?q=${item.brand}`}
                   className="mt-8 px-10 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#C9A84C] hover:border-[#C9A84C] transition-all duration-500"
                 >
                    Explore Now
                 </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* FEATURED: PUMA X ONE8 SPECIAL EDIT */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        className="px-6 mb-20"
      >
        <div className="relative h-[400px] md:h-[600px] max-w-7xl mx-auto rounded-[3.5rem] overflow-hidden group shadow-2xl shadow-black/10">
          <video 
            src="/videos/pumaxop.mp4" 
            autoPlay loop muted playsInline 
            className="absolute inset-0 object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-[6s]" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          
          <div className="absolute left-10 md:left-24 top-1/2 -translate-y-1/2 max-w-xl">
             <motion.p 
               initial={{ x: -20, opacity: 0 }}
               whileInView={{ x: 0, opacity: 1 }}
               transition={{ delay: 0.5 }}
               className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.6em] mb-4"
             >
                Global Limited Edition
             </motion.p>
             <h2 className="text-4xl md:text-7xl font-light text-white mb-6 uppercase tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                PUMA <span className="italic block text-2xl md:text-3xl mt-2 text-[#C9A84C] font-normal tracking-wide">x ONE PIECE</span>
             </h2>
             <p className="text-sm font-light text-gray-300 mb-10 max-w-sm leading-relaxed" style={{ fontFamily: "'Jost', sans-serif" }}>
                The Suede Blackbeard Teech Edition. A legendary collaboration where the Grand Line meets the street.
             </p>
             <Link to="/search?q=one piece" className="px-10 py-4 bg-white text-black text-[10px] font-bold uppercase tracking-[0.3em] rounded-full hover:bg-[#C9A84C] hover:text-white transition-all duration-500">
                Explore The Drop
             </Link>
          </div>
        </div>
      </motion.div>

      <Footer />
    </div>
  );
}
