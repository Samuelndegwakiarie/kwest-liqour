"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Plus, Pencil, Trash2, X, Eye, EyeOff, Package, ChevronDown, Loader2, Check } from "lucide-react";

interface Product {
  id: number;
  brand: string;
  name: string;
  price: number;
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

const EMPTY_FORM = { brand: "", name: "", category: "Whisky", volume: "750ml", price: "", stock: "", tag: "", img: "", description: "", visible: true };

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
    setForm({ brand: p.brand, name: p.name, category: p.category, volume: p.volume, price: String(p.price), stock: String(p.stock), tag: p.tag ?? "", img: p.img, description: p.description, visible: p.visible });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, price: Number(form.price), stock: Number(form.stock), tag: form.tag || null, visible: form.visible };
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
                <td className="px-5 py-3 text-[#d4af37] text-sm font-semibold">KES {p.price.toLocaleString()}</td>
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
                  <span className="text-[#d4af37] text-xs font-bold">KES {p.price.toLocaleString()}</span>
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

      {/* Slide-out Modal */}
      {modalOpen && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setModalOpen(false)} />
          <div className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0d0d0d] border-l border-white/[0.06] z-50 overflow-y-auto shadow-2xl transition-transform duration-300">
            <div className="sticky top-0 bg-[#0d0d0d] border-b border-white/[0.06] px-6 py-4 flex items-center justify-between z-10">
              <h2 className="text-white font-bold text-lg">{editingProduct ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setModalOpen(false)} className="text-white/40 hover:text-white transition-colors cursor-pointer"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              {[
                { id: "f-brand", label: "Brand", key: "brand", type: "text", placeholder: "JOHNNIE WALKER", required: true },
                { id: "f-name", label: "Product Name", key: "name", type: "text", placeholder: "Black Label Scotch", required: true },
                { id: "f-price", label: "Price (KES)", key: "price", type: "number", placeholder: "5800", required: true },
                { id: "f-stock", label: "Stock Count", key: "stock", type: "number", placeholder: "48", required: true },
                { id: "f-img", label: "Image URL", key: "img", type: "text", placeholder: "/bottle.png or https://..." },
              ].map(f => (
                <div key={f.id}>
                  <label htmlFor={f.id} className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">
                    {f.label}{f.required && <span className="text-[#d4af37] ml-1">*</span>}
                  </label>
                  <input
                    id={f.id} type={f.type} placeholder={f.placeholder} required={f.required}
                    value={(form as Record<string, string | boolean>)[f.key] as string}
                    onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all"
                  />
                </div>
              ))}

              {/* Category */}
              <div>
                <label htmlFor="f-cat" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Category <span className="text-[#d4af37]">*</span></label>
                <select id="f-cat" value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#0d0d0d]">{c}</option>)}
                </select>
              </div>

              {/* Volume */}
              <div>
                <label htmlFor="f-vol" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Volume <span className="text-[#d4af37]">*</span></label>
                <select id="f-vol" value={form.volume} onChange={e => setForm(p => ({ ...p, volume: e.target.value }))} required className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                  {VOLUMES.map(v => <option key={v} value={v} className="bg-[#0d0d0d]">{v}</option>)}
                </select>
              </div>

              {/* Tag */}
              <div>
                <label htmlFor="f-tag" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Badge Tag</label>
                <select id="f-tag" value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all">
                  <option value="" className="bg-[#0d0d0d]">None</option>
                  {TAGS.map(t => <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label htmlFor="f-desc" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Description</label>
                <textarea id="f-desc" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Short product description..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all resize-none" />
              </div>

              {/* Visible toggle */}
              <div className="flex items-center justify-between p-4 bg-white/[0.02] rounded-xl border border-white/[0.06]">
                <div>
                  <p className="text-white text-sm font-medium">Visible in Store</p>
                  <p className="text-white/30 text-xs mt-0.5">Show this product on the customer gallery</p>
                </div>
                <button type="button" onClick={() => setForm(p => ({ ...p, visible: !p.visible }))} className={`w-12 h-6 rounded-full transition-all cursor-pointer ${form.visible ? "bg-[#d4af37]" : "bg-white/10"}`}>
                  <span className={`block w-5 h-5 bg-white rounded-full shadow transition-transform mx-0.5 ${form.visible ? "translate-x-6" : "translate-x-0"}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 border border-white/[0.08] text-white/60 hover:text-white py-3 rounded-xl transition-all cursor-pointer text-sm font-medium">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold py-3 rounded-xl transition-all cursor-pointer disabled:opacity-70 text-sm">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {saving ? "Saving..." : "Save Product"}
                </button>
              </div>
            </form>
          </div>
        </>
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
