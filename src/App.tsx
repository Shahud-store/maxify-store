import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import BottomNav from './components/common/BottomNav';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import AdminPage from './Admin';
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50 flex flex-col">
        {/* Desktop Header */}
        <Header />

        {/* Dynamic Content Area */}
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/categories" element={<div className="p-20 text-center">Category Explorer - Logic Engine Ready</div>} />
            <Route path="/cart" element={<div className="p-20 text-center uppercase font-black text-cobalt text-4xl">Checkout Sequence Initiated</div>} />
            <Route path="/profile" element={<div className="p-20 text-center">User Identity Protocol Loaded</div>} />
          </Routes>
        </main>

        {/* Footer (Desktop) */}
        <footer className="hidden md:block bg-white border-t border-slate-200 py-12">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-4 gap-12">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-amber rounded-lg flex items-center justify-center font-display font-black text-white italic">M</div>
                <span className="text-xl font-display font-black tracking-tighter text-cobalt">MAXIFY</span>
              </div>
              <p className="text-sm text-slate-500">The high-conversion multi-vendor marketplace built for the next generation of commerce.</p>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-cobalt">Customer Care</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>Help Center</li>
                <li>How to Buy</li>
                <li>Returns & Refunds</li>
                <li>Maxify Shop</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-cobalt">Maxify</h4>
              <ul className="text-sm text-slate-500 space-y-2">
                <li>About Us</li>
                <li>Flash Sale</li>
                <li>Maxify Blog</li>
                <li>Privacy Policy</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-cobalt">Newsletter</h4>
              <p className="text-sm text-slate-500">Get the latest drops and scarcity alerts.</p>
              <div className="flex gap-2">
                <input type="text" placeholder="Email" className="bg-slate-50 px-4 py-2 rounded-lg text-sm outline-none border border-transparent focus:border-amber w-full" />
                <button className="bg-cobalt text-white px-4 py-2 rounded-lg font-bold text-sm">Join</button>
              </div>
            </div>
          </div>
        </footer>

        {/* Mobile Bottom Navigation */}
        <BottomNav />
      </div>
    </Router>
  );
}
