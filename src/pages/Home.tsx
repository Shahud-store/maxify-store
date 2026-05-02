import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import MegaMenu from '../components/home/MegaMenu';
import HeroSlider from '../components/home/HeroSlider';
import FlashSale from '../components/home/FlashSale';
import ProductCard from '../components/home/ProductCard';
import { MOCK_CATEGORIES, MOCK_FLASH_SALE } from '../data/mock';
import { Product } from '../types';

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        if (result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="pb-24">
      {/* Hero Section - Tighter Layout */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex h-[480px]">
          <div className="hidden lg:block">
            <MegaMenu categories={MOCK_CATEGORIES} />
          </div>
          <div className="flex-1 p-6">
            <HeroSlider />
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Flash Sale Module - Prominent Header */}
        <FlashSale products={MOCK_FLASH_SALE as any} />

        {/* Categories Quick Access Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg text-cobalt uppercase tracking-tight">Shop by Category</h2>
            <button className="text-xs font-bold text-cobalt underline">View All</button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3">
            {MOCK_CATEGORIES.map((cat) => (
              <motion.div 
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                className="bg-white p-4 rounded-xl flex flex-col items-center gap-2 shadow-sm border border-gray-100 cursor-pointer group"
              >
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center group-hover:bg-amber/10 transition-colors">
                  <div className="w-5 h-5 bg-gray-200 rounded group-hover:bg-amber transition-colors" />
                </div>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-cobalt text-center leading-tight">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Trending Section - Dynamically loaded from Supabase */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg text-cobalt uppercase tracking-tight">Imported Products</h2>
            <button className="text-xs font-bold text-cobalt underline">View All</button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-64 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl p-12 text-center">
                <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products imported yet</p>
             </div>
          )}
        </section>

        {/* Just For You - Dynamic Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-lg text-cobalt uppercase tracking-tight">Just For You</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
             {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-48 bg-gray-100 rounded-xl animate-pulse" />
              ))
            ) : products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* Vendor Banner - Theme Aesthetic */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-cobalt rounded-2xl p-10 text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative border border-white/5"
        >
          <div className="space-y-4 relative z-10 max-w-xl text-center md:text-left">
             <div className="inline-block bg-amber text-white text-tiny font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Limited Program</div>
            <h2 className="text-4xl font-display font-black leading-tight">
              Grow Your Business with <span className="text-amber">Maxify.</span>
            </h2>
            <p className="text-gray-300 font-medium">
              Join thousands of verified vendors. Access regional logistics, AI-powered analytics, and instant payouts.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button className="bg-amber text-white font-bold px-8 py-3 rounded-full hover:bg-orange-600 transition-all shadow-xl shadow-amber/20">
                Join As Seller
              </button>
            </div>
          </div>
          <div className="relative w-full md:w-1/3 aspect-video bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center">
             <div className="text-white/10 font-black text-4xl rotate-12 select-none">MALL PROTOCOL</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
