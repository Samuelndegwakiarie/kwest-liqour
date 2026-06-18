"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Megaphone } from "lucide-react";

interface Banner { id: number; text: string; active: boolean; color: string; }

export default function PromoBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [newText, setNewText] = useState("");
  const [newColor, setNewColor] = useState("#d4af37");
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    fetch("/api/admin/promo-banners").then(r => r.json()).then(data => { setBanners(data); setLoading(false); });
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;
    setAdding(true);
    const res = await fetch("/api/admin/promo-banners", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: newText, active: true, color: newColor }) });
    const banner = await res.json();
    setBanners(prev => [...prev, banner]);
    setNewText(""); setAdding(false);
    showToast("Banner created successfully.");
  };

  const handleDelete = async (id: number) => {
    await fetch("/api/admin/promo-banners", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setBanners(prev => prev.filter(b => b.id !== id));
    showToast("Banner deleted.");
  };

  const toggleActive = (id: number) => setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Promo Banners</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage storefront notification banners</p>
      </div>

      {/* Preview */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
        <h2 className="text-white font-semibold text-sm">Active Banners Preview</h2>
        {loading ? (
          <div className="h-10 bg-white/[0.04] rounded-xl animate-pulse" />
        ) : banners.filter(b => b.active).length === 0 ? (
          <div className="text-white/30 text-sm text-center py-4">No active banners.</div>
        ) : (
          banners.filter(b => b.active).map(b => (
            <div key={b.id} className="rounded-xl px-4 py-3 text-sm font-medium text-[#080808]" style={{ backgroundColor: b.color }}>
              {b.text}
            </div>
          ))
        )}
      </div>

      {/* Add New */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4">Add New Banner</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label htmlFor="banner-text" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Banner Text</label>
            <input id="banner-text" type="text" value={newText} onChange={e => setNewText(e.target.value)} placeholder="🥃 FREE DELIVERY on orders above KES 5,000..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
          </div>
          <div className="flex items-center gap-4">
            <div>
              <label htmlFor="banner-color" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Color</label>
              <div className="flex items-center gap-3">
                <input id="banner-color" type="color" value={newColor} onChange={e => setNewColor(e.target.value)} className="w-10 h-10 rounded-lg border border-white/[0.08] bg-transparent cursor-pointer" />
                <span className="text-white/40 text-xs font-mono">{newColor}</span>
              </div>
            </div>
            <button type="submit" disabled={adding} className="mt-5 ml-auto flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50">
              <Plus className="w-4 h-4" /> {adding ? "Adding..." : "Add Banner"}
            </button>
          </div>
        </form>
      </div>

      {/* All Banners */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-3">
        <h2 className="text-white font-semibold text-sm mb-4">All Banners</h2>
        {loading ? (
          [...Array(2)].map((_, i) => <div key={i} className="h-16 bg-white/[0.04] rounded-xl animate-pulse" />)
        ) : banners.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-white/20">
            <Megaphone className="w-8 h-8 mb-2" />
            <p className="text-sm">No banners created yet.</p>
          </div>
        ) : (
          banners.map(b => (
            <div key={b.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all">
              <div className="w-4 h-4 rounded-full mt-1 shrink-0" style={{ backgroundColor: b.color }} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm ${b.active ? "text-white" : "text-white/40 line-through"}`}>{b.text}</p>
                <span className={`text-[9px] uppercase tracking-wider font-bold mt-1 block ${b.active ? "text-[#d4af37]" : "text-white/20"}`}>{b.active ? "ACTIVE" : "INACTIVE"}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button onClick={() => toggleActive(b.id)} className="text-white/40 hover:text-[#d4af37] transition-colors cursor-pointer" title={b.active ? "Deactivate" : "Activate"}>
                  {b.active ? <ToggleRight className="w-5 h-5 text-[#d4af37]" /> : <ToggleLeft className="w-5 h-5" />}
                </button>
                <button onClick={() => handleDelete(b.id)} className="text-white/30 hover:text-red-400 transition-colors cursor-pointer" title="Delete banner">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
