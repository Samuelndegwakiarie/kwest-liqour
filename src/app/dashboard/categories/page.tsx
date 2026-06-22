"use client";

import { useState, useCallback } from "react";
import {
  Tag,
  Box,
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Check,
  X,
  Layers,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
  visible: boolean;
}

const INITIAL_CATEGORIES: Category[] = [
  { id: "whisky", name: "Whisky", count: 3, visible: true },
  { id: "gin", name: "Gin", count: 3, visible: true },
  { id: "cognac", name: "Cognac", count: 2, visible: true },
  { id: "tequila", name: "Tequila", count: 1, visible: true },
  { id: "wines", name: "Wines", count: 1, visible: true },
];

const CATEGORY_COLORS = [
  "from-amber-500/20 to-amber-500/5 border-amber-500/20",
  "from-purple-500/20 to-purple-500/5 border-purple-500/20",
  "from-blue-500/20 to-blue-500/5 border-blue-500/20",
  "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20",
  "from-rose-500/20 to-rose-500/5 border-rose-500/20",
  "from-cyan-500/20 to-cyan-500/5 border-cyan-500/20",
];

const ICON_COLORS = [
  "text-amber-400 bg-amber-400/10 border-amber-400/20",
  "text-purple-400 bg-purple-400/10 border-purple-400/20",
  "text-blue-400 bg-blue-400/10 border-blue-400/20",
  "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
  "text-rose-400 bg-rose-400/10 border-rose-400/20",
  "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [addError, setAddError] = useState("");

  const handleToggleVisible = useCallback((id: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === id ? { ...cat, visible: !cat.visible } : cat
      )
    );
  }, []);

  const handleEditStart = useCallback((cat: Category) => {
    setEditingId(cat.id);
    setEditName(cat.name);
  }, []);

  const handleEditSave = useCallback(
    (id: string) => {
      const trimmed = editName.trim();
      if (!trimmed) return;
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === id ? { ...cat, name: trimmed } : cat
        )
      );
      setEditingId(null);
      setEditName("");
    },
    [editName]
  );

  const handleEditCancel = useCallback(() => {
    setEditingId(null);
    setEditName("");
  }, []);

  const handleAddCategory = useCallback(() => {
    const trimmed = newName.trim();
    if (!trimmed) {
      setAddError("Category name cannot be empty.");
      return;
    }
    const duplicate = categories.some(
      (c) => c.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (duplicate) {
      setAddError("A category with this name already exists.");
      return;
    }
    const newCat: Category = {
      id: trimmed.toLowerCase().replace(/\s+/g, "-"),
      name: trimmed,
      count: 0,
      visible: true,
    };
    setCategories((prev) => [...prev, newCat]);
    setNewName("");
    setAddError("");
    setShowAddForm(false);
  }, [newName, categories]);

  const totalProducts = categories.reduce((sum, c) => sum + c.count, 0);
  const visibleCount = categories.filter((c) => c.visible).length;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
              <Tag className="w-4 h-4 text-[#d4af37]" />
            </div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              Category Management
            </h1>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest ml-12">
            Organise your spirits collection
          </p>
        </div>

        <button
          onClick={() => {
            setShowAddForm((v) => !v);
            setNewName("");
            setAddError("");
          }}
          className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-2.5 rounded-xl transition-all duration-200 cursor-pointer"
        >
          {showAddForm ? (
            <>
              <X className="w-4 h-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              Add Category
            </>
          )}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
            Total Categories
          </p>
          <p className="text-3xl font-bold text-white">{categories.length}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
            Visible
          </p>
          <p className="text-3xl font-bold text-green-400">{visibleCount}</p>
        </div>
        <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-5">
          <p className="text-white/30 text-[10px] uppercase tracking-widest mb-2">
            Total Products
          </p>
          <p className="text-3xl font-bold text-[#d4af37]">{totalProducts}</p>
        </div>
      </div>

      {/* Add Category Form */}
      {showAddForm && (
        <div className="bg-[#0d0d0d] border border-[#d4af37]/20 rounded-2xl p-6 shadow-[0_0_30px_rgba(212,175,55,0.06)]">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="w-4 h-4 text-[#d4af37]" />
            <h3 className="text-white font-bold text-base">New Category</h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                placeholder="e.g. Rum, Vodka, Champagne…"
                value={newName}
                autoFocus
                onChange={(e) => {
                  setNewName(e.target.value);
                  setAddError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCategory();
                  if (e.key === "Escape") setShowAddForm(false);
                }}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/[0.02] transition-all"
              />
              {addError && (
                <p className="text-red-400 text-xs mt-2">{addError}</p>
              )}
            </div>
            <button
              onClick={handleAddCategory}
              className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-6 py-3 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
            >
              <Check className="w-4 h-4" />
              Add Category
            </button>
          </div>
          <p className="text-white/20 text-xs mt-3">
            Press Enter to confirm · Esc to cancel
          </p>
        </div>
      )}

      {/* Category Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold">
            All Categories
          </p>
          <p className="text-white/20 text-xs">{categories.length} total</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => {
            const colorClass =
              CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
            const iconColorClass =
              ICON_COLORS[idx % ICON_COLORS.length];
            const isEditing = editingId === cat.id;

            return (
              <div
                key={cat.id}
                className={`relative bg-gradient-to-br ${colorClass} bg-[#0d0d0d] border rounded-2xl p-6 transition-all duration-300 group ${
                  cat.visible
                    ? "opacity-100"
                    : "opacity-50 saturate-0"
                }`}
                style={{ backgroundColor: "#0d0d0d" }}
              >
                {/* Visibility indicator */}
                <div
                  className={`absolute top-4 right-4 w-2 h-2 rounded-full transition-all ${
                    cat.visible ? "bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.6)]" : "bg-white/20"
                  }`}
                />

                {/* Icon */}
                <div
                  className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-4 ${iconColorClass}`}
                >
                  <Box className="w-6 h-6" />
                </div>

                {/* Name (editable) */}
                {isEditing ? (
                  <div className="mb-3">
                    <input
                      autoFocus
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleEditSave(cat.id);
                        if (e.key === "Escape") handleEditCancel();
                      }}
                      className="w-full bg-white/[0.06] border border-[#d4af37]/40 rounded-xl px-3 py-2 text-white font-bold text-lg focus:outline-none focus:border-[#d4af37]/70 transition-all"
                    />
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() => handleEditSave(cat.id)}
                        className="flex items-center gap-1 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <Check className="w-3 h-3" /> Save
                      </button>
                      <button
                        onClick={handleEditCancel}
                        className="flex items-center gap-1 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-xs px-3 py-1.5 rounded-lg transition-all cursor-pointer"
                      >
                        <X className="w-3 h-3" /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <h3 className="text-white font-bold text-xl mb-1 leading-tight">
                    {cat.name}
                  </h3>
                )}

                {/* Product count */}
                <div className="flex items-center gap-1.5 mb-5">
                  <Layers className="w-3.5 h-3.5 text-white/30" />
                  <span className="text-white/40 text-xs">
                    {cat.count} product{cat.count !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Actions */}
                {!isEditing && (
                  <div className="flex items-center gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => handleEditStart(cat)}
                      className="flex items-center gap-1.5 border border-white/[0.08] text-white/40 hover:text-white hover:border-white/20 text-xs px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Rename
                    </button>

                    {/* Visibility toggle */}
                    <button
                      onClick={() => handleToggleVisible(cat.id)}
                      className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                        cat.visible
                          ? "border-green-500/30 text-green-400 hover:bg-red-500/10 hover:border-red-500/30 hover:text-red-400"
                          : "border-white/[0.08] text-white/30 hover:border-green-500/30 hover:text-green-400"
                      }`}
                    >
                      {cat.visible ? (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          Visible
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          Hidden
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add new card prompt */}
          {!showAddForm && (
            <button
              onClick={() => setShowAddForm(true)}
              className="border-2 border-dashed border-white/[0.08] hover:border-[#d4af37]/30 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 text-white/20 hover:text-[#d4af37]/60 transition-all duration-300 cursor-pointer group min-h-[200px]"
            >
              <div className="w-12 h-12 rounded-2xl border-2 border-dashed border-current flex items-center justify-center group-hover:border-[#d4af37]/40 transition-all">
                <Plus className="w-6 h-6" />
              </div>
              <span className="text-sm font-medium">Add New Category</span>
            </button>
          )}
        </div>
      </div>

      {/* Info Note */}
      <div className="bg-[#d4af37]/[0.04] border border-[#d4af37]/10 rounded-2xl px-6 py-4 flex items-start gap-3">
        <Tag className="w-4 h-4 text-[#d4af37]/50 mt-0.5 shrink-0" />
        <p className="text-white/30 text-xs leading-relaxed">
          Categories organise products in the storefront. Hiding a category
          removes it from the customer view without deleting products. Product
          counts reflect items currently assigned to each category.
        </p>
      </div>
    </div>
  );
}
