import { motion } from 'motion/react';
import { Home, LayoutGrid, ShoppingCart, User, Heart } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../lib/utils';
import { useLocation, Link } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();
  const { items } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  const navs = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: LayoutGrid, label: 'Categories', path: '/categories' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartCount },
    { icon: Heart, label: 'Wishlist', path: '/wishlist' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 grid grid-cols-5 md:hidden z-50">
      {navs.map((nav) => {
        const isActive = location.pathname === nav.path;
        return (
          <Link 
            key={nav.label} 
            to={nav.path} 
            className={cn(
              "flex flex-col items-center justify-center py-2 h-16 transition-all",
              isActive ? "border-t-2 border-cobalt text-cobalt" : "text-gray-400"
            )}
          >
            <div className="relative">
              <nav.icon className={cn("w-5 h-5 mb-1", isActive ? "scale-110" : "")} />
              {nav.badge ? (
                <span className="absolute -top-2 -right-2 bg-amber text-white text-[9px] font-bold px-1 rounded-full border border-white">
                  {nav.badge}
                </span>
              ) : null}
            </div>
            <span className="text-tiny font-bold uppercase tracking-tight">
              {nav.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
