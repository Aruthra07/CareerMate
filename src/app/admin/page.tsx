'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { GlassCard } from '@/components/GlassCard';
import { useRouter } from 'next/navigation';
import {
  Users, BarChart3, Settings2, ShieldAlert, ShieldCheck, Database,
  ArrowLeft, Terminal, TrendingUp, Sparkles, AlertCircle, RefreshCw
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();

  // Admin states
  const [users, setUsers] = useState<any[]>([
    { id: '1', name: 'John Doe', email: 'john@example.com', role: 'USER', date: '2026-06-06' },
    { id: '2', name: 'Admin Developer', email: 'admin@careermate.ai', role: 'ADMIN', date: '2026-06-06' },
    { id: '3', name: 'Aarav Sharma', email: 'aarav@example.com', role: 'USER', date: '2026-06-05' }
  ]);

  const [systemPrompt, setSystemPrompt] = useState(
    `You are an expert career guidance system. Analyze the user's details (skills, personality, bio) and return a single valid JSON object containing matches, ikigai details, roadmaps, books, and courses.`
  );

  const [dbStats, setDbStats] = useState({
    usersCount: 3,
    profilesCount: 3,
    matchesCount: 12,
    dbConnected: true
  });

  // Promote / Demote User Role
  const toggleUserRole = (id: string) => {
    setUsers(users.map(u => {
      if (u.id === id) {
        const newRole = u.role === 'ADMIN' ? 'USER' : 'ADMIN';
        return { ...u, role: newRole };
      }
      return u;
    }));
  };

  const handleSavePrompt = (e: React.FormEvent) => {
    e.preventDefault();
    alert('System Career engineering prompt updated successfully in active configurations!');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      
      {/* Header bar */}
      <header className="h-16 border-b border-slate-900 bg-slate-950 flex items-center justify-between px-8">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-2 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <span className="text-sm font-bold font-display uppercase tracking-wider text-slate-200">System Admin Control Center</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] text-slate-400 font-bold uppercase">System: Online</span>
        </div>
      </header>

      {/* Admin Panel Workspace */}
      <div className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-8 overflow-y-auto">
        
        {/* Row 1: System Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-5 border-slate-900 bg-slate-950/40" hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Active Users</span>
                <span className="text-xl font-black">{users.length} Registrations</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-slate-900 bg-slate-950/40" hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Database className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Database Status</span>
                <span className="text-xl font-black text-emerald-400">Synced & Active</span>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-5 border-slate-900 bg-slate-950/40" hoverEffect={false}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Matching Hits</span>
                <span className="text-xl font-black">{dbStats.matchesCount} Operations</span>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Row 2: User Role Manager & DB Connection Diagnostics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* User management list */}
          <GlassCard className="lg:col-span-7 p-6 border-slate-900 bg-slate-950/40" hoverEffect={false}>
            <div className="flex justify-between items-center mb-6">
              <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" />
                <span>User Account Administration</span>
              </h4>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-350">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-3 rounded-l-lg">User Name</th>
                    <th className="p-3">Email Address</th>
                    <th className="p-3">Account Role</th>
                    <th className="p-3 rounded-r-lg text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-900/40">
                      <td className="p-3 font-bold text-slate-200">{u.name}</td>
                      <td className="p-3 font-medium">{u.email}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${u.role === 'ADMIN' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-slate-800 text-slate-300'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => toggleUserRole(u.id)}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-750 text-slate-200 rounded font-semibold text-[10px]"
                        >
                          Change Role
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Database Diagnostics log */}
          <GlassCard className="lg:col-span-5 p-6 border-slate-900 bg-slate-950/40" hoverEffect={false}>
            <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2 mb-6">
              <Database className="w-4 h-4 text-emerald-500" />
              <span>Database Sync Logs</span>
            </h4>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Provider Connection:</span>
                  <span className="font-bold text-emerald-500">Connected</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Users in SQL:</span>
                  <span className="font-bold text-white">{dbStats.usersCount} Rows</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Total Career Profiles:</span>
                  <span className="font-bold text-white">{dbStats.profilesCount} Rows</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-blue-500/25 bg-blue-600/5 text-blue-400 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <div className="text-xs">
                  <span className="font-bold block">Developer Note</span>
                  <p className="mt-1 leading-relaxed text-slate-350">
                    Next.js Edge Middleware checks authentication roles locally. Promoting a user to ADMIN dynamically unlocks access to this diagnostics screen.
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

        {/* Row 3: AI Career prompt Config Tune */}
        <GlassCard className="p-6 border-slate-900 bg-slate-950/40" hoverEffect={false}>
          <h4 className="text-sm font-bold font-display text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span>AI Discovery Prompt Engineering</span>
          </h4>
          
          <form onSubmit={handleSavePrompt} className="space-y-4">
            <textarea
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              rows={4}
              className="w-full bg-slate-900 text-slate-100 p-3 rounded-xl border border-slate-850 focus:outline-none focus:border-indigo-500 text-xs leading-relaxed font-mono"
            />
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-500">Changes deploy immediately in the next analysis cycle.</span>
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg text-xs transition-colors"
              >
                Update Career Prompt Settings
              </button>
            </div>
          </form>
        </GlassCard>

      </div>
    </div>
  );
}
