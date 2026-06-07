'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { Globe, User, LogOut, LayoutDashboard, BrainCircuit } from 'lucide-react';

export function Navbar() {
  const { user, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLang = () => {
    setLanguage(language === 'EN' ? 'HI' : 'EN');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold font-display bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300">
            CareerMate<span className="text-blue-500">.AI</span>
          </span>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          
          {/* Language Toggle Button */}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-all"
            title="Switch Language / भाषा बदलें"
            id="lang-toggle"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'Hindi' : 'English'}</span>
          </button>

          {/* Authentication State */}
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/overview"
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-md shadow-blue-600/10 hover:shadow-blue-600/20 transition-all"
                id="navbar-dashboard-btn"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t('dashboard.menu.overview')}</span>
              </Link>
              
              {/* Profile Snap */}
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 bg-slate-100 dark:bg-slate-900 rounded-lg border border-slate-200/30 dark:border-slate-800/30">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs font-medium text-slate-750 dark:text-slate-350">{user.name}</span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className="p-2 text-slate-500 hover:text-red-500 hover:bg-red-50/10 dark:hover:bg-red-950/10 rounded-lg transition-colors"
                title="Log Out"
                id="navbar-logout-btn"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-semibold text-slate-750 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 transition-colors"
                id="navbar-login-btn"
              >
                Sign In
              </Link>
              <Link
                href="/login?tab=signup"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/10 transition-all"
                id="navbar-signup-btn"
              >
                {t('landing.cta.start')}
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
