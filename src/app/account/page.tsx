"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Check,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  LogOut,
  Calendar,
  Gift,
  Award,
  ChevronRight,
  LockKeyhole,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ParticleField } from "@/components/ParticleField";
import { GlassCard } from "@/components/GlassCard";

export default function AccountPage() {
  const [formMode, setFormMode] = useState<"signin" | "signup" | "forgot">("signin");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Form Fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");

  // Signup Password Strength checklist
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isPasswordValid = hasMinLength && hasNumber && hasUpper && hasSpecial;

  // Logged In Simulated State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    name: "Sir Samuel Ndegwa",
    email: "samuel.ndegwa@kwestcircle.com",
    tier: "Platinum Curation Circle",
    memberNo: "KWC-2026-9812",
    joinedDate: "October 2025",
    allocations: [
      { name: "Macallan Sherry Oak 18 Years", status: "Allocated", qty: 1 },
      { name: "Clase Azul Reposado Tequila", status: "Cellar Dispatch", qty: 2 },
    ],
    invitations: [
      { event: "Private Tasting: Rare Islay Malts", date: "June 15, 2026", location: "Nairobi Flagship Vault" },
    ],
  });

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formMode === "signup") {
      if (password !== confirmPassword) {
        alert("Passwords do not match.");
        return;
      }
      if (!isPasswordValid) {
        alert("Please ensure your password meets all security criteria.");
        return;
      }
    }

    setIsLoading(true);

    // Simulate Network Request
    setTimeout(() => {
      setIsLoading(false);
      if (formMode === "signin" || formMode === "signup") {
        if (formMode === "signup") {
          setCurrentUser((prev) => ({
            ...prev,
            name: fullName || "Noble Guest",
            email: email || "guest@kwestcircle.com",
            tier: "Amber Private Reserve",
            memberNo: `KWC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            joinedDate: "May 2026",
          }));
        }
        setIsLoggedIn(true);
      } else if (formMode === "forgot") {
        alert("A luxury reset link has been dispatched to your email address.");
        setFormMode("signin");
      }
    }, 1500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFullName("");
  };

  return (
    <main className="bg-background min-h-screen flex items-center justify-center relative overflow-hidden pb-[var(--bottom-nav-height)] lg:pb-0">
      {/* Background with subtle gradient & particle overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/40 to-background z-10" />
        <img
          src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000"
          className="w-full h-full object-cover opacity-20 select-none pointer-events-none"
          alt="Luxury Cellar"
        />
      </div>
      <ParticleField count={25} className="z-[5]" />

      {/* ═══ 100vh Main Layout Container ═══ */}
      <div className="relative z-20 w-full max-w-[1280px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-[calc(100vh-var(--bottom-nav-height))] lg:h-screen pt-[var(--bottom-nav-height)] lg:pt-0">
        
        {/* Left Branding Side (Desktop Only) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-center space-y-8 pr-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
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

          {/* Perks checklist */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="space-y-4 pt-4 border-t border-white/[0.06]"
          >
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

        {/* Right Interaction Side (Forms or Profile Dashboard) */}
        <div className="lg:col-span-7 flex justify-center w-full max-h-[85vh] overflow-y-auto no-scrollbar">
          <AnimatePresence mode="wait">
            {!isLoggedIn ? (
              /* AUTH FORMS (SIGNIN, SIGNUP, FORGOT) */
              <motion.div
                key={formMode}
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -35, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-[480px]"
              >
                <GlassCard padding="p-6 sm:p-8" hover={false} glow={true} className="border-primary/10">
                  <form onSubmit={handleAuthSubmit} className="space-y-6">
                    {/* Header */}
                    <div className="text-center">
                      <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
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
                            <input
                              type="text"
                              id="register-fullname"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              placeholder="Noble Guest"
                              className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2"
                            />
                          </div>
                        </div>
                      )}

                      <div className="space-y-1">
                        <label htmlFor="auth-email" className="text-[9px] caps-label text-text-muted">Email Address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                          <input
                            type="email"
                            id="auth-email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="guest@kwestcircle.com"
                            className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-4 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2"
                          />
                        </div>
                      </div>

                      {formMode !== "forgot" && (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <div className="flex justify-between items-center">
                              <label htmlFor="auth-password" className="text-[9px] caps-label text-text-muted">Password</label>
                              {formMode === "signin" && (
                                <button
                                  type="button"
                                  onClick={() => setFormMode("forgot")}
                                  className="text-[9px] text-primary hover:text-white lowercase transition-colors cursor-pointer"
                                >
                                  Forgot Password?
                                </button>
                              )}
                            </div>
                            <div className="relative">
                              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                              <input
                                type={showPassword ? "text" : "password"}
                                id="auth-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••••••"
                                className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-11 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white cursor-pointer"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                              >
                                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>

                          {/* Confirm Password (SignUp Only) */}
                          {formMode === "signup" && (
                            <div className="space-y-1">
                              <label htmlFor="register-confirmpassword" className="text-[9px] caps-label text-text-muted">Confirm Password</label>
                              <div className="relative">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" aria-hidden="true" />
                                <input
                                  type={showPassword ? "text" : "password"}
                                  id="register-confirmpassword"
                                  required
                                  value={confirmPassword}
                                  onChange={(e) => setConfirmPassword(e.target.value)}
                                  placeholder="••••••••••••"
                                  className="w-full bg-black/40 border border-white/[0.08] focus:border-primary/40 focus:outline-none rounded-xl pl-11 pr-11 py-3 text-base md:text-xs text-white placeholder:text-white/20 transition-all focus:shadow-[0_0_15px_rgba(0,240,255,0.05)] border-b-2"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Password strength checks */}
                      {formMode === "signup" && password && (
                        <div className="bg-black/30 border border-white/[0.04] rounded-xl p-3.5 space-y-2.5 text-[10px]">
                          <p className="font-bold text-white/40 uppercase tracking-widest text-[8px] mb-1">Security Standards</p>
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex items-center gap-1.5">
                              {hasMinLength ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <span className={hasMinLength ? "text-white/60" : "text-text-subtle"}>8+ Characters</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasNumber ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <span className={hasNumber ? "text-white/60" : "text-text-subtle"}>Contains Number</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasUpper ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <span className={hasUpper ? "text-white/60" : "text-text-subtle"}>Uppercase Letter</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              {hasSpecial ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <X className="w-3.5 h-3.5 text-destructive" />
                              )}
                              <span className={hasSpecial ? "text-white/60" : "text-text-subtle"}>Special Symbol</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-4 bg-primary text-background font-bold text-xs caps-label tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
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

                    {/* Footer Toggle */}
                    <div className="text-center text-xs text-text-muted pt-2 border-t border-white/[0.04]">
                      {formMode === "signin" && (
                        <p>
                          New to the Cellar?{" "}
                          <button
                            type="button"
                            onClick={() => setFormMode("signup")}
                            className="text-primary hover:text-white font-bold cursor-pointer"
                          >
                            register
                          </button>
                        </p>
                      )}
                      {formMode === "signup" && (
                        <p>
                          Already have credentials?{" "}
                          <button
                            type="button"
                            onClick={() => setFormMode("signin")}
                            className="text-primary hover:text-white font-bold cursor-pointer"
                          >
                            Sign In Here
                          </button>
                        </p>
                      )}
                      {formMode === "forgot" && (
                        <button
                          type="button"
                          onClick={() => setFormMode("signin")}
                          className="text-primary hover:text-white font-bold cursor-pointer"
                        >
                          Back to Log In
                        </button>
                      )}
                    </div>
                  </form>
                </GlassCard>
              </motion.div>
            ) : (
              /* SIMULATED MEMBER PROFILE DASHBOARD */
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 35, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -35, scale: 0.95 }}
                className="w-full max-w-[640px]"
              >
                <GlassCard padding="p-6 sm:p-8" hover={false} glow={true} className="border-primary/15 space-y-6">
                  {/* Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 justify-between border-b border-white/[0.08] pb-6">
                    <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-[0_0_20px_rgba(0,240,255,0.15)]">
                        <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                          <UserIcon className="w-7 h-7 text-white" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-2xl font-serif font-bold text-white">{currentUser.name}</h3>
                        <p className="text-[10px] text-text-muted tracking-wide mt-0.5">{currentUser.email}</p>
                      </div>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border border-white/[0.08] hover:border-destructive/30 hover:text-destructive text-white/40 text-[10px] caps-label rounded-xl transition-all cursor-pointer flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>

                  {/* Membership Specs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4">
                      <div className="flex items-center gap-2 text-[10px] caps-label text-text-muted">
                        <Award className="w-3.5 h-3.5 text-secondary" /> Member Tier
                      </div>
                      <p className="text-base font-bold text-white mt-1 uppercase tracking-tighter">
                        {currentUser.tier}
                      </p>
                    </div>

                    <div className="bg-black/30 border border-white/[0.04] rounded-xl p-4">
                      <div className="flex items-center gap-2 text-[10px] caps-label text-text-muted">
                        <LockKeyhole className="w-3.5 h-3.5 text-primary" /> Cellar Code
                      </div>
                      <p className="text-base font-bold text-primary text-glow mt-1 font-mono">
                        {currentUser.memberNo}
                      </p>
                    </div>
                  </div>

                  {/* Private Allocations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" /> Reserved Allocations
                    </h4>
                    <div className="space-y-3">
                      {currentUser.allocations.map((alloc, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary/20 border border-primary/60 flex items-center justify-center">
                              <div className="w-1 h-1 rounded-full bg-primary" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{alloc.name}</p>
                              <p className="text-[10px] text-text-subtle">Allocation Quantity: {alloc.qty}</p>
                            </div>
                          </div>
                          <span className="px-2.5 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold tracking-wider uppercase">
                            {alloc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Vault Invitations */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-secondary" /> Member Invitations
                    </h4>
                    {currentUser.invitations.map((invite, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl text-xs space-y-2 relative overflow-hidden group"
                      >
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 group-hover:text-primary/20 transition-all">
                          <ChevronRight className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-white font-bold text-sm">{invite.event}</p>
                          <p className="text-text-muted mt-1">{invite.date} • {invite.location}</p>
                        </div>
                        <span className="inline-block text-[9px] font-bold text-secondary uppercase tracking-widest">
                          RSVP Required
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <Link href="/orders" className="block w-full">
                      <button className="w-full py-4 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-bold text-xs caps-label tracking-widest rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2">
                        Track My Orders
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </Link>
                  </div>

                  <div className="pt-2 text-center text-[10px] text-text-subtle">
                    Member since {currentUser.joinedDate} • Powered by Kwest Secure Concierge Systems
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
