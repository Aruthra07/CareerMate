'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/GlassCard';
import { BrainCircuit, Mail, Lock, User, Eye, EyeOff, Sparkles } from 'lucide-react';
import Link from 'next/link';

function LoginContent() {
  const { login, signup, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Switch tabs based on callback
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signup') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  // If already authenticated, redirect
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password || (!isLogin && !name)) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const res = await login(email, password);
        if (res.success) {
          // Check if profile exists (api me or local fallback check)
          const checkRes = await fetch('/api/onboarding');
          if (checkRes.ok) {
            const data = await checkRes.json();
            if (data.profile) {
              router.push('/dashboard');
            } else {
              router.push('/onboarding');
            }
          } else {
            router.push('/onboarding');
          }
        } else {
          setError(res.error || 'Invalid credentials');
        }
      } else {
        const res = await signup(name, email, password);
        if (res.success) {
          router.push('/onboarding');
        } else {
          setError(res.error || 'Failed to sign up');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950 p-4">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2 group mb-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <span className="text-2xl font-bold font-display text-white">
              CareerMate<span className="text-blue-400">.AI</span>
            </span>
          </Link>
          <p className="text-slate-400 text-xs text-center">Your AI-Powered Career Planning Platform</p>
        </div>

        {/* Auth Card */}
        <GlassCard className="p-8 border-slate-800 bg-slate-950/40 shadow-2xl relative" hoverEffect={false}>
          <div className="flex justify-center border-b border-slate-800 mb-6">
            <button
              onClick={() => { setIsLogin(true); setError(''); }}
              className={`pb-3 text-xs uppercase font-bold tracking-wider px-6 transition-colors ${isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
              id="auth-tab-login"
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(''); }}
              className={`pb-3 text-xs uppercase font-bold tracking-wider px-6 transition-colors ${!isLogin ? 'text-blue-400 border-b-2 border-blue-500' : 'text-slate-400 hover:text-slate-200'}`}
              id="auth-tab-signup"
            >
              Register
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-950/30 border border-red-500/40 rounded-xl text-red-400 text-xs font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Input Name for signup */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-slate-900/60 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    required={!isLogin}
                    id="signup-name-input"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-900/60 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                  required
                  id="auth-email-input"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Password</label>
                {isLogin && (
                  <button
                    type="button"
                    onClick={() => alert('Mock password reset triggered. Please use standard logging options.')}
                    className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900/60 text-white pl-10 pr-10 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                  required
                  id="auth-password-input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/35 transition-all flex items-center justify-center gap-2 text-xs"
              id="auth-submit-btn"
            >
              {loading ? (
                <span>{isLogin ? 'Signing In...' : 'Registering...'}</span>
              ) : (
                <>
                  <span>{isLogin ? 'Sign In to Dashboard' : 'Create Account'}</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Social Sign In Mock */}
          <div className="mt-6 pt-6 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider block mb-3">Or continue with</span>
            <button
              onClick={() => {
                setLoading(true);
                setTimeout(() => {
                  login('demo@careermate.ai', 'password123');
                }, 800);
              }}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 text-white rounded-xl border border-slate-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              id="auth-google-btn"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.415 0-6.19-2.775-6.19-6.19 0-3.415 2.775-6.19 6.19-6.19 1.488 0 2.851.531 3.914 1.408l3.056-3.056C18.885 2.11 15.789 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.16 0 10.742-4.324 10.742-10.925 0-.672-.06-1.31-.17-1.928H12.24z" />
              </svg>
              <span>Instant Google Login Demo</span>
            </button>
          </div>
        </GlassCard>

      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
