"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, Check, Upload, Image as ImageIcon } from "lucide-react";

interface HeroImage {
  id: number;
  page: string;
  key: string;
  url: string;
  alt: string;
}

const CARDS_CONFIG = {
  about: [
    { key: "cultural_anchor", label: "Cultural Anchor Card", desc: "First card on the About Page under Our Vision section." },
    { key: "unrivaled_access", label: "Unrivaled Access Card", desc: "Second card on the About Page under Our Vision section." },
    { key: "education_legacy", label: "Education & Legacy Card", desc: "Third card on the About Page under Our Vision section." },
    { key: "story_bottle", label: "Our Story Main Image", desc: "Main heritage bottle image in the Our Story section." }
  ],
  contact: [
    { key: "private_tastings", label: "Private Tastings Card", desc: "First card in the Concierge service selector." },
    { key: "wholesale_trade", label: "Wholesale & Trade Card", desc: "Second card in the Concierge service selector." },
    { key: "boutique_flagship", label: "The Boutique Card", desc: "Third card in the Concierge service selector." }
  ]
};

export default function CardImagesPage() {
  const [images, setImages] = useState<HeroImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"about" | "contact">("about");
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/hero-images");
      const data = await res.json();
      setImages(data);
    } catch {
      showToast("Failed to load images.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, page: string, key: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("file", file);
    try {
      // 1. Upload to cloud / server
      const uploadRes = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData
      });
      const uploadData = await uploadRes.json();
      if (!uploadData.url) {
        showToast("Upload failed: " + (uploadData.error || "unknown error"));
        return;
      }

      // 2. Save in database
      const saveRes = await fetch("/api/admin/hero-images", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ page, key, url: uploadData.url })
      });
      const updatedImage = await saveRes.json();

      setImages(prev => {
        const index = prev.findIndex(x => x.page === page && x.key === key);
        if (index !== -1) {
          return prev.map(x => x.id === updatedImage.id ? updatedImage : x);
        } else {
          return [...prev, updatedImage];
        }
      });
      showToast("Card image updated successfully.");
    } catch {
      showToast("Upload failed.");
    } finally {
      setUploadingKey(null);
    }
  };

  const getImageUrl = (page: string, key: string) => {
    const match = images.find(x => x.page === page && x.key === key);
    return match ? match.url : null;
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Card Images Manager</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Manage illustration images for About and Contact page cards</p>
      </div>

      {/* Tabs Selector */}
      <div className="flex border-b border-white/[0.06] gap-6">
        <button
          onClick={() => setActiveTab("about")}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === "about" ? "text-[#d4af37] border-[#d4af37] text-glow" : "text-white/40 border-transparent hover:text-white"
          }`}
        >
          About Page Cards
        </button>
        <button
          onClick={() => setActiveTab("contact")}
          className={`pb-3 font-semibold text-sm transition-all border-b-2 cursor-pointer ${
            activeTab === "contact" ? "text-[#d4af37] border-[#d4af37] text-glow" : "text-white/40 border-transparent hover:text-white"
          }`}
        >
          Contact Page Cards
        </button>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CARDS_CONFIG[activeTab].map(card => {
            const currentUrl = getImageUrl(activeTab, card.key);
            const isUploading = uploadingKey === card.key;
            return (
              <div key={card.key} className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative aspect-video bg-black flex items-center justify-center p-2 border-b border-white/[0.06]">
                    {currentUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={currentUrl} alt={card.label} className="w-full h-full object-cover opacity-80" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      </>
                    ) : (
                      <div className="text-white/20 flex flex-col items-center gap-2">
                        <ImageIcon className="w-8 h-8" />
                        <span className="text-xs">No image uploaded</span>
                      </div>
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center gap-2">
                        <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />
                        <span className="text-[#d4af37] text-xs font-semibold">Uploading...</span>
                      </div>
                    )}
                  </div>
                  <div className="p-5 text-left">
                    <h3 className="text-white font-bold text-base leading-snug">{card.label}</h3>
                    <p className="text-white/40 text-xs mt-1 leading-relaxed">{card.desc}</p>
                    {currentUrl && (
                      <p className="text-[10px] text-white/20 truncate mt-3 font-mono">Path: {currentUrl}</p>
                    )}
                  </div>
                </div>

                <div className="p-5 pt-0 flex justify-end">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageUpload(e, activeTab, card.key)}
                    disabled={isUploading}
                    className="hidden"
                    id={`file-card-${card.key}`}
                  />
                  <label
                    htmlFor={`file-card-${card.key}`}
                    className="flex items-center gap-2 bg-[#d4af37]/10 hover:bg-[#d4af37]/20 border border-[#d4af37]/20 text-[#d4af37] text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload Image
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-2">
          {toast}
        </div>
      )}
    </div>
  );
}
