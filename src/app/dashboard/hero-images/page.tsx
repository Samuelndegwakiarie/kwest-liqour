"use client";

import { useState } from "react";
import { Image as ImageIcon, Plus, Trash2, ToggleRight, ToggleLeft, Eye } from "lucide-react";

interface HeroImage { id: number; url: string; alt: string; active: boolean; }

const INITIAL: HeroImage[] = [
  { id: 1, url: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000", alt: "Premium Spirits Collection", active: true },
  { id: 2, url: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&q=80&w=2000", alt: "The Reserve Bar", active: false },
];

export default function HeroImagesPage() {
  const [images, setImages] = useState<HeroImage[]>(INITIAL);
  const [newUrl, setNewUrl] = useState("");
  const [newAlt, setNewAlt] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUrl) return;
    setImages(prev => [...prev, { id: Date.now(), url: newUrl, alt: newAlt || "Hero image", active: false }]);
    setNewUrl(""); setNewAlt("");
    showToast("Hero image added.");
  };

  const toggleActive = (id: number) => setImages(prev => prev.map(img => ({ ...img, active: img.id === id })));
  const handleDelete = (id: number) => { setImages(prev => prev.filter(img => img.id !== id)); showToast("Image removed."); };

  return (
    <div className="space-y-8 max-w-4xl">
      {preview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setPreview(null)}>
          <img src={preview} alt="Preview" className="max-w-full max-h-[80vh] rounded-2xl object-cover" />
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-white">Hero Images</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage homepage hero slider images</p>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {images.map(img => (
          <div key={img.id} className={`bg-[#0d0d0d] border rounded-2xl overflow-hidden transition-all ${img.active ? "border-[#d4af37]/30" : "border-white/[0.06]"}`}>
            <div className="relative h-40 bg-black group cursor-pointer" onClick={() => setPreview(img.url)}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt} className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-6 h-6 text-white" />
              </div>
              {img.active && (
                <div className="absolute top-3 left-3 bg-[#d4af37] text-[#080808] text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-full">Active</div>
              )}
            </div>
            <div className="p-4 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{img.alt}</p>
                <p className="text-white/30 text-[10px] truncate mt-0.5">{img.url.substring(0, 50)}...</p>
              </div>
              <button onClick={() => toggleActive(img.id)} title={img.active ? "Set as active" : "Activate"} className="text-white/40 hover:text-[#d4af37] transition-colors cursor-pointer">
                {img.active ? <ToggleRight className="w-5 h-5 text-[#d4af37]" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <button onClick={() => handleDelete(img.id)} className="text-white/20 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-[#d4af37]" /> Add Hero Image</h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label htmlFor="hero-url" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Image URL</label>
            <input id="hero-url" type="url" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://images.unsplash.com/..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
          </div>
          <div>
            <label htmlFor="hero-alt" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Alt Text / Description</label>
            <input id="hero-alt" type="text" value={newAlt} onChange={e => setNewAlt(e.target.value)} placeholder="Premium Spirits Collection" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
          </div>
          <button type="submit" className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer">
            <Plus className="w-4 h-4" /> Add Image
          </button>
        </form>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50">{toast}</div>
      )}
    </div>
  );
}
