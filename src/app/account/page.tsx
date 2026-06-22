"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Phone,
  Pencil,
  Camera,
  Save,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleField } from "@/components/ParticleField";
import { GlassCard } from "@/components/GlassCard";

export default function AccountPage() {
  const router = useRouter();

  // ── Auth form state ──────────────────────────────────────────────────────
  const [formMode, setFormMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Password strength
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUpper && hasSpecial;

  // ── Session / user state ─────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>({
    name: "",
    email: "",
    phone: "",
    avatar: null,
    tier: "Amber Private Reserve",
    memberNo: "KWC-2026-0000",
    joinedDate: "May 2026",
  });

  // ── Editable profile state ───────────────────────────────────────────────
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAvatar, setEditAvatar] = useState<string | null>(null);

  // ── Helpers ──────────────────────────────────────────────────────────────
  const seedEditFields = (u: any) => {
    setEditName(u.name || "");
    setEditEmail(u.email || "");
    setEditPhone(u.phone || "");
    setEditAvatar(u.avatar || null);
  };

  const redirectAfterAuth = () => {
    try {
      const raw = localStorage.getItem("kwest_cart");
      const items = raw ? JSON.parse(raw) : [];
      router.push(Array.isArray(items) && items.length > 0 ? "/cart" : "/products");
    } catch {
      router.push("/products");
    }
  };

  // ── On mount: restore session ────────────────────────────────────────────
  useEffect(() => {
    const adminSession = sessionStorage.getItem("kwest_admin") === "authenticated";
    const userSession = localStorage.getItem("kwest_user");
    if (adminSession) {
      const u = {
        name: "Vault Manager",
        email: "admin@kwestliquor.co.ke",
        phone: "",
        avatar: null,
        tier: "Grand Cellar Administrator",
        memberNo: "ADMIN-0001",
        joinedDate: "January 2026",
      };
      setCurrentUser(u);
      seedEditFields(u);
      setIsLoggedIn(true);
    } else if (userSession) {
      try {
        const parsed = JSON.parse(userSession);
        setCurrentUser(parsed);
        seedEditFields(parsed);
        setIsLoggedIn(true);
      } catch {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // ── Auth submit ──────────────────────────────────────────────────────────
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "signup") {
      if (password !== confirmPassword) { alert("Passwords do not match."); return; }
      if (!isPasswordValid) { alert("Please ensure your password meets all security criteria."); return; }
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (formMode === "signin") {
        if (email === "admin@kwestliquor.co.ke" && password === "kwest2026") {
          sessionStorage.setItem("kwest_admin", "authenticated");
          const u = { name: "Vault Manager", email, phone: "", avatar: null, tier: "Grand Cellar Administrator", memberNo: "ADMIN-0001", joinedDate: "January 2026" };
          setCurrentUser(u); seedEditFields(u); setIsLoggedIn(true);
          router.push("/dashboard");
          return;
        }
        const u = { name: "Sam K", email: email || "sammiek@gmail.com", phone: "", avatar: null, tier: "Amber Private Reserve", memberNo: `KWC-2026-${Math.floor(1000 + Math.random() * 9000)}`, joinedDate: "May 2026" };
        localStorage.setItem("kwest_user", JSON.stringify(u));
        setCurrentUser(u); seedEditFields(u); setIsLoggedIn(true);
        redirectAfterAuth();
      } else if (formMode === "signup") {
        const u = { name: fullName || "Noble Guest", email: email || "guest@kwestcircle.com", phone: "", avatar: null, tier: "Amber Private Reserve", memberNo: `KWC-2026-${Math.floor(1000 + Math.random() * 9000)}`, joinedDate: "May 2026" };
        localStorage.setItem("kwest_user", JSON.stringify(u));
        setCurrentUser(u); seedEditFields(u); setIsLoggedIn(true);
        redirectAfterAuth();
      } else if (formMode === "forgot") {
        alert("A luxury reset link has been dispatched to your email address.");
        setFormMode("signin");
      }
    }, 1500);
  };

  // ── Profile save ─────────────────────────────────────────────────────────
  const handleSaveProfile = () => {
    const updated = { ...currentUser, name: editName.trim() || currentUser.name, email: editEmail.trim() || currentUser.email, phone: editPhone.trim(), avatar: editAvatar };
    localStorage.setItem("kwest_user", JSON.stringify(updated));
    setCurrentUser(updated);
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditAvatar(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kwest_admin");
    localStorage.removeItem("kwest_user");
    setIsLoggedIn(false);
    setEmail(""); setPassword(""); setConfirmPassword(""); setFullName("");
    router.push("/");
  };

  // ────────────────────────────────────────────────────────────────────────
  return (
    <main className="bg-background min-h-screen relative overflow-x-hidden pb-[calc(var(--bottom-nav-height)+2rem)] lg:pb-16">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/40 to-background z-10" />
        <Image
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80"
          fill
          className="object-cover opacity-20 select-none pointer-events-none"
          alt="Luxury Cellar"
          sizes="100vw"
          quality={60}
        />
      </div>
      <ParticleField count={25} className="z-[5]" />

      {/* ── Page grid — top padding accounts for fixed navbar on all screen sizes ── */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
           style={{ paddingTop: "calc(var(--navbar-height, 72px) + 2rem)" }}
      >

        {/* ── Left branding (desktop only) ── */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 pr-12 lg:sticky lg:top-24 lg:self-start">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="h-[1px] w-8 bg-primary/60" />
              <span className="caps-label text-primary text-[9px]">KWEST MEMBERSHIP</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-serif font-bold text-white tracking-tighter leading-none">
              The <span className="gradient-text-static">Circle</span>
            </h1>
            <p className="text-text-muted text-sm leading-relaxed max-w-md">
              Unlocking privileged access to Nairobi&apos;s most exclusive cellar allocations, private member events, and bespoke sommelier-guided tasting sessions.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="space-y-4 pt-4 border-t border-white/[0.06]">
            {[
              { title: "Priority Allocations", desc: "First rights to limited global releases and rare single malts." },
              { title: "Sommelier Consultation", desc: "Bespoke procurement and cellar management assistance." },
              { title: "Private Vault Events", desc: "Invitations to masterclasses led by brand ambassadors." },
            ].map((perk, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{perk.title}</h4>
                  <p className="text-[11px] text-text-subtle mt-0.5">{perk.desc}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── Right: form or profile ── */}
        <div className="lg:col-span-7 flex justify-center w-full pb-10 lg:pb-16">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              /* ══ AUTH FORMS ══ */
              <motion.div
                key={formMode}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -35, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-[480px]"
              >
                <GlassCard padding="p-5 sm:p-8" hover={false} glow={true} className="border-primary/10">

                  <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="text-center mb-2">
                      <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                        {formMode === "signin" && "Sign In"}
                        {formMode === "signup" && "Join The Circle"}
                        {formMode === "forgot" && "Recover Access"}
                      </h2>
                      <p className="text-[10px] caps-label text-text-muted tracking-widest mt-1.5">
                        {formMode === "signin" && "Secure Cellar Portal"}
                        {formMode === "signup" && "Bespoke Spirits Curation"}
                        {formMode === "forgot" && "Concierge Credentials"}
                      </p>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      {formMode === "signup" && (
                        <div className="space-y-1">
                          <label htmlFor="register-fullname" className="text-[9px] caps-label text-text-muted">Full Name</label>
                          <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                            <input type="text" id="register-fullname" required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Noble Guest" className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2" />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label htmlFor="auth-email" className="text-[9px] caps-label text-text-muted">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                          <input type="email" id="auth-email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="guest@kwestcircle.com" className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2" />
                        </div>
                      </div>

                      {formMode !== "forgot" && (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label htmlFor="auth-password" className="text-[9px] caps-label text-text-muted">Password</label>
                              {formMode === "signin" && (
                                <button type="button" onClick={() => setFormMode("forgot")} className="text-[9px] text-primary hover:text-white lowercase transition-colors cursor-pointer">Forgot Password?</button>
                              )}
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                              <input type={showPassword ? "text" : "password"} id="auth-password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-11 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2" />
                              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white cursor-pointer" aria-label={showPassword ? "Hide password" : "Show password"}>
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {formMode === "signup" && (
                            <div className="space-y-1">
                              <label htmlFor="register-confirmpassword" className="text-[9px] caps-label text-text-muted">Confirm Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                                <input type={showPassword ? "text" : "password"} id="register-confirmpassword" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••••••" className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-11 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2" />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {formMode === "signup" && password && (
                        <div className="bg-black/30 border border-white/[0.04] rounded-xl p-3.5 space-y-2.5 text-[10px]">
                          <p className="font-bold text-white/40 uppercase tracking-widest text-[8px] mb-1">Security Standards</p>
                          <div className="grid grid-cols-2 gap-2">
                            {[
                              { ok: hasMinLength, label: "8+ Characters" },
                              { ok: hasNumber, label: "Contains Number" },
                              { ok: hasUpper, label: "Uppercase Letter" },
                              { ok: hasSpecial, label: "Special Symbol" },
                            ].map(({ ok, label }) => (
                              <div key={label} className="flex items-center gap-1.5">
                                {ok ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <X className="w-3.5 h-3.5 text-destructive" />}
                                <span className={ok ? "text-white/60" : "text-text-subtle"}>{label}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <button type="submit" disabled={isLoading} className="w-full py-3.5 sm:py-4 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]">
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          {formMode === "signin" && "login"}
                          {formMode === "signup" && "register"}
                          {formMode === "forgot" && "Request Reset Link"}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    <div className="text-center text-xs text-text-muted pt-2 border-t border-white/[0.04]">
                      {formMode === "signin" && (
                        <p>New to the Cellar?{" "}<button type="button" onClick={() => setFormMode("signup")} className="text-primary hover:text-white font-bold cursor-pointer">register</button></p>
                      )}
                      {formMode === "signup" && (
                        <p>Already have credentials?{" "}<button type="button" onClick={() => setFormMode("signin")} className="text-primary hover:text-white font-bold cursor-pointer">Sign In Here</button></p>
                      )}
                      {formMode === "forgot" && (
                        <button type="button" onClick={() => setFormMode("signin")} className="text-primary hover:text-white font-bold cursor-pointer">Back to Log In</button>
                      )}
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            ) : (
              /* ══ EDITABLE PROFILE CARD ══ */
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -35, scale: 0.95 }}
                className="w-full max-w-[480px]"
              >
                <GlassCard padding="p-5 sm:p-8" hover={false} glow={true} className="border-primary/15 space-y-5 sm:space-y-6">

                  {/* ── Avatar ── */}
                  <div className="flex flex-col items-center gap-3 pb-2">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-[0_0_25px_rgba(0,240,255,0.2)]">
                        <div className="w-full h-full rounded-full bg-background overflow-hidden flex items-center justify-center">
                          {editAvatar ? (
                            <img src={editAvatar} alt="Profile" className="w-full h-full object-cover" />
                          ) : (
                            <UserIcon className="w-10 h-10 text-white/40" />
                          )}
                        </div>
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.4)] hover:scale-110 transition-transform"
                        title="Change photo"
                      >
                        <Camera className="w-4 h-4 text-background" />
                      </label>
                      <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                    </div>
                    <div className="text-center">
                      <p className="text-white font-bold text-lg font-serif">{currentUser.name || "Member"}</p>
                      <p className="text-[10px] text-primary/70 font-mono tracking-wider">{currentUser.memberNo}</p>
                    </div>
                  </div>

                  {/* ── Editable fields ── */}
                  <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] caps-label text-text-muted flex items-center gap-1.5">
                        <UserIcon className="w-3 h-3" /> Full Name
                      </label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        disabled={!isEditing}
                        placeholder="Your full name"
                        className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all border min-h-[48px] ${
                          isEditing
                            ? "bg-black/40 border-primary/30 focus:border-primary/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                            : "bg-white/[0.03] border-white/[0.06] cursor-default"
                        }`}
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] caps-label text-text-muted flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> Email Address
                      </label>
                      <input
                        type="email"
                        value={editEmail}
                        onChange={(e) => setEditEmail(e.target.value)}
                        disabled={!isEditing}
                        placeholder="your@email.com"
                        className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all border min-h-[48px] ${
                          isEditing
                            ? "bg-black/40 border-primary/30 focus:border-primary/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                            : "bg-white/[0.03] border-white/[0.06] cursor-default"
                        }`}
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] caps-label text-text-muted flex items-center gap-1.5">
                        <Phone className="w-3 h-3" /> Phone Number
                      </label>
                      <input
                        type="tel"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        disabled={!isEditing}
                        placeholder="+254 7XX XXX XXX"
                        className={`w-full rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/20 outline-none transition-all border min-h-[48px] ${
                          isEditing
                            ? "bg-black/40 border-primary/30 focus:border-primary/60 focus:shadow-[0_0_12px_rgba(0,240,255,0.08)]"
                            : "bg-white/[0.03] border-white/[0.06] cursor-default"
                        }`}
                      />
                    </div>
                  </div>

                  {/* ── Action buttons ── */}
                  <div className="flex flex-col sm:flex-row gap-3 mt-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveProfile}
                          className="flex-1 py-3.5 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                        >
                          <Save className="w-3.5 h-3.5" /> Save Changes
                        </button>
                        <button
                          onClick={() => {
                            setIsEditing(false);
                            setEditName(currentUser.name);
                            setEditEmail(currentUser.email);
                            setEditPhone(currentUser.phone || "");
                            setEditAvatar(currentUser.avatar || null);
                          }}
                          className="sm:w-auto py-3.5 px-5 border border-white/[0.08] hover:border-white/20 text-white/40 hover:text-white text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center min-h-[48px]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex-1 py-3.5 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-bold text-xs caps-label tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px]"
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit Profile
                      </button>
                    )}
                    <button
                      onClick={handleLogout}
                      className="sm:w-auto py-3.5 px-5 border border-white/[0.08] hover:border-red-500/30 hover:text-red-400 text-white/40 text-xs rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 min-h-[48px] whitespace-nowrap"
                    >
                      <LogOut className="w-3.5 h-3.5" /> Sign Out
                    </button>
                  </div>

                  {/* Save success toast */}
                  <AnimatePresence>
                    {saveSuccess && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl px-4 py-3"
                      >
                        <Check className="w-4 h-4" /> Profile saved successfully!
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Quick links */}
                  <div className="border-t border-white/[0.06] pt-4">
                    <Link
                      href="/orders"
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] hover:border-primary/20 transition-all group"
                    >
                      <span className="text-xs font-bold text-white/70 group-hover:text-white caps-label tracking-wider">Track My Orders</span>
                      <ArrowRight className="w-3.5 h-3.5 text-primary/50 group-hover:text-primary transition-colors" />
                    </Link>
                  </div>

                  <p className="text-center text-[10px] text-white/15">
                    Member since {currentUser.joinedDate} · Powered by Kwest Secure Concierge Systems
                  </p>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}