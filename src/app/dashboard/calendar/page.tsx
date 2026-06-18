"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";

interface CalendarEvent { id: number; title: string; date: string; type: string; color: string; }

const INITIAL_EVENTS: CalendarEvent[] = [
  { id: 1, title: "Macallan Restock", date: "2026-07-05", type: "Restock", color: "#d4af37" },
  { id: 2, title: "Gin Flash Sale Start", date: "2026-06-30", type: "Event", color: "#22c55e" },
  { id: 3, title: "Hennessy XO Launch", date: "2026-07-20", type: "Launch", color: "#00f0ff" },
];

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

export default function CalendarPage() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState("Event");
  const [showForm, setShowForm] = useState(false);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1);

  const prev = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const next = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const getEventsForDay = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter(e => e.date === dateStr);
  };

  const typeColors: Record<string, string> = { "Event": "#d4af37", "Restock": "#d4af37", "Launch": "#00f0ff", "Other": "#a855f7" };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !newTitle) return;
    setEvents(prev => [...prev, { id: Date.now(), title: newTitle, date: selectedDate, type: newType, color: typeColors[newType] || "#d4af37" }]);
    setNewTitle(""); setShowForm(false);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Schedule & Calendar</h1>
        <p className="text-white/40 text-xs uppercase tracking-widest mt-1">Product launches, restocks, and events</p>
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <button onClick={prev} className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/[0.04]"><ChevronLeft className="w-5 h-5" /></button>
          <h2 className="text-white font-bold text-lg">{MONTHS[month]} {year}</h2>
          <button onClick={next} className="p-2 text-white/40 hover:text-white transition-colors cursor-pointer rounded-lg hover:bg-white/[0.04]"><ChevronRight className="w-5 h-5" /></button>
        </div>

        {/* Day names */}
        <div className="grid grid-cols-7 border-b border-white/[0.06]">
          {DAYS.map(d => <div key={d} className="py-2 text-center text-[9px] uppercase tracking-widest text-white/30 font-semibold">{d}</div>)}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 divide-x divide-white/[0.04]">
          {cells.map((day, i) => {
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const dayEvents = day ? getEventsForDay(day) : [];
            const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
            const isSelected = dateStr === selectedDate;
            return (
              <div
                key={i}
                onClick={() => day ? setSelectedDate(dateStr) : null}
                className={`min-h-[80px] p-2 border-b border-white/[0.04] transition-colors ${day ? "cursor-pointer hover:bg-white/[0.02]" : ""} ${isSelected ? "bg-[#d4af37]/10" : ""}`}
              >
                {day && (
                  <>
                    <span className={`text-xs font-medium inline-flex w-6 h-6 items-center justify-center rounded-full ${isToday ? "bg-[#d4af37] text-[#080808] font-bold" : "text-white/60"}`}>{day}</span>
                    <div className="mt-1 space-y-0.5">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div key={ev.id} className="text-[8px] font-medium px-1.5 py-0.5 rounded truncate" style={{ backgroundColor: `${ev.color}22`, color: ev.color }}>{ev.title}</div>
                      ))}
                      {dayEvents.length > 2 && <div className="text-[8px] text-white/30">+{dayEvents.length - 2} more</div>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Panel */}
      {selectedDate && (
        <div className="bg-[#0d0d0d] border border-[#d4af37]/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">{new Date(selectedDate + "T00:00:00").toLocaleDateString("en-KE", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-[#d4af37] text-[#080808] font-bold text-xs px-3 py-1.5 rounded-lg cursor-pointer hover:bg-[#b8960c] transition-all">
                <Plus className="w-3.5 h-3.5" /> Add Event
              </button>
              <button onClick={() => setSelectedDate(null)} className="text-white/30 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
          </div>

          {showForm && (
            <form onSubmit={handleAddEvent} className="flex items-end gap-3 mb-4 p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
              <div className="flex-1">
                <input type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Event title..." className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 transition-all" required />
              </div>
              <select value={newType} onChange={e => setNewType(e.target.value)} className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#d4af37]/50">
                {["Event", "Restock", "Launch", "Other"].map(t => <option key={t} value={t} className="bg-[#0d0d0d]">{t}</option>)}
              </select>
              <button type="submit" className="bg-[#d4af37] text-[#080808] font-bold text-sm px-4 py-2 rounded-lg cursor-pointer hover:bg-[#b8960c] transition-all">Save</button>
            </form>
          )}

          {getEventsForDay(new Date(selectedDate + "T00:00:00").getDate()).length === 0 ? (
            <p className="text-white/30 text-sm">No events on this day.</p>
          ) : (
            <div className="space-y-2">
              {getEventsForDay(new Date(selectedDate + "T00:00:00").getDate()).map(ev => (
                <div key={ev.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: `${ev.color}11`, borderLeft: `3px solid ${ev.color}` }}>
                  <span className="text-sm font-medium" style={{ color: ev.color }}>{ev.title}</span>
                  <span className="text-xs text-white/30 ml-auto">{ev.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
