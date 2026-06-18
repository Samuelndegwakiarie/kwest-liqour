"use client";

import { useState, useCallback } from "react";
import {
  Settings,
  Store,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Smartphone,
  Package,
  Truck,
  Check,
  AlertTriangle,
  Save,
  Info,
  ShieldAlert,
} from "lucide-react";

interface StoreSettings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  currency: string;
  mpesaCode: string;
  lowStockThreshold: string;
  freeDeliveryThreshold: string;
}

const DEFAULT_SETTINGS: StoreSettings = {
  storeName: "Kwest Liquor",
  storeEmail: "concierge@kwestliquor.co.ke",
  storePhone: "+254 700 123 456",
  storeAddress: "Muthaiga Road, Nairobi, Kenya",
  currency: "KES",
  mpesaCode: "522522",
  lowStockThreshold: "10",
  freeDeliveryThreshold: "5000",
};

interface FieldConfig {
  key: keyof StoreSettings;
  label: string;
  placeholder: string;
  type?: string;
  icon: React.ReactNode;
  hint?: string;
}

const STORE_FIELDS: FieldConfig[] = [
  {
    key: "storeName",
    label: "Store Name",
    placeholder: "Kwest Liquor",
    icon: <Store className="w-4 h-4" />,
    hint: "Displayed in receipts, emails, and storefront.",
  },
  {
    key: "storeEmail",
    label: "Store Email",
    placeholder: "concierge@kwestliquor.co.ke",
    type: "email",
    icon: <Mail className="w-4 h-4" />,
    hint: "Customer communication and order notifications.",
  },
  {
    key: "storePhone",
    label: "Store Phone",
    placeholder: "+254 700 123 456",
    type: "tel",
    icon: <Phone className="w-4 h-4" />,
    hint: "Support line shown on the storefront.",
  },
  {
    key: "storeAddress",
    label: "Store Address",
    placeholder: "Muthaiga Road, Nairobi, Kenya",
    icon: <MapPin className="w-4 h-4" />,
    hint: "Physical location for pickup orders and receipts.",
  },
  {
    key: "currency",
    label: "Currency",
    placeholder: "KES",
    icon: <DollarSign className="w-4 h-4" />,
    hint: "ISO 4217 currency code (e.g. KES, USD).",
  },
];

const OPERATIONAL_FIELDS: FieldConfig[] = [
  {
    key: "mpesaCode",
    label: "M-Pesa Business Code",
    placeholder: "522522",
    icon: <Smartphone className="w-4 h-4" />,
    hint: "Paybill or till number for STK Push transactions.",
  },
  {
    key: "lowStockThreshold",
    label: "Low Stock Threshold",
    placeholder: "10",
    type: "number",
    icon: <Package className="w-4 h-4" />,
    hint: "Products below this quantity trigger a low-stock alert.",
  },
  {
    key: "freeDeliveryThreshold",
    label: "Free Delivery Threshold (KES)",
    placeholder: "5000",
    type: "number",
    icon: <Truck className="w-4 h-4" />,
    hint: "Orders above this amount qualify for complimentary delivery.",
  },
];

function SettingsSection({
  title,
  subtitle,
  fields,
  values,
  onChange,
}: {
  title: string;
  subtitle: string;
  fields: FieldConfig[];
  values: StoreSettings;
  onChange: (key: keyof StoreSettings, value: string) => void;
}) {
  return (
    <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl overflow-hidden">
      {/* Section Header */}
      <div className="px-6 py-5 border-b border-white/[0.06] bg-white/[0.01]">
        <h2 className="text-white font-bold text-lg">{title}</h2>
        <p className="text-white/30 text-[10px] uppercase tracking-widest mt-0.5">
          {subtitle}
        </p>
      </div>

      <div className="p-6 space-y-5">
        {fields.map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-[10px] uppercase tracking-widest text-white/40 font-semibold flex items-center gap-1.5">
              {field.label}
            </label>
            <div className="relative">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none">
                {field.icon}
              </div>
              <input
                type={field.type ?? "text"}
                value={values[field.key]}
                onChange={(e) => onChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#d4af37]/50 focus:bg-[#d4af37]/[0.02] transition-all"
              />
            </div>
            {field.hint && (
              <p className="text-white/25 text-xs flex items-start gap-1.5 pl-0.5">
                <Info className="w-3 h-3 mt-0.5 shrink-0 text-white/20" />
                {field.hint}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_SETTINGS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showDangerTooltip, setShowDangerTooltip] = useState(false);

  const handleChange = useCallback(
    (key: keyof StoreSettings, value: string) => {
      setSaved(false);
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    // Simulate save delay (replace with actual API call when ready)
    await new Promise<void>((resolve) => setTimeout(resolve, 900));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 4000);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center shrink-0">
              <Settings className="w-4 h-4 text-[#d4af37]" />
            </div>
            <h1 className="text-white font-bold text-2xl tracking-tight">
              System Settings
            </h1>
          </div>
          <p className="text-white/30 text-[10px] uppercase tracking-widest ml-12">
            Configure your store preferences
          </p>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex items-center gap-2 font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200 cursor-pointer disabled:cursor-not-allowed ${
            saved
              ? "bg-green-500/20 border border-green-500/30 text-green-400"
              : "bg-[#d4af37] hover:bg-[#b8960c] text-[#080808] disabled:bg-[#d4af37]/40 disabled:text-[#080808]/40"
          }`}
        >
          {saving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Success Banner */}
      {saved && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-4 flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-green-500/20 border border-green-500/30 flex items-center justify-center shrink-0">
            <Check className="w-4 h-4 text-green-400" />
          </div>
          <div>
            <p className="text-green-400 font-semibold text-sm">
              Settings saved successfully
            </p>
            <p className="text-green-400/50 text-xs mt-0.5">
              Your changes are now live across the platform.
            </p>
          </div>
        </div>
      )}

      {/* Store Information Section */}
      <SettingsSection
        title="Store Information"
        subtitle="Public-facing details and contact info"
        fields={STORE_FIELDS}
        values={settings}
        onChange={handleChange}
      />

      {/* Operational Settings Section */}
      <SettingsSection
        title="Operational Settings"
        subtitle="Payments, inventory & delivery rules"
        fields={OPERATIONAL_FIELDS}
        values={settings}
        onChange={handleChange}
      />

      {/* Quick Preview Card */}
      <div className="bg-[#0d0d0d] border border-white/[0.06] rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Info className="w-4 h-4 text-white/30" />
          <div>
            <p className="text-white/30 text-[10px] uppercase tracking-widest">
              Preview
            </p>
            <h3 className="text-white font-bold text-base">Current Config</h3>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Store", value: settings.storeName },
            { label: "Currency", value: settings.currency },
            {
              label: "Low Stock",
              value: `≤ ${settings.lowStockThreshold} units`,
            },
            {
              label: "Free Delivery",
              value: `≥ KES ${Number(settings.freeDeliveryThreshold).toLocaleString()}`,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white/[0.02] border border-white/[0.04] rounded-xl px-4 py-3"
            >
              <p className="text-white/30 text-[10px] uppercase tracking-widest mb-1">
                {item.label}
              </p>
              <p className="text-white font-semibold text-sm truncate">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button (Bottom) */}
      <div className="flex items-center justify-between gap-4 p-5 bg-[#0d0d0d] border border-white/[0.06] rounded-2xl">
        <div>
          <p className="text-white/50 text-sm font-medium">Ready to apply?</p>
          <p className="text-white/25 text-xs mt-0.5">
            Changes take effect immediately after saving.
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#d4af37] hover:bg-[#b8960c] disabled:bg-[#d4af37]/30 disabled:cursor-not-allowed text-[#080808] disabled:text-[#080808]/40 font-bold text-sm px-7 py-3 rounded-xl transition-all duration-200 cursor-pointer whitespace-nowrap"
        >
          {saving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
              Saving…
            </>
          ) : saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-500/[0.04] border border-red-500/25 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-red-500/15 bg-red-500/[0.03]">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h2 className="text-red-400 font-bold text-base">Danger Zone</h2>
          </div>
          <p className="text-red-400/40 text-[10px] uppercase tracking-widest mt-0.5">
            Irreversible destructive actions
          </p>
        </div>

        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-white/70 font-semibold text-sm">
                Clear All Data
              </p>
              <p className="text-white/30 text-xs mt-1 max-w-md">
                Permanently remove all orders, products, and configuration from
                the database. This action cannot be undone and should only be
                used during development resets.
              </p>
            </div>

            <div className="relative">
              <button
                disabled
                onMouseEnter={() => setShowDangerTooltip(true)}
                onMouseLeave={() => setShowDangerTooltip(false)}
                onFocus={() => setShowDangerTooltip(true)}
                onBlur={() => setShowDangerTooltip(false)}
                className="flex items-center gap-2 border border-red-500/30 bg-red-500/[0.06] text-red-400/40 font-bold text-sm px-5 py-2.5 rounded-xl cursor-not-allowed select-none"
              >
                <AlertTriangle className="w-4 h-4" />
                Clear All Data
              </button>

              {showDangerTooltip && (
                <div className="absolute bottom-full right-0 mb-2 z-10 whitespace-nowrap">
                  <div className="bg-[#1a1a1a] border border-white/[0.08] rounded-xl px-4 py-2.5 shadow-xl">
                    <p className="text-white/60 text-xs font-medium">
                      Contact developer to perform this action
                    </p>
                  </div>
                  <div className="w-2.5 h-2.5 bg-[#1a1a1a] border-r border-b border-white/[0.08] absolute right-5 -bottom-1.5 rotate-45" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
