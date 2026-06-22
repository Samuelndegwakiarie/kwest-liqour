"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, ToggleLeft, ToggleRight, Megaphone, Loader2, Check, X, Image as ImageIcon, Pencil } from "lucide-react";

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
}

interface Banner {
  id: number;
  title: string;
  description: string;
  img: string;
  discountAmount: number;
  price: number;
  active: boolean;
  color: string;
  endsAt?: string | null;
}

const EMPTY_FORM = {
  title: "",
  description: "",
  img: "",
  discountAmount: "",
  price: "",
  color: "#d4af37",
  active: true,
  endsAt: ""
};

export default function PromoBannersPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY_FORM);
  const [adding, setAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bannersRes, productsRes] = await Promise.all([
        fetch("/api/admin/promo-banners"),
        fetch("/api/admin/products")
      ]);
      const bannersData = await bannersRes.json();
      const productsData = await productsRes.json();
      setBanners(bannersData);
      setProducts(productsData);
    } catch {
      showToast("Error loading data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (data.url) {
        setForm(prev => ({ ...prev, img: data.url }));
        showToast("Image uploaded successfully.");
      } else {
        showToast("Upload failed: " + (data.error || "unknown error"));
      }
    } catch {
      showToast("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.img) {
      showToast("Banner image is required.");
      return;
    }
    if (form.price === "") {
      showToast("Price is required.");
      return;
    }
    setAdding(true);
    const body = {
      id: editingId,
      title: form.title,
      description: form.description,
      img: form.img,
      discountAmount: Number(form.discountAmount) || 0,
      price: Number(form.price) || 0,
      active: form.active,
      color: form.color,
      endsAt: form.endsAt || null
    };
    try {
      const url = "/api/admin/promo-banners";
      const method = editingId !== null ? "PUT" : "POST";
      const res = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        const savedBanner = await res.json();
        if (editingId !== null) {
          setBanners(prev => prev.map(b => b.id === editingId ? savedBanner : b));
          setEditingId(null);
          showToast("Promo banner updated successfully.");
        } else {
          setBanners(prev => [...prev, savedBanner]);
          showToast("Promo banner created successfully.");
        }
        setForm(EMPTY_FORM);
      } else {
        showToast(editingId !== null ? "Failed to update banner." : "Failed to create banner.");
      }
    } catch {
      showToast(editingId !== null ? "Error updating banner." : "Error creating banner.");
    } finally {
      setAdding(false);
    }
  };

  const handleEditClick = (banner: Banner) => {
    setEditingId(banner.id);
    setForm({
      title: banner.title,
      description: banner.description,
      img: banner.img,
      discountAmount: String(banner.discountAmount),
      price: String(banner.price),
      color: banner.color,
      active: banner.active,
      endsAt: banner.endsAt || ""
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const handleDelete = async (id: number) => {
    try {
      const res = await fetch("/api/admin/promo-banners", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id })
      });
      if (res.ok) {
        setBanners(prev => prev.filter(b => b.id !== id));
        showToast("Banner deleted.");
      } else {
        showToast("Failed to delete banner.");
      }
    } catch {
      showToast("Error deleting banner.");
    }
  };

  const toggleActive = async (banner: Banner) => {
    const updatedStatus = !banner.active;
    setBanners(prev => prev.map(b => b.id === banner.id ? { ...b, active: updatedStatus } : b));
    try {
      await fetch("/api/admin/promo-banners", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...banner, active: updatedStatus })
      });
    } catch {
      setBanners(prev => prev.map(b => b.id === banner.id ? banner : b));
      showToast("Error updating banner status.");
    }
  };

  const getProductName = (productId: number) => {
    const p = products.find(x => x.id === productId);
    return p ? `${p.brand} - ${p.name}` : `Product #${productId}`;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Promo Banners</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage storefront promo offers and discount banners</p>
      </div>

      {/* Grid: Form on Left, Active Banners list on Right */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Add New / Edit Form */}
        <div className="md:col-span-6 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 h-fit space-y-4">
          <h2 className="text-white font-semibold text-sm">{editingId !== null ? "Edit Promo Banner" : "Add New Banner"}</h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label htmlFor="b-title" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Banner Title</label>
              <input id="b-title" type="text" value={form.title} onChange={e => setForm(prev => ({ ...prev, title: e.target.value }))} placeholder="Fathers day offer" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
            </div>

            <div>
              <label htmlFor="b-desc" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Description</label>
              <textarea id="b-desc" rows={2} value={form.description} onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Get KES 1,000 off Johnnie Walker Black..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all resize-none" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="b-discount" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Discount Amount</label>
                <input id="b-discount" type="number" value={form.discountAmount} onChange={e => setForm(prev => ({ ...prev, discountAmount: e.target.value }))} placeholder="1000" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
              </div>
              <div>
                <label htmlFor="b-price" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Offer Price (KES)</label>
                <input id="b-price" type="number" value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} placeholder="4800" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Product Image <span className="text-[#d4af37]">*</span></label>
              <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                {form.img ? (
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-black shrink-0 border border-white/[0.1] flex items-center justify-center p-1">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={form.img} alt="Preview" className="h-full object-contain" />
                    <button type="button" onClick={() => setForm(prev => ({ ...prev, img: "" }))} className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 text-white/70 hover:text-white cursor-pointer">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] shrink-0 flex items-center justify-center text-white/20">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="banner-file-upload" />
                  <label htmlFor="banner-file-upload" className="inline-flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold px-3.5 py-2 rounded-lg transition-all cursor-pointer">
                    {uploading ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                      </>
                    ) : "Choose Image"}
                  </label>
                  <p className="text-[9px] text-white/30 mt-1 truncate">{form.img ? form.img : "No image selected"}</p>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="b-ends" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Offer Ends At (Optional)</label>
              <input id="b-ends" type="datetime-local" value={form.endsAt} onChange={e => setForm(prev => ({ ...prev, endsAt: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all cursor-pointer" />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <div>
                <label htmlFor="b-color" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Accent Color</label>
                <div className="flex items-center gap-2">
                  <input id="b-color" type="color" value={form.color} onChange={e => setForm(prev => ({ ...prev, color: e.target.value }))} className="w-8 h-8 rounded border border-white/[0.08] bg-transparent cursor-pointer" />
                  <span className="text-white/40 text-[10px] font-mono">{form.color}</span>
                </div>
              </div>
              <div className="mt-5 ml-auto flex items-center gap-2">
                {editingId !== null && (
                  <button type="button" onClick={cancelEdit} className="border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer">
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={adding || uploading} className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50">
                  {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : (editingId !== null ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />)}
                  {adding ? (editingId !== null ? "Saving..." : "Creating...") : (editingId !== null ? "Save Changes" : "Create Banner")}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Banners List */}
        <div className="md:col-span-6 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6 space-y-4">
          <h2 className="text-white font-semibold text-sm">All Promo Banners</h2>
          {loading ? (
            [...Array(2)].map((_, i) => <div key={i} className="h-24 bg-white/[0.04] rounded-xl animate-pulse" />)
          ) : banners.length === 0 ? (
            <div className="flex flex-col items-center py-10 text-white/20">
              <Megaphone className="w-8 h-8 mb-2" />
              <p className="text-sm">No banners created yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {banners.map(b => (
                <div key={b.id} className="flex gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-white/[0.1] transition-all bg-white/[0.01]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={b.img} alt={b.title} className="w-12 h-16 rounded object-contain bg-black/40 p-1 border border-white/[0.05]" />
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-white text-sm font-semibold truncate">{b.title}</p>
                    <p className="text-white/40 text-xs line-clamp-2 mt-0.5">{b.description}</p>
                    {b.endsAt && (
                      <p className="text-[#00f0ff] text-[9.5px] font-semibold tracking-wider uppercase mt-1">ENDS: {new Date(b.endsAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[#d4af37] text-[10px] font-bold">KES {b.discountAmount.toLocaleString()} OFF</span>
                      <span className="text-white/30 text-[10px] font-semibold">PRICE: KES {b.price.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button onClick={() => toggleActive(b)} className="text-white/40 hover:text-[#d4af37] transition-colors cursor-pointer">
                      {b.active ? <ToggleRight className="w-5 h-5 text-[#d4af37]" /> : <ToggleLeft className="w-5 h-5" />}
                    </button>
                    <div className="flex items-center gap-2 mt-4">
                      <button onClick={() => handleEditClick(b)} className="p-1.5 text-white/30 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-all cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(b.id)} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
