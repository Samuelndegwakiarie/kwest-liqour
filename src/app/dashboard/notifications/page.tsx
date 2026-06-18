"use client";

import { useState, useEffect } from "react";
import { Bell, CheckCircle, AlertTriangle, Package, Info } from "lucide-react";

interface Notification { id: number; type: string; message: string; date: string; read: boolean; }

const TYPE_CONFIG: Record<string, { icon: typeof Bell; color: string; label: string }> = {
  LOW_STOCK: { icon: AlertTriangle, color: "text-amber-400", label: "Low Stock" },
  ORDER: { icon: Package, color: "text-[#d4af37]", label: "New Order" },
  SYSTEM: { icon: Info, color: "text-blue-400", label: "System" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use static data since we read directly from the mock
    setNotifications([
      { id: 1, type: "LOW_STOCK", message: "Hennessy VS Cognac (Half) is critically low — only 5 units remaining.", date: "2026-06-18T10:00:00Z", read: false },
      { id: 2, type: "ORDER", message: "New order KW-3307-2026 placed by Grace Otieno — KES 8,400.", date: "2026-06-18T17:00:00Z", read: false },
      { id: 3, type: "LOW_STOCK", message: "Don Julio Blanco Tequila stock below threshold — 8 units left.", date: "2026-06-17T09:00:00Z", read: true },
      { id: 4, type: "SYSTEM", message: "M-Pesa callback webhook responded successfully for order KW-9812-2026.", date: "2026-06-18T10:32:00Z", read: true },
    ]);
    setLoading(false);
  }, []);

  const markRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllRead = () => setNotifications(prev => prev.map(n => ({ ...n, read: true })));

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-8 max-w-3xl">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts & Notifications</h1>
          <p className="text-white/40 text-xs uppercase tracking-widest mt-1">System events and stock alerts</p>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="text-[#d4af37] text-xs border border-[#d4af37]/30 px-4 py-2 rounded-xl hover:bg-[#d4af37]/10 transition-all cursor-pointer">
            Mark all read ({unread})
          </button>
        )}
      </div>

      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl divide-y divide-white/[0.04] overflow-hidden">
        {loading ? (
          [...Array(4)].map((_, i) => <div key={i} className="h-20 animate-pulse bg-white/[0.03] m-4 rounded-xl" />)
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-white/20">
            <Bell className="w-10 h-10 mb-3" />
            <p className="text-sm">No notifications</p>
          </div>
        ) : (
          notifications.map(n => {
            const cfg = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.SYSTEM;
            const Icon = cfg.icon;
            return (
              <div key={n.id} className={`flex items-start gap-4 px-6 py-5 transition-all ${n.read ? "opacity-50" : "bg-white/[0.01]"}`}>
                <div className={`mt-0.5 shrink-0 ${cfg.color}`}><Icon className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-sm leading-relaxed">{n.message}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className={`text-[9px] uppercase tracking-widest font-bold ${cfg.color}`}>{cfg.label}</span>
                    <span className="text-white/20 text-xs">{new Date(n.date).toLocaleString("en-KE")}</span>
                  </div>
                </div>
                {!n.read && (
                  <button onClick={() => markRead(n.id)} className="shrink-0 text-white/30 hover:text-[#d4af37] transition-colors cursor-pointer" title="Mark as read">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
