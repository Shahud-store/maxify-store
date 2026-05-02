mport { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { cn } from './lib/utils';

export default function AdminPage() {
  // 1. Security States
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 2. Admin Panel States (Jo aapke paas pehle se thin)
  const [url, setUrl] = useState('');
  const [source, setSource] = useState<'ali' | 'cj'>('ali');
  const [isManual, setIsManual] = useState(false);
  const [manualData, setManualData] = useState({ title: '', price: '', image: '', description: '', compare_at_price: '' });
  const [loading, setLoading] = useState(false);

  // Password Check Function
  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (password === "maxify123") { // Password change kar sakte hain yahan
      setIsLoggedIn(true);
    } else {
      alert("Ghalat Password! Dobara koshish karein.");
    }
  };

  // AliExpress aur CJ Dropshipping Logic
  const handleImport = async () => {
    if(!url) return alert(`${source === 'ali' ? 'AliExpress' : 'CJ Dropshipping'} link ya SKU paste karein!`);
    setLoading(true);
    try {
      const response = await fetch('/api/import-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: url, source }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Server error');
      alert(`Imported: ${data.data.title}`);
      setUrl('');
    } catch (error) {
      alert('Import failed!');
    } finally {
      setLoading(false);
    }
  };

  // Manual Product Submit Logic
  const handleManualSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/manual-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualData),
      });
      if (response.ok) {
        alert('Product Added Successfully!');
        setManualData({ title: '', price: '', image: '', description: '', compare_at_price: '' });
      }
    } catch (error) {
      alert('Manual add failed!');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN SCREEN: Agar login nahi hai toh ye dikhao
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center">
          <h1 className="text-2xl font-black mb-4">MAXIFY ADMIN LOCK</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" 
              placeholder="Enter Password" 
              className="w-full p-3 border rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg font-bold">
              Unlock Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ADMIN PANEL: Login ke baad ye dikhega
  return (
    <div className="p-10 min-h-screen bg-slate-50 flex flex-col items-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl">
        <h1 className="text-2xl font-black mb-6 text-center text-cobalt">MAXIFY CONTROL CENTER</h1>
        
        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => {setSource('ali'); setIsManual(false)}} className={cn("p-2 flex-1 rounded", source === 'ali' && !isManual ? "bg-orange-500 text-white" : "bg-slate-200")}>AliExpress</button>
          <button onClick={() => {setSource('cj'); setIsManual(false)}} className={cn("p-2 flex-1 rounded", source === 'cj' && !isManual ? "bg-amber-500 text-white" : "bg-slate-200")}>CJ Dropshipping</button>
          <button onClick={() => setIsManual(true)} className={cn("p-2 flex-1 rounded", isManual ? "bg-black text-white" : "bg-slate-200")}>Manual Add</button>
        </div>

        {!isManual ? (
          <div className="space-y-4">
            <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Link or SKU..." className="w-full p-3 border rounded-lg" />
            <button onClick={handleImport} disabled={loading} className="w-full bg-orange-600 text-white p-3 rounded-lg">{loading ? 'Importing...' : 'Import Product'}</button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input type="text" placeholder="Title" value={manualData.title} onChange={e => setManualData({...manualData, title: e.target.value})} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Price" value={manualData.price} onChange={e => setManualData({...manualData, price: e.target.value})} className="w-full p-3 border rounded-lg" />
            <input type="text" placeholder="Image URL" value={manualData.image} onChange={e => setManualData({...manualData, image: e.target.value})} className="w-full p-3 border rounded-lg" />
            <textarea placeholder="Description" value={manualData.description} onChange={e => setManualData({...manualData, description: e.target.value})} className="w-full p-3 border rounded-lg" />
            <button type="submit" className="w-full bg-black text-white p-3 rounded-lg">Add Manual Product</button>
          </form>
        )}
      </div>
    </div>
  );
}
