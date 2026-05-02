import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { Category } from '../../types';
import { ChevronRight, LayoutGrid, Smartphone, Laptop, Shirt, Watch, Home, Heart, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MegaMenuProps {
  categories: Category[];
}

export default function MegaMenu({ categories }: MegaMenuProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  return (
    <div className="relative group/menu h-full">
      <div className="w-60 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm">
        <div className="p-4 mb-2">
          <h3 className="text-xxs font-bold text-gray-400 uppercase tracking-widest px-2">
            Categories
          </h3>
        </div>
        <nav className="flex-1 space-y-0.5">
          {categories.map((cat) => (
            <div 
              key={cat.id}
              onMouseEnter={() => setActiveCategory(cat.id)}
              onMouseLeave={() => setActiveCategory(null)}
              className={cn(
                "flex items-center justify-between px-4 py-2 cursor-pointer transition-all relative group/item",
                activeCategory === cat.id ? "bg-gray-50 text-cobalt font-semibold border-l-4 border-cobalt" : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent"
              )}
            >
              <div className="flex items-center gap-3">
                <CategoryIcon name={cat.name} className="w-4 h-4 text-gray-400 group-hover/item:text-amber" />
                <span className="text-sm">{cat.name}</span>
              </div>
              <span className="text-xxs opacity-30">›</span>

              {/* Sub-menu Overlay */}
              <AnimatePresence>
                {activeCategory === cat.id && cat.children && (
                  <motion.div
                    initial={{ opacity: 0, x: 5 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 5 }}
                    className="absolute left-[calc(100%-1px)] top-0 w-[500px] h-full min-h-[400px] bg-white border border-gray-200 shadow-xl z-50 p-6 grid grid-cols-2 gap-6"
                  >
                    {cat.children.map((sub) => (
                      <div key={sub.id} className="space-y-3">
                        <h4 className="text-xs font-black text-cobalt uppercase border-b border-gray-100 pb-1.5">{sub.name}</h4>
                        <ul className="space-y-1.5">
                          {sub.children?.map((brand) => (
                            <li key={brand.id} className="text-xs text-gray-500 hover:text-amber transition-colors cursor-pointer">
                              {brand.name}
                            </li>
                          ))}
                          <li className="text-tiny text-amber font-bold cursor-pointer hover:underline">View All Brands ›</li>
                        </ul>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div className="px-4 py-2 mt-4">
            <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded text-sm text-amber font-bold cursor-pointer">
              <span>Flash Sales</span>
              <span className="bg-amber text-white text-tiny px-1.5 rounded font-black uppercase tracking-tighter">HOT</span>
            </div>
          </div>
        </nav>
        
        <div className="p-4 bg-gray-50 border-t border-gray-100">
          <div className="text-tiny text-gray-400 mb-2 uppercase tracking-widest font-bold">Partner Center</div>
          <div className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200 hover:border-amber cursor-pointer group/partner">
             <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-xs text-cobalt">V</div>
             <div>
               <div className="text-xxs font-bold leading-tight group-hover/partner:text-cobalt">Become a Seller</div>
               <div className="text-tiny text-green-600 font-medium">Earn up to 25% extra</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryIcon({ name, ...props }: { name: string; className?: string }) {
  if (name.includes('Electronic')) return <Smartphone {...props} />;
  if (name.includes('Computing')) return <Laptop {...props} />;
  if (name.includes('Fashion')) return <Shirt {...props} />;
  if (name.includes('Watch')) return <Watch {...props} />;
  if (name.includes('Home')) return <Home {...props} />;
  if (name.includes('Health')) return <Heart {...props} />;
  return <MoreHorizontal {...props} />;
}
