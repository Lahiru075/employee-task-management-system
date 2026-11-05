import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Check,
  Layers3,
  ShieldCheck,
  Zap,
  ChartNoAxesCombined
} from 'lucide-react';

import { LoginRequest } from '../types/auth';
import { loginUser } from '../service/auth'; 

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Form State
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: ''
  });

  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // dismiss the success message when the user navigates to the login page after registration
  const [successMsg, setSuccessMsg] = useState<string>(
    (location.state as any)?.message || ''
  );

  // Handle inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  // Submit login form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg(''); 
    setLoading(true);

    try {
     
      const res = await loginUser({
        email: formData.email.trim(),
        password: formData.password
      });

      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.data));
        navigate('/dashboard');
      } else {
        setError(res.message || 'Unable to sign in. Please verify your credentials.');
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        'Invalid email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white font-sans selection:bg-indigo-600 selection:text-white">

      {/* ============================================== */}
      {/* FLOATING TOASTS (TOP RIGHT)                    */}
      {/* ============================================== */}

      {/* 1. Dark Glass Error Toast */}
      {error && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-[90%] sm:w-auto bg-[#0B1120]/95 text-white backdrop-blur-xl border border-rose-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-rose-500/20 rounded-2xl p-4 flex items-start gap-3.5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0 text-rose-400 mt-0.5">
            <AlertCircle size={16} />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Action Failed</h4>
            <p className="text-xs text-rose-300/90 mt-0.5 font-medium leading-relaxed">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-lg font-bold leading-none">&times;</span>
          </button>
        </div>
      )}

      {/* 2. Dark Glass Success Toast */}
      {successMsg && !error && (
        <div className="fixed top-6 right-6 z-50 max-w-sm w-[90%] sm:w-auto bg-[#0B1120]/95 text-white backdrop-blur-xl border border-emerald-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.3)] ring-1 ring-emerald-500/20 rounded-2xl p-4 flex items-start gap-3.5 transition-all">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
            <Check size={16} />
          </div>
          <div className="flex-1 pr-2">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">Success</h4>
            <p className="text-xs text-emerald-300/90 mt-0.5 font-medium leading-relaxed">{successMsg}</p>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMsg('')}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <span className="text-lg font-bold leading-none">&times;</span>
          </button>
        </div>
      )}


      {/* ============================================== */}
      {/* LEFT BRANDING PANEL (Desktop only)             */}
      {/* ============================================== */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden bg-[#0B1120] p-12 xl:p-16 flex-col justify-between">

        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-indigo-600/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[140px] pointer-events-none" />

        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
            backgroundSize: '28px 28px'
          }}
        />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Layers3 size={23} className="text-white" />
          </div>

          <div>
            <h2 className="text-white text-xl font-bold tracking-tight">TaskFlow</h2>
            <p className="text-slate-400 text-[10px] tracking-[2px] uppercase font-semibold">
              TASK MANAGEMENT
            </p>
          </div>
        </div>

        {/* Center Presentation Copy */}
        <div className="relative z-10 max-w-xl my-auto py-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-400/20 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-8">
            <Zap size={14} className="text-indigo-400" />
            <span>Smarter teamwork starts here</span>
          </div>

          <h1 className="text-4xl xl:text-6xl font-extrabold text-white leading-[1.15] tracking-tight">
            Manage your work. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-indigo-300 to-violet-400">
              Achieve more.
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-base xl:text-lg leading-8 max-w-lg">
            Bring your team's work together in one place. Organize tasks, track real-time progress, and stay focused on what matters most.
          </p>

          <div className="mt-10 grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-3">
                <ChartNoAxesCombined size={19} className="text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Track Progress</h3>
              <p className="text-slate-400 text-xs mt-1">Monitor sprint tasks easily.</p>
            </div>

            <div className="p-4 rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center mb-3">
                <ShieldCheck size={19} className="text-violet-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Stay Organized</h3>
              <p className="text-slate-400 text-xs mt-1">Keep your team aligned.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-slate-500 text-xs">
          <span>© 2026 TaskFlow. All rights reserved.</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Built for productive teams
          </span>
        </div>
      </div>

      {/* ============================================== */}
      {/* RIGHT LOGIN FORM PANEL                         */}
      {/* ============================================== */}
      <div className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center px-6 py-12 sm:px-12 bg-slate-50 lg:bg-white overflow-y-auto">

        <div className="w-full max-w-md">

          {/* Mobile Only Branding */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Layers3 size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-slate-900 text-lg font-bold">TaskFlow</h2>
              <p className="text-slate-500 text-[10px] uppercase tracking-widest font-semibold">
                Task Management
              </p>
            </div>
          </div>

          {/* Form Header */}
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-5">
              <Lock size={22} className="text-indigo-600" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Welcome back
            </h1>

            <p className="text-slate-500 text-sm mt-2 leading-relaxed">
              Sign in to your account and continue managing your team's work.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email Address */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>

              <div className="relative group">
                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />

                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>

              <div className="relative group">
                <Lock
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors"
                />

                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-all duration-200 hover:border-slate-300 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3.5 flex items-center justify-center gap-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

          </form>

          {/* Register Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-700 hover:underline underline-offset-4 transition-colors"
              >
                Create account
              </Link>
            </p>
          </div>

          {/* Trust Information */}
          <div className="mt-10 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
              <Check size={14} className="text-emerald-500" />
              <span>Simple, organized and productive teamwork</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;