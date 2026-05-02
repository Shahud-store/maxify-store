import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const SLIDES = [
  {
    title: "Summer Cobalt Collection",
    subtitle: "Up to 70% Off Premium Brands",
    bg: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=2070",
    color: "#003366",
    accent: "Amber"
  },
  {
    title: "Eco-Tech Revolution",
    subtitle: "New Arrivals in Home Computing",
    bg: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=2070",
    color: "#0f172a",
    accent: "Cyan"
  },
  {
    title: "Maxify Mall Opening",
    subtitle: "Verified Vendors Only",
    bg: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?auto=format&fit=crop&q=80&w=2070",
    color: "#1e293b",
    accent: "Amber"
  }
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative h-[480px] rounded-2xl overflow-hidden shadow-xl bg-slate-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0"
        >
          {/* Background Image with Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
          <img 
            src={SLIDES[current].bg} 
            className="w-full h-full object-cover" 
            alt={SLIDES[current].title} 
          />

          {/* Content */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center px-12 md:px-20 max-w-2xl text-white">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="inline-block px-3 py-1 bg-amber text-cobalt font-black text-xs uppercase tracking-[0.2em] rounded mb-6">
                Fresh Drop
              </div>
              <h2 className="text-6xl font-display font-black leading-[1.1] mb-6 drop-shadow-2xl">
                {SLIDES[current].title.split(' ').map((word, i) => (
                  <span key={i} className={i === 1 ? "text-amber" : ""}>{word} </span>
                ))}
              </h2>
              <p className="text-xl text-white/80 font-medium mb-10 max-w-sm">
                {SLIDES[current].subtitle}
              </p>
              <div className="flex gap-4">
                <button className="bg-amber hover:bg-orange-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-lg shadow-amber/20">
                  Shop Now
                </button>
                <button className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold px-8 py-4 rounded-xl transition-all">
                  View Mall
                </button>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <button 
        onClick={() => setCurrent((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => setCurrent((prev) => (prev + 1) % SLIDES.length)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-8 left-12 md:left-20 z-30 flex gap-3">
        {SLIDES.map((_, i) => (
          <button 
            key={i} 
            onClick={() => setCurrent(i)}
            className={cn(
              "h-1.5 transition-all rounded-full",
              current === i ? "w-12 bg-amber" : "w-6 bg-white/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
