"use client";

import { useState } from "react";
import { Mail, Download, Search, Trash2 } from "lucide-react";

interface Subscriber { id: number; email: string; name: string; date: string; }

const INITIAL: Subscriber[] = [
  { id: 1, email: "samuel.ndegwa@gmail.com", name: "Samuel Ndegwa", date: "2026-06-01" },
  { id: 2, email: "wanjiku.m@outlook.com", name: "Wanjiku M.", date: "2026-06-03" },
  { id: 3, email: "grace.otieno@gmail.com", name: "Grace Otieno", date: "2026-06-10" },
  { id: 4, email: "amina.osei@gmail.com", name: "Amina Osei", date: "2026-06-12" },
  { id: 5, email: "jkamau254@gmail.com", name: "John Kamau", date: "2026-06-15" },
];

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };
  const filtered = subscribers.filter(s => s.email.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = (id: number) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
    showToast("Subscriber removed.");
  };

  const handleExport = () => {
    const csv = ["Name,Email,Date", ...subscribers.map(s => `${s.name},${s.email},${s.date}`)].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "kwest_subscribers.csv"; a.click();
    showToast("Exported to CSV.");
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Newsletter</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">{subscribers.length} subscribers</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 border border-white/[0.08] text-white/60 hover:text-white hover:border-white/20 text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/[0.06]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search subscribers..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              {["Name", "Email", "Subscribed", ""].map(h => (
                <th key={h} className="px-6 py-3 text-left text-[9px] uppercase tracking-widest text-white/30 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/[0.04]">
            {filtered.map(s => (
              <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center">
                      <Mail className="w-3.5 h-3.5 text-[#d4af37]" />
                    </div>
                    <span className="text-white text-sm font-medium">{s.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-white/60 text-sm">{s.email}</td>
                <td className="px-6 py-4 text-white/40 text-xs">{s.date}</td>
                <td className="px-6 py-4 text-right">
                  <button onClick={() => handleDelete(s.id)} className="text-white/20 hover:text-red-400 transition-colors cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-white/20">
            <Mail className="w-8 h-8 mx-auto mb-2" />
            <p className="text-sm">No subscribers found.</p>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
