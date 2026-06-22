"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X, Eye, EyeOff, Package, ChevronDown, Loader2, Check } from "lucide-react";

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
  discountPrice: number | null;
  tag: string | null;
  img: string;
  category: string;
  volume: string;
  stock: number;
  visible: boolean;
  description: string;
}

const CATEGORIES = ["Whisky", "Gin", "Cognac", "Tequila", "Wines"];
const VOLUMES = ["250ml", "350ml", "500ml", "750ml", "1000ml"];
const TAGS = ["BEST SELLER", "POPULAR", "LUXURY", "TRENDING", "LIMITED"];

const TAG_COLORS: Record<string, string> = {
  "BEST SELLER": "bg-[#d4af37]/20 text-[#d4af37] border-[#d4af37]/30",
  "POPULAR": "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  "LUXURY": "bg-amber-600/20 text-amber-400 border-amber-600/30",
  "TRENDING": "bg-violet-500/20 text-violet-400 border-violet-500/30",
  "LIMITED": "bg-rose-500/20 text-rose-400 border-rose-500/30",
};

const EMPTY_FORM = {
  brand: "",
  name: "",
  category: "Whisky",
  volume: "750ml",
  price: "",
  discountPrice: "",
  stock: "",
  tag: "",
  img: "",
  description: "",
  visible: true
};

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">OUT</span>;
  if (stock < 10) return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">{stock} LOW</span>;
  return <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">{stock}</span>;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("All");
  const [stockFilter, setStockFilter] = useState("All");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Delete confirm
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch { /* silent */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const openCreate = () => {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };

  const openEdit = (p: Product) => {
    setEditingProduct(p);
    setForm({
      brand: p.brand,
      name: p.name,
      category: p.category,
      volume: p.volume,
      price: String(p.price),
      discountPrice: p.discountPrice ? String(p.discountPrice) : "",
      stock: String(p.stock),
      tag: p.tag ?? "",
      img: p.img,
      description: p.description,
      visible: p.visible
    });
    setModalOpen(true);
  };

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
      showToast("Product image is required.");
      return;
    }
    setSaving(true);
    const body = {
      brand: form.brand,
      name: form.name,
      category: form.category,
      volume: form.volume,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stock: Number(form.stock),
      tag: form.tag || null,
      img: form.img,
      description: form.description,
      visible: form.visible
    };
    try {
      if (editingProduct) {
        const res = await fetch(`/api/admin/products/${editingProduct.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const updated = await res.json();
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        showToast("Product updated successfully.");
      } else {
        const res = await fetch("/api/admin/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        const created = await res.json();
        setProducts(prev => [...prev, created]);
        showToast("Product added to catalog.");
      }
      setModalOpen(false);
    } catch { showToast("Error saving product."); }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
    showToast("Product removed from catalog.");
  };

  const toggleVisible = async (p: Product) => {
    const res = await fetch(`/api/admin/products/${p.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ visible: !p.visible }) });
    const updated = await res.json();
    setProducts(prev => prev.map(x => x.id === updated.id ? updated : x));
  };

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    if (q && !p.brand.toLowerCase().includes(q) && !p.name.toLowerCase().includes(q)) return false;
    if (catFilter !== "All" && p.category !== catFilter) return false;
    if (stockFilter === "Low Stock" && p.stock >= 10) return false;
    if (stockFilter === "Out of Stock" && p.stock !== 0) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Product Catalog</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{products.length} products in catalog</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer shrink-0">
          <Plus className="w-4 h-4" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search brand or name..." className="w-full pl-10 pr-4 py-2.5 bg-[#0d0d0d] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
        </div>
        <div className="relative">
          <select value={catFilter} onChange={e => setCatFilter(e.target.value)} className="appearance-none bg-[#0d0d0d] border border-white/[0.08] rounded-xl pl-4 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all cursor-pointer">
            <option value="All">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        </div>
        <div className="relative">
          <select value={stockFilter} onChange={e => setStockFilter(e.target.value)} className="appearance-none bg-[#0d0d0d] border border-white/[0.08] rounded-xl pl-4 pr-8 py-2.5 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all cursor-pointer">
            {["All", "Low Stock", "Out of Stock"].map(s => <option key={s} value={s} className="bg-[#0d0d0d]">{s}</option>)}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40 pointer-events-none" />
        </div>
        <span className="text-white/30 text-xs self-center shrink-0">{filtered.length} result{filtered.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Desktop Table */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Product", "Category", "Volume", "Price", "Stock", "Tag", "Visible", "Actions"].map(h => (
                <th key={h} className="px-5 py-3 text-left text-[9px] uppercase tracking-widest text-white/30 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-8 bg-white/[0.04] rounded-lg animate-pulse" /></td></tr>
              ))
            ) : filtered.map(p => (
              <tr key={p.id} className="hover:bg-white/[0.02] transition-colors group border-l-2 border-transparent hover:border-[#d4af37]/40">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.img} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-black/40 shrink-0" onError={e => { (e.target as HTMLImageElement).style.display = "none"; }} />
                    <div>
                      <p className="text-white text-sm font-semibold leading-tight">{p.name}</p>
                      <p className="text-white/40 text-[10px] uppercase tracking-wide">{p.brand}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3 text-white/60 text-xs">{p.category}</td>
                <td className="px-5 py-3 text-white/60 text-xs font-mono">{p.volume}</td>
                <td className="px-5 py-3 text-sm font-semibold">
                  {p.discountPrice ? (
                    <div className="flex flex-col">
                      <span className="text-[#d4af37]">KES {p.discountPrice.toLocaleString()}</span>
                      <span className="text-white/30 line-through text-[11px]">KES {p.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-[#d4af37]">KES {p.price.toLocaleString()}</span>
                  )}
                </td>
                <td className="px-5 py-3"><StockBadge stock={p.stock} /></td>
                <td className="px-5 py-3">
                  {p.tag ? (
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${TAG_COLORS[p.tag] ?? "bg-white/10 text-white/40"}`}>{p.tag}</span>
                  ) : <span className="text-white/20 text-xs">—</span>}
                </td>
                <td className="px-5 py-3">
                  <button onClick={() => toggleVisible(p)} className={`cursor-pointer transition-colors ${p.visible ? "text-emerald-400 hover:text-emerald-300" : "text-white/20 hover:text-white/50"}`}>
                    {p.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(p)} className="p-1.5 text-white/30 hover:text-[#d4af37] hover:bg-[#d4af37]/10 rounded-lg transition-all cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    {deletingId === p.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer text-[10px] font-bold">Confirm</button>
                        <button onClick={() => setDeletingId(null)} className="p-1.5 text-white/30 rounded-lg cursor-pointer"><X className="w-3 h-3" /></button>
                      </div>
                    ) : (
                      <button onClick={() => setDeletingId(p.id)} className="p-1.5 text-white/30 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-white/20">
            <Package className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No products match your filters.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {loading ? [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-[#0d0d0d] rounded-2xl animate-pulse" />) :
          filtered.map(p => (
            <div key={p.id} className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-4 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.img} alt={p.name} className="w-12 h-12 rounded-xl object-cover bg-black/40 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-semibold truncate">{p.name}</p>
                <p className="text-white/40 text-[10px] uppercase">{p.brand} · {p.volume}</p>
                <div className="flex items-center gap-2 mt-1">
                  {p.discountPrice ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#d4af37] text-xs font-bold">KES {p.discountPrice.toLocaleString()}</span>
                      <span className="text-white/30 line-through text-[10px]">KES {p.price.toLocaleString()}</span>
                    </div>
                  ) : (
                    <span className="text-[#d4af37] text-xs font-bold">KES {p.price.toLocaleString()}</span>
                  )}
                  <StockBadge stock={p.stock} />
                </div>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <button onClick={() => openEdit(p)} className="p-2 text-white/40 hover:text-[#d4af37] border border-white/[0.08] rounded-lg transition-all cursor-pointer"><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => setDeletingId(p.id === deletingId ? null : p.id)} className="p-2 text-white/40 hover:text-red-400 border border-white/[0.08] rounded-lg transition-all cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          ))}
      </div>

      {/* Full-page Modal (except sidebar menu on desktop) */}
      {modalOpen && (
        <div className="fixed inset-y-0 right-0 left-0 lg:left-64 bg-[#060B18] z-40 overflow-y-auto shadow-2xl flex flex-col animate-in fade-in duration-200">
          <div className="sticky top-0 bg-[#0d0d0d]/80 backdrop-blur-md border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10 shrink-0">
            <div className="max-w-5xl w-full mx-auto flex items-center justify-between">
              <h2 className="text-white font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer p-1.5 hover:bg-white/5 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
          </div>

          <div className="flex-1 w-full max-w-5xl mx-auto py-8 px-6">
            <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column: Basic Details */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="f-brand" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Brand <span className="text-[#d4af37]">*</span></label>
                  <input id="f-brand" type="text" placeholder="JOHNNIE WALKER" required value={form.brand} onChange={e => setForm(prev => ({ ...prev, brand: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
                </div>

                <div>
                  <label htmlFor="f-name" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Product Name <span className="text-[#d4af37]">*</span></label>
                  <input id="f-name" type="text" placeholder="Black Label Scotch" required value={form.name} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="f-price" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Price (KES) <span className="text-[#d4af37]">*</span></label>
                    <input id="f-price" type="number" placeholder="5800" required value={form.price} onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="f-discount" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Discount Price (KES)</label>
                    <input id="f-discount" type="number" placeholder="5000 (Optional)" value={form.discountPrice} onChange={e => setForm(prev => ({ ...prev, discountPrice: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label htmlFor="f-desc" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Description</label>
                  <textarea id="f-desc" rows={6} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short product description..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all resize-none" />
                </div>
              </div>

              {/* Right Column: Inventory, Media, Status */}
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="f-stock" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Stock Count <span className="text-[#d4af37]">*</span></label>
                    <input id="f-stock" type="number" placeholder="48" required value={form.stock} onChange={e => setForm(prev => ({ ...prev, stock: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
                  </div>
                  <div>
                    <label htmlFor="f-tag" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Badge Tag</label>
                    <select id="f-tag" value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                      <option value="" className="bg-[#0d0d0d]">None</option>
                      {TAGS.map(t => <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="f-cat" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Category <span className="text-[#d4af37]">*</span></label>
                    <select id="f-cat" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                      {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="f-vol" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Volume <span className="text-[#d4af37]">*</span></label>
                    <select id="f-vol" value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                      {VOLUMES.map(v => <option key={v} value={v} className="bg-[#0d0d0d]">{v}</option>)}
                    </select>
                  </div>
                </div>

                {/* Image Upload Input */}
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Product Image <span className="text-[#d4af37]">*</span></label>
                  <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl">
                    {form.img ? (
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-black shrink-0 border border-white/[0.1] flex items-center justify-center p-1">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={form.img} alt="Preview" className="h-full object-contain" />
                        <button type="button" onClick={() => setForm(prev => ({ ...prev, img: "" }))} className="absolute top-0.5 right-0.5 bg-black/70 rounded-full p-0.5 text-white/70 hover:text-white cursor-pointer">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white/[0.02] border border-dashed border-white/[0.1] shrink-0 flex items-center justify-center text-white/20">
                        <Package className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="hidden" id="file-upload" />
                      <label htmlFor="file-upload" className="inline-flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/20 text-[#d4af37] text-xs font-semibold px-4 py-2.5 rounded-lg transition-all cursor-pointer">
                        {uploading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Uploading...
                          </>
                        ) : "Choose Image"}
                      </label>
                      <p className="text-[10px] text-white/30 mt-1.5 truncate">{form.img ? form.img : "No image selected"}</p>
                    </div>
                  </div>
                </div>

                {/* Visible toggle */}
                <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                  <div>
                    <p className="text-white text-sm font-medium">Visible in Store</p>
                    <p className="text-white/30 text-xs mt-0.5">Show this product on the customer gallery</p>
                  </div>
                  <button type="button" onClick={() => setForm(p => ({ ...p, visible: !p.visible }))} className={`w-12 h-6 rounded-full transition-all cursor-pointer relative ${form.visible ? "bg-[#d4af37]" : "bg-white/10"}`}>
                    <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform absolute top-0.5 ${form.visible ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/[0.06]">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/[0.08] text-white/60 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-sm font-medium">Cancel</button>
                  <button type="submit" disabled={saving || uploading} className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-70 text-sm">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {saving ? "Saving..." : "Save Product"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
