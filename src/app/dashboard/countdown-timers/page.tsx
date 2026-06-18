"use client";

import { useState } from "react";
import { Timer, Plus, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

interface CountdownTimer { id: number; label: string; targetDate: string; active: boolean; }

const INITIAL: CountdownTimer[] = [
  { id: 1, label: "Flash Sale — 30% off Gins", targetDate: "2026-06-30T23:59:59Z", active: true },
  { id: 2, label: "Macallan Limited Drop", targetDate: "2026-07-15T12:00:00Z", active: false },
];

function useCountdown(targetDate: string) {
  const target = new Date(targetDate).getTime();
  const now = Date.now();
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff % 86400000) / 3600000);
  const mins = Math.floor((diff % 3600000) / 60000);
  const secs = Math.floor((diff % 60000) / 1000);
  return { days, hours, mins, secs, expired: diff === 0 };
}

function CountdownDisplay({ targetDate }: { targetDate: string }) {
  const { days, hours, mins, secs, expired } = useCountdown(targetDate);
  if (expired) return <span className="text-red-400 text-xs font-bold uppercase tracking-widest">Expired</span>;
  return (
    <div className="flex items-center gap-2 text-sm font-mono">
      {[{ v: days, l: "d" }, { v: hours, l: "h" }, { v: mins, l: "m" }, { v: secs, l: "s" }].map(({ v, l }) => (
        <span key={l} className="bg-white/[0.06] rounded-lg px-2 py-1 text-white text-xs">
          {String(v).padStart(2, "0")}<span className="text-white/30 ml-0.5">{l}</span>
        </span>
      ))}
    </div>
  );
}

export default function CountdownTimersPage() {
  const [timers, setTimers] = useState<CountdownTimer[]>(INITIAL);
  const [newLabel, setNewLabel] = useState("");
  const [newDate, setNewDate] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel || !newDate) return;
    const newTimer: CountdownTimer = { id: Date.now(), label: newLabel, targetDate: new Date(newDate).toISOString(), active: true };
    setTimers(prev => [...prev, newTimer]);
    setNewLabel(""); setNewDate("");
    showToast("Timer created.");
  };

  const handleDelete = (id: number) => { setTimers(prev => prev.filter(t => t.id !== id)); showToast("Timer removed."); };
  const toggleActive = (id: number) => setTimers(prev => prev.map(t => t.id === id ? { ...t, active: !t.active } : t));

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Countdown Timers</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Flash sales and product drop timers</p>
      </div>

      {/* Add Timer */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
        <h2 className="text-white font-semibold text-sm mb-4">Create Timer</h2>
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="timer-label" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Event Label</label>
            <input id="timer-label" type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)} placeholder="Flash Sale — Gins" className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
          </div>
          <div className="flex-1">
            <label htmlFor="timer-date" className="text-[10px] uppercase tracking-widest text-white/40 font-semibold block mb-1.5">Target Date & Time</label>
            <input id="timer-date" type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
          </div>
          <div className="flex items-end">
            <button type="submit" className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] font-bold text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
        </form>
      </div>

      {/* Timers List */}
      <div className="space-y-3">
        {timers.map(t => (
          <div key={t.id} className={`bg-[#0d0d0d] border rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 transition-all ${t.active ? "border-[#d4af37]/20" : "border-white/[0.06] opacity-60"}`}>
            <div className="flex items-center gap-3 shrink-0">
              <div className={`w-2 h-2 rounded-full ${t.active ? "bg-[#d4af37] shadow-[0_0_8px_rgba(212,175,55,0.6)]" : "bg-white/20"}`} />
              <Timer className={`w-5 h-5 ${t.active ? "text-[#d4af37]" : "text-white/30"}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white font-semibold text-sm">{t.label}</p>
              <p className="text-white/30 text-xs mt-0.5">Target: {new Date(t.targetDate).toLocaleString("en-KE")}</p>
            </div>
            <CountdownDisplay targetDate={t.targetDate} />
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => toggleActive(t.id)} className="text-white/40 hover:text-[#d4af37] transition-colors cursor-pointer">
                {t.active ? <ToggleRight className="w-5 h-5 text-[#d4af37]" /> : <ToggleLeft className="w-5 h-5" />}
              </button>
              <button onClick={() => handleDelete(t.id)} className="text-white/30 hover:text-red-400 transition-colors cursor-pointer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {toast && (
        <div className="fixed bottom-6 right-6 bg-[#0d0d0d] border border-[#d4af37]/30 text-[#d4af37] text-sm px-5 py-3 rounded-xl shadow-2xl z-50">{toast}</div>
      )}
    </div>
  );
}
