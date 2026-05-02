import { ShoppingCart, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center font-black text-white">M</div>
          <span className="text-xl font-black text-slate-800">MAXIFY</span>
        </Link>
        <div className="flex items-center gap-4">
          <ShoppingCart className="w-6 h-6 text-slate-600" />
          <Link to="/admin">
            <User className="w-6 h-6 text-slate-600" />
          </Link>
        </div>
      </div>
    </header>
  );
}
