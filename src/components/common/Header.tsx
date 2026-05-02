import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Search, User, Menu, Bell } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { cn } from '../../lib/utils';

export default function Header() {
  const { items } = useCart();
  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const [url, setUrl] = useState('');
  const [source, setSource] = useState<'ali' | 'cj'>('ali');
  const [isManual, setIsManual] = useState(false);
  const [manualData, setManualData] = useState({ title: '', price: '', image: '', description: '', compare_at_price: '' });
  const [loading, setLoading] = useState(false);

  const handleImport = async () => {
    if(!url) return alert(`${source === 'ali' ? 'AliExpress' : 'CJ Dropshipping'} link or SKU paste karein!`);
    setLoading(true);
    try {
      const response = await fetch('/api/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: url, source }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server responded with ${response.status}`);
      }
      
      const data = await response.json();
      alert(`Imported: ${data.data.title}`);
      setUrl('');
    } catch (error) {
      console.error("Import failed:", error);
      alert(error instanceof Error ? error.message : "Import failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    console.log('Manual Submit Triggered. Source:', source);
    setLoading(true);
    
    // Explicitly log data before sending as requested
    if (source === 'cj') {
      console.log('CJ Data:', manualData);
    } else {
      console.log('Ali Data:', manualData);
    }

    try {
      const payload = { 
        ...manualData, 
        source
      };
      
      console.log('Sending payload to server:', payload);

      const response = await fetch('/api/manual-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || `Manual save failed: ${response.status}`);
      }

      console.log('Save result:', result);
      alert("Product Added Successfully");
      
      // Clear all fields
      setManualData({ title: '', price: '', image: '', description: '', compare_at_price: '' });
      setIsManual(false);
    } catch (error) {
      console.error("Manual submit error:", error);
      alert(error instanceof Error ? error.message : "Error saving product. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0 cursor-pointer">
            <div className="w-8 h-8 bg-amber rounded-md flex items-center justify-center font-display font-black text-white text-lg shadow-inner italic">
              M
            </div>
            <span className="text-xl font-display font-black tracking-tighter text-cobalt hidden md:block">MAXIFY</span>
          </div>

          {/* Search/Import Box */}
          <div className="flex-grow max-w-2xl">
            <div className="flex gap-2 mb-2 px-4 justify-center md:justify-start">
              <button 
                onClick={() => setSource('ali')}
                className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full transition-all",
                  source === 'ali' ? "bg-cobalt text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                AliExpress
              </button>
              <button 
                onClick={() => setSource('cj')}
                className={cn(
                  "text-[10px] font-black px-3 py-1 rounded-full transition-all",
                  source === 'cj' ? "bg-amber text-white" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                )}
              >
                CJ Dropshipping
              </button>
            </div>

            {!isManual ? (
              <div className="relative">
                <input 
                  type="text" 
                  placeholder={source === 'ali' ? "Paste AliExpress Product URL..." : "Paste CJ URL or Product SKU..."}
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  disabled={loading}
                  className="w-full bg-gray-100 border-none rounded-full px-5 py-2 text-sm outline-none focus:ring-2 focus:ring-cobalt transition-all placeholder:text-gray-400 disabled:opacity-50"
                />
                <button 
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-cobalt text-white p-1.5 rounded-full hover:bg-slate-800 transition-colors disabled:opacity-50"
                  onClick={handleImport}
                  disabled={loading}
                >
                  {loading ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
                </button>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1 duration-300">
                <input 
                  type="text" required placeholder="Title" 
                  value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})}
                  className="bg-gray-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-amber flex-1 min-w-[120px]"
                />
                <input 
                  type="text" required placeholder="Base Price" 
                  value={manualData.price} onChange={e => setManualData({...manualData, price: e.target.value})}
                  className="bg-gray-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-amber w-24"
                />
                <input 
                  type="text" placeholder="Compare Price (Fake)" 
                  value={manualData.compare_at_price} onChange={e => setManualData({...manualData, compare_at_price: e.target.value})}
                  className="bg-gray-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-amber w-28"
                />
                <input 
                  type="text" placeholder="Image URL" 
                  value={manualData.image} onChange={e => setManualData({...manualData, image: e.target.value})}
                  className="bg-gray-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-amber flex-1 min-w-[120px]"
                />
                <input 
                  type="text" placeholder="Short Description" 
                  value={manualData.description} onChange={e => setManualData({...manualData, description: e.target.value})}
                  className="bg-gray-100 text-xs px-3 py-2 rounded-lg outline-none focus:ring-1 focus:ring-amber flex-1 min-w-[120px]"
                />
                <button 
                  type="submit" disabled={loading}
                  className={cn(
                    "text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50 h-full",
                    source === 'ali' ? "bg-cobalt hover:bg-slate-800" : "bg-amber hover:bg-orange-500"
                  )}
                >
                  {loading ? 'Saving...' : `Add ${source === 'ali' ? 'Ali' : 'CJ'} Product`}
                </button>
              </form>
            )}
            <div className="flex justify-end mt-1 px-4">
              <button 
                onClick={() => setIsManual(!isManual)}
                className="text-[10px] font-black uppercase tracking-widest text-amber hover:underline"
              >
                {isManual ? 'Switch to Scraper' : 'Bot Blocked? Try Manual Import'}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold">$1,240.50</span>
                <span className="text-tiny text-amber uppercase font-black">Wallet Balance</span>
              </div>
            </div>

            <div className="relative cursor-pointer group">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-gray-200 transition-colors">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
              </div>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 bg-amber text-white text-xxs font-bold px-1.5 rounded-full border-2 border-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </div>

            <div className="w-10 h-10 bg-cobalt rounded-full flex items-center justify-center text-white font-bold text-sm">
              JD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
