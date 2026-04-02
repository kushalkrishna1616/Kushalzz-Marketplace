import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { API } from "../pages/api.jsx";
import ProductCard from "../components/ProductCard";
import { FaChevronRight } from "react-icons/fa";

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const formattedName = slug
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const categoryInfo = {
    menswear: {
      title: "Men's Luxury Wear",
      description: "Discover precision tailoring and modern essentials for the discerning man.",
      banner: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=1600&q=80",
    },
    womenswear: {
      title: "Women's Designer Collection",
      description: "Elegant silhouettes and contemporary pieces curated for every occasion.",
      banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    },
    kids: {
      title: "Premium Kids' Style",
      description: "Durable, comfortable, and stylish apparel for the next generation.",
      banner: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=1600&q=80",
    },
    activewear: {
      title: "High-Performance Athletics",
      description: "Elite sportswear designed to move with you and empower your hustle.",
      banner: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&q=80",
    },
    footwear: {
      title: "The Sole Collection",
      description: "From iconic sneakers to artisanal leather boots, step into luxury.",
      banner: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=1600&q=80",
    },
    accessories: {
      title: "Curated Accessories",
      description: "The essential final touches, from heritage watches to designer leather goods.",
      banner: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=1600&q=80",
    },
    "winter-wear": {
      title: "The Winter Edit",
      description: "Masterful layering and premium insulation for the colder seasons.",
      banner: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80",
    },
    "formal-attire": {
      title: "The Black Tie Selection",
      description: "Exquisite tailoring and formal silhouettes for your most significant moments.",
      banner: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80",
    },
    designer: {
      title: "Global Clothing Brands",
      description: "Exclusive apparel and iconic pieces from the world's most prestigious clothing labels.",
      banner: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=1600&q=80",
    },
    streetwear: {
      title: "Urban Street Culture",
      description: "Contemporary urban wear that defines the pulse of the city.",
      banner: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80",
    },
    vintage: {
      title: "The Heritage Archive",
      description: "Timeless vintage pieces with a story to tell.",
      banner: "https://images.unsplash.com/photo-1445205170230-053b830c6050?w=1600&q=80",
    },
  };

  const brands = ["nike", "puma", "zara", "h&m", "adidas", "tijc", "levis"];
  const isBrand = brands.includes(slug.toLowerCase());

  const info = isBrand ? {
    title: slug.toUpperCase() + " Collection",
    description: `Exploring the ultimate premium luxury from ${slug.toUpperCase()}.`,
    banner: null
  } : categoryInfo[slug] || {
    title: formattedName,
    description: `Showing products for ${formattedName}`,
    banner: null,
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const endpoint = isBrand ? `/products?brand=${slug}` : `/products?category=${slug}`;
        const res = await API.get(endpoint);
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="w-12 h-12 border-4 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full animate-spin"></div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em]">Curating for you...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.2em] text-gray-400">
          <Link to="/" className="hover:text-[#FBCFE8] transition-colors">Home</Link>
          <FaChevronRight size={8} className="opacity-50" />
          <span className="text-gray-900">{info.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 md:py-20">
        {/* Banner or GIFs */}
        {info.gifs ? (
          <div className="grid grid-cols-1 gap-6 md:gap-10 mb-12 md:mb-24 md:grid-cols-3">
            {info.gifs.map((g, i) => (
              <div key={i} className="relative aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-black/5 border border-gray-100 group">
                <img src={g} alt={`${info.title} ${i + 1}`} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-[2s]" />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/20 to-transparent h-24" />
              </div>
            ))}
          </div>
        ) : (
          info.banner && (
            <div className="relative h-[250px] md:h-[480px] mb-12 md:mb-24 overflow-hidden rounded-[1.5rem] md:rounded-[3rem] shadow-2xl shadow-black/5 border border-gray-100 group">
              <img src={info.banner} alt={info.title} className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-[4s]" />
              <div className="absolute inset-0 bg-black/10 transition-opacity group-hover:opacity-0" />
            </div>
          )
        )}

        {/* Title Section */}
        <div className="mb-12 md:mb-20 space-y-4 md:space-y-6">
          <div className="flex items-center gap-4">
             <div className="h-px w-12 bg-[#FBCFE8]" />
             <p className="text-[10px] font-bold text-[#C9A84C] uppercase tracking-[0.4em]">Curated Collection</p>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl text-slate-900" style={{ fontFamily: "'Playfair Display', serif" }}>
            {info.title}
          </h1>
          <p className="text-gray-400 text-sm font-light tracking-wide lg:max-w-xl italic">
            {info.description}
          </p>
        </div>

        {/* Product Grid */}
        {products.length === 0 ? (
          <div className="text-center py-32 space-y-8 bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
            <div className="text-gray-300 flex justify-center">
               <FaChevronRight size={40} className="rotate-90 opacity-20" />
            </div>
            <p className="text-gray-400 text-lg font-light italic">Our curators are currently selecting new treasures for this collection.</p>
            <Link to="/" className="inline-block px-12 py-5 bg-black text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all hover:bg-[#C9A84C] shadow-2xl">Return to Gallery</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-10 gap-y-12 md:gap-y-20">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
