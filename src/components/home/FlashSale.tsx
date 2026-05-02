import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { Product } from '../../types';
import { cn, formatCurrency } from '../../lib/utils';
import { Timer, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FlashSaleProps {
  products: Product[];
}

export default function FlashSale({ products }: FlashSaleProps) {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, mins: 0, secs: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const end = new Date().setHours(24, 0, 0, 0); // Reset at midnight
      const diff = end - now;

      setTimeLeft({
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        mins: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        secs: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="flash-sale" className="bg-cobalt rounded-2xl p-8 flex flex-col md:flex-row justify-between items-center text-white overflow-hidden relative shadow-xl shadow-cobalt/10">
      <div className="relative z-10 space-y-4 md:flex-1">
        <div className="inline-block bg-amber text-white text-tiny font-bold px-3 py-1 rounded-full uppercase tracking-tighter">Deal of the Day</div>
        <h2 className="text-4xl font-display font-black tracking-tight leading-none mb-4">Super Flash Sale</h2>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-2 text-center">
            {[
              { val: timeLeft.hours, label: 'Hrs' },
              { val: timeLeft.mins, label: 'Min' },
              { val: timeLeft.secs, label: 'Sec' }
            ].map((item, i) => (
              <div key={i} className="bg-white/10 p-2 rounded w-14 border border-white/5">
                <div className="text-xl font-bold font-mono tracking-tighter">{item.val.toString().padStart(2, '0')}</div>
                <div className="text-tiny uppercase opacity-60 font-bold">{item.label}</div>
              </div>
            ))}
          </div>
          <button className="bg-amber hover:bg-orange-600 text-white px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-amber/20 transition-all uppercase tracking-tight">
            Shop Now
          </button>
        </div>
      </div>

      <div className="hidden lg:grid grid-cols-3 gap-3 relative z-10 w-full max-w-lg mt-8 md:mt-0">
        {products.slice(0, 3).map((product) => (
          <div 
            key={product.id} 
            onClick={() => navigate(`/product/${product.id}`)}
            className="bg-white/5 backdrop-blur-md rounded-xl p-2 border border-white/10 flex flex-col items-center cursor-pointer hover:bg-white/10 transition-colors"
          >
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-white/10 mb-2">
              {(product.images && product.images[0]) ? (
                <img src={product.images[0]} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/20">
                   <Zap className="w-8 h-8" />
                </div>
              )}
            </div>
            <div className="text-amber font-black text-sm">{formatCurrency(product.discount_price || product.price)}</div>
            <div className="h-1 w-full bg-white/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-amber w-2/3"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Shapes */}
      <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
      <div className="absolute right-10 bottom-0 w-48 h-48 bg-amber/10 rounded-full blur-2xl" />
    </section>
  );
}
