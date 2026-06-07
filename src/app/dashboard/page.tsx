'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/GlassCard';
import { IkigaiDiagram } from '@/components/IkigaiDiagram';
import {
  LayoutDashboard, Target, Map, Compass, Calendar, TrendingUp, BookOpen,
  GraduationCap, Globe, Users, MessageSquare, Settings, LogOut, BrainCircuit,
  Zap, Award, Clock, Flame, ShieldAlert, Sparkles, Send, Plus, CheckSquare,
  FileDown, ShieldCheck, Database, Video, Star, ThumbsUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Dashboard() {
  const { user, logout, setMockUser } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);

  // App statistics states (dynamic)
  const [streak, setStreak] = useState(4);
  const [hoursStudied, setHoursStudied] = useState(18.5);
  const [skillsLearned, setSkillsLearned] = useState(3);
  const [completedRoadmapTasks, setCompletedRoadmapTasks] = useState<string[]>([]);
  
  // Custom Planner state
  const [tasks, setTasks] = useState<any[]>([
    { id: '1', title: 'Complete HTML/CSS foundation modules', date: '2026-06-06', isCompleted: true, type: 'DAILY' },
    { id: '2', title: 'Set up GitHub portfolio repo', date: '2026-06-06', isCompleted: false, type: 'DAILY' },
    { id: '3', title: 'Read Chapter 2 of Atomic Habits', date: '2026-06-07', isCompleted: false, type: 'DAILY' }
  ]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // AI Coach state
  const [chatMessages, setChatMessages] = useState<any[]>([
    { role: 'assistant', message: 'Hello! I am your AI Career Coach. Ask me anything about your roadmap, skill acquisition, or how to prepare for interviews.' }
  ]);
  const [coachInput, setCoachInput] = useState('');
  const [coachLoading, setCoachLoading] = useState(false);

  // Community State
  const [forumPosts, setForumPosts] = useState<any[]>([
    { id: 'f1', userName: 'Aarav Sharma', title: 'Any tips on AWS Developer Associate exam prep?', content: 'Hey guys, starting my study guide for AWS Cloud Practitioner and Developer Associate. Which courses are most relevant?', groupName: 'Tech', likes: 4, comments: '[]', createdAt: '2026-06-06T10:00:00.000Z' },
    { id: 'f2', userName: 'Neha Patil', title: 'UX Design Case Study templates', content: 'Sharing my custom case study template for product design portfolio presentation. Let me know if you want the Notion link.', groupName: 'Creative', likes: 8, comments: '[]', createdAt: '2026-06-05T12:00:00.000Z' }
  ]);
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [postGroup, setPostGroup] = useState('Tech');

  // Emergency Motivation State
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [emergencyAffirmation, setEmergencyAffirmation] = useState('');
  const [emergencyLoading, setEmergencyLoading] = useState(false);

  // Db State tracking
  const [dbStatus, setDbStatus] = useState<any>({ connected: true, provider: 'SQLite (dev.db)' });

  // Fetch Onboarding Data
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch('/api/onboarding');
        if (res.ok) {
          const data = await res.json();
          if (data.profile) {
            setProfileData(data);
          } else {
            router.push('/onboarding');
          }
        } else {
          // If profile is missing locally in mock mode
          router.push('/onboarding');
        }
      } catch (err) {
        console.warn('API error during dashboard load, routing to onboarding fallback if profile missing');
        const localUser = localStorage.getItem('careermate_user');
        if (!localUser) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();

    // Check DB Status
    fetch('/api/api-auth').then(r => r.json()).catch(() => {});
  }, [router]);

  // Load chat and posts
  useEffect(() => {
    if (activeTab === 'coach') {
      fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-chats' })
      })
      .then(r => r.json())
      .then(data => {
        if (data.chats && data.chats.length > 0) {
          setChatMessages(data.chats);
        }
      }).catch(() => {});
    }

    if (activeTab === 'community') {
      fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get-posts' })
      })
      .then(r => r.json())
      .then(data => {
        if (data.posts && data.posts.length > 0) {
          setForumPosts(data.posts);
        }
      }).catch(() => {});
    }
  }, [activeTab]);

  // Handle task check off
  const handleToggleTask = async (id: string, isCompleted: boolean) => {
    // Optimistic toggle
    setTasks(tasks.map(t => t.id === id ? { ...t, isCompleted } : t));
    
    // Confetti celebration if completing!
    if (isCompleted) {
      confetti({ particleCount: 60, spread: 50, origin: { y: 0.8 } });
      setStreak(prev => prev + 1);
    }

    try {
      await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle-task', payload: { id, isCompleted } })
      });
    } catch (e) {
      console.warn('Failed to update task online, updated locally');
    }
  };

  // Create custom task
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const newT = { title: newTaskTitle, date: todayStr, type: 'DAILY', durationMinutes: 30 };

    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add-task', payload: newT })
      });
      if (res.ok) {
        const data = await res.json();
        setTasks([...tasks, data.task]);
      } else {
        // Fallback add
        setTasks([...tasks, { id: 'mock-' + Math.random(), ...newT, isCompleted: false }]);
      }
    } catch (err) {
      setTasks([...tasks, { id: 'mock-' + Math.random(), ...newT, isCompleted: false }]);
    }
    setNewTaskTitle('');
  };

  // Coach prompt
  const handleCoachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coachInput.trim()) return;

    const userMsg = coachInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', message: userMsg }]);
    setCoachInput('');
    setCoachLoading(true);

    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'coach-chat', payload: { message: userMsg } })
      });
      if (res.ok) {
        const data = await res.json();
        setChatMessages(prev => [...prev, { role: 'assistant', message: data.reply }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', message: "I'm running in offline demo mode. Continue studying CSS Grid, Git structure, and AWS fundamentals as planned!" }]);
      }
    } catch (err) {
      setChatMessages(prev => [...prev, { role: 'assistant', message: "Focus on finalizing your AWS cloud certifications and publishing your portfolio. Reach out if you get stuck!" }]);
    } finally {
      setCoachLoading(false);
    }
  };

  // Community Post creation
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim() || !postContent.trim()) return;

    const newP = { title: postTitle, content: postContent, groupName: postGroup };

    try {
      const res = await fetch('/api/dashboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-post', payload: newP })
      });
      if (res.ok) {
        const data = await res.json();
        setForumPosts([data.post, ...forumPosts]);
      } else {
        setForumPosts([{ id: 'mock-' + Math.random(), userName: user?.name || 'User', likes: 1, comments: '[]', createdAt: new Date().toISOString(), ...newP }, ...forumPosts]);
      }
    } catch (err) {
      setForumPosts([{ id: 'mock-' + Math.random(), userName: user?.name || 'User', likes: 1, comments: '[]', createdAt: new Date().toISOString(), ...newP }, ...forumPosts]);
    }

    setPostTitle('');
    setPostContent('');
  };

  // Emergency affirmation button
  const triggerEmergencyMotivation = () => {
    setShowEmergencyModal(true);
    setEmergencyLoading(true);

    setTimeout(() => {
      const affirmations = [
        "Failure is simply the opportunity to begin again, this time more intelligently. Your career pivot is a marathon, not a sprint. Take a deep breath, review your 0-3 Months roadmap checklist, and set a tiny 15-minute goal today. You have got this!",
        "Every master was once a beginner. The fact that you feel overwhelmed means you are pushing your boundaries. Reset your workspace, drink some water, and click off one daily planner task. You are building valuable career capital!",
        "Your skills (Coding, Design, or Writing) are compounding. Do not look at the final mountain; focus on the next step. Let's do a 20-minute study Pomodoro block together right now. The AI Coach is behind you!"
      ];
      setEmergencyAffirmation(affirmations[Math.floor(Math.random() * affirmations.length)]);
      setEmergencyLoading(false);
      confetti({ particleCount: 30, spread: 40 });
    }, 1000);
  };

  // Export planning packet
  const handleExport = (format: 'pdf' | 'docx' | 'json') => {
    const dataStr = JSON.stringify({ profile: profileData, stats: { streak, hoursStudied, skillsLearned } }, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `careermate_career_plan.${format}`;
    a.click();
    confetti({ particleCount: 40 });
  };

  // Toggle checklist tasks in Career Roadmap
  const toggleRoadmapTask = (taskName: string) => {
    if (completedRoadmapTasks.includes(taskName)) {
      setCompletedRoadmapTasks(completedRoadmapTasks.filter(t => t !== taskName));
    } else {
      setCompletedRoadmapTasks([...completedRoadmapTasks, taskName]);
      confetti({ particleCount: 30, spread: 40 });
    }
  };

  // Dynamic values
  const primaryCareer = profileData?.matches?.[0]?.careerName || 'AI & Machine Learning Engineer';
  const matches = profileData?.matches || [];
  const ikigaiData = profileData?.ikigai || {
    love: ['Coding', 'Design'],
    goodAt: ['Math', 'Figma'],
    worldNeeds: ['AI tools'],
    paidFor: ['Senior UI Engineer'],
    summary: 'A balanced profile merging development and visual elements.',
    purposeStatement: 'To build ethical and clean systems for future generations.'
  };
  const roadmap = profileData?.roadmap || {};

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-full border-2 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-4" />
        <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Synchronizing profile blueprint...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      
      {/* SIDEBAR SIDEBAR */}
      <aside className="w-64 border-r border-slate-200/50 dark:border-slate-800/50 bg-white dark:bg-slate-900/60 backdrop-blur-xl flex flex-col justify-between hidden md:flex shrink-0">
        <div>
          {/* Brand Header */}
          <div className="h-16 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center px-6 gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <BrainCircuit className="w-4.5 h-4.5" />
            </div>
            <span className="text-base font-bold font-display text-slate-900 dark:text-white">CareerMate AI</span>
          </div>

          {/* User Brief */}
          <div className="p-4 mx-3 my-4 rounded-xl bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/30 dark:border-slate-800/30 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs uppercase">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-slate-850 dark:text-white truncate">{user?.name || 'Explorer'}</h5>
              <span className="text-[10px] text-slate-400 block truncate">{user?.email}</span>
            </div>
          </div>

          {/* Navigation Menu Links */}
          <nav className="px-3 space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-overview"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t('dashboard.menu.overview')}</span>
            </button>

            <button
              onClick={() => setActiveTab('matches')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'matches' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-matches"
            >
              <Target className="w-4 h-4" />
              <span>{t('dashboard.menu.matches')}</span>
            </button>

            <button
              onClick={() => setActiveTab('roadmap')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'roadmap' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-roadmap"
            >
              <Map className="w-4 h-4" />
              <span>{t('dashboard.menu.roadmap')}</span>
            </button>

            <button
              onClick={() => setActiveTab('ikigai')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'ikigai' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-ikigai"
            >
              <Compass className="w-4 h-4" />
              <span>{t('dashboard.menu.ikigai')}</span>
            </button>

            <button
              onClick={() => setActiveTab('planner')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'planner' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-planner"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('dashboard.menu.planner')}</span>
            </button>

            <button
              onClick={() => setActiveTab('tracker')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'tracker' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-tracker"
            >
              <TrendingUp className="w-4 h-4" />
              <span>{t('dashboard.menu.tracker')}</span>
            </button>

            <button
              onClick={() => setActiveTab('books')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'books' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-books"
            >
              <BookOpen className="w-4 h-4" />
              <span>{t('dashboard.menu.books')}</span>
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'courses' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-courses"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{t('dashboard.menu.courses')}</span>
            </button>

            <button
              onClick={() => setActiveTab('events')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'events' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-events"
            >
              <Globe className="w-4 h-4" />
              <span>{t('dashboard.menu.events')}</span>
            </button>

            <button
              onClick={() => setActiveTab('community')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'community' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-community"
            >
              <Users className="w-4 h-4" />
              <span>{t('dashboard.menu.community')}</span>
            </button>

            <button
              onClick={() => setActiveTab('coach')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'coach' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-coach"
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t('dashboard.menu.coach')}</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-md shadow-blue-500/10' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'}`}
              id="sidebar-tab-settings"
            >
              <Settings className="w-4 h-4" />
              <span>{t('dashboard.menu.settings')}</span>
            </button>
          </nav>
        </div>

        {/* Logout Bottom Trigger */}
        <div className="p-4 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
          <button
            onClick={() => {
              setLanguage(language === 'EN' ? 'HI' : 'EN');
            }}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{language === 'EN' ? 'Hindi' : 'English'}</span>
          </button>
          <button
            onClick={logout}
            className="text-xs text-red-500 hover:text-red-400 flex items-center gap-1 font-bold"
            id="sidebar-logout"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT DISPLAY */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* TOP MOBILE BAR */}
        <header className="h-16 border-b border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between px-6 bg-white dark:bg-slate-950 transition-colors">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold tracking-wide uppercase text-slate-900 dark:text-white font-display">
              {activeTab === 'overview' && t('dashboard.menu.overview')}
              {activeTab === 'matches' && t('dashboard.menu.matches')}
              {activeTab === 'roadmap' && t('dashboard.menu.roadmap')}
              {activeTab === 'ikigai' && t('dashboard.menu.ikigai')}
              {activeTab === 'planner' && t('dashboard.menu.planner')}
              {activeTab === 'tracker' && t('dashboard.menu.tracker')}
              {activeTab === 'books' && t('dashboard.menu.books')}
              {activeTab === 'courses' && t('dashboard.menu.courses')}
              {activeTab === 'events' && t('dashboard.menu.events')}
              {activeTab === 'community' && t('dashboard.menu.community')}
              {activeTab === 'coach' && t('dashboard.menu.coach')}
              {activeTab === 'settings' && t('dashboard.menu.settings')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Export Button */}
            <div className="flex gap-2">
              <button
                onClick={() => handleExport('json')}
                className="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-200 rounded-lg transition-all"
                title="Export Career Plan in JSON Format"
              >
                <FileDown className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Export JSON</span>
              </button>
            </div>

            {/* Emergency Button */}
            <button
              onClick={triggerEmergencyMotivation}
              className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-extrabold text-white bg-red-600 hover:bg-red-500 rounded-lg shadow-md shadow-red-500/10 hover:shadow-red-500/20 transition-all animate-bounce"
              id="dashboard-emergency-btn"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>{t('overview.emergencyBtn')}</span>
            </button>
          </div>
        </header>

        {/* TAB WORKSPACE */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display">
                    {t('overview.welcome').replace('{name}', user?.name || 'Explorer')}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Primary Match: <span className="text-indigo-400 font-bold">{primaryCareer}</span> — Keep going!
                  </p>
                </div>
              </div>

              {/* Stats Widgets */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-600/15 border border-orange-500/20 flex items-center justify-center text-orange-500 shrink-0">
                    <Flame className="w-5 h-5 fill-orange-500" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('overview.card.streak')}</span>
                    <span className="text-lg font-black dark:text-white">{streak} Days</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('overview.card.hours')}</span>
                    <span className="text-lg font-black dark:text-white">{hoursStudied} hrs</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600/15 border border-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('overview.card.skills')}</span>
                    <span className="text-lg font-black dark:text-white">{skillsLearned} Badges</span>
                  </div>
                </GlassCard>

                <GlassCard className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/15 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                    <Map className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">{t('overview.card.roadmapProgress')}</span>
                    <span className="text-lg font-black dark:text-white">
                      {Math.round((completedRoadmapTasks.length / 5) * 100) || 0}%
                    </span>
                  </div>
                </GlassCard>
              </div>

              {/* Chart Visualizations & Next Task Feed */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* SVG Chart */}
                <GlassCard className="lg:col-span-8 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-6 block">Weekly Focus Graph</h4>
                  <div className="w-full h-48 relative flex items-end justify-between px-2 pt-6">
                    {/* SVG Line Graph */}
                    <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <defs>
                        <linearGradient id="chart-fill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 5,80 Q 20,50 35,65 T 65,40 T 95,20"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 5,80 Q 20,50 35,65 T 65,40 T 95,20 L 95,100 L 5,100 Z"
                        fill="url(#chart-fill)"
                      />
                    </svg>

                    {/* Chart axis marks */}
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => (
                      <span key={day} className="text-[9px] text-slate-400 font-semibold relative z-10">{day}</span>
                    ))}
                  </div>
                </GlassCard>

                {/* Daily Planner Snap Feed */}
                <GlassCard className="lg:col-span-4 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Today's Study Checklist</h4>
                  <div className="space-y-3">
                    {tasks.map(t => (
                      <div key={t.id} className="flex items-center gap-3 p-2 rounded-lg bg-slate-100/30 dark:bg-slate-900/40 border border-slate-200/25 dark:border-slate-800/25">
                        <input
                          type="checkbox"
                          checked={t.isCompleted}
                          onChange={(e) => handleToggleTask(t.id, e.target.checked)}
                          className="w-4 h-4 accent-indigo-500 rounded"
                        />
                        <span className={`text-xs ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-200 font-medium'}`}>{t.title}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>
          )}

          {/* TAB 2: CAREER MATCHES */}
          {activeTab === 'matches' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Top Career Alignments</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Our Career Discovery Engine analyzed your skills, personality variables, and bio to suggest these pathways.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {matches.map((m: any, idx: number) => (
                  <GlassCard key={idx} className="p-6 flex flex-col justify-between" hoverEffect={true}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">{m.category}</span>
                          <h4 className="text-base font-bold font-display mt-1.5 text-slate-900 dark:text-white">{m.careerName}</h4>
                        </div>
                        <span className="text-lg font-black text-indigo-500">{m.matchScore}% Match</span>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mb-6">
                        {m.reasoning}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-200/40 dark:border-slate-800/40 grid grid-cols-3 gap-2 text-center">
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold block">Salary Range</span>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{m.salaryRange}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold block">Growth Rate</span>
                        <span className="text-[11px] font-bold text-emerald-500">{m.growthPotential}</span>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-500 uppercase font-semibold block">Demand Scale</span>
                        <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200">{m.demandLevel.split(' ')[0]}</span>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CAREER ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Your Development Timeline</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Follow this structured career progression roadmap over the next 5 years to unlock mastery.
                </p>
              </div>

              <div className="space-y-8 relative pl-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[2px] before:bg-indigo-500/30">
                {Object.keys(roadmap).map((phaseKey, idx) => {
                  const phase = roadmap[phaseKey];
                  return (
                    <div key={idx} className="relative space-y-4">
                      {/* Tree marker dot */}
                      <span className="absolute -left-6 top-1.5 w-4 h-4 rounded-full bg-indigo-600 border-4 border-slate-900 shadow-md shadow-indigo-500/20" />

                      <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">{phaseKey}</h4>
                        <span className="text-[10px] text-indigo-400 font-semibold">{phase.skills.length} skills to unlock</span>
                      </div>

                      <GlassCard className="p-6" hoverEffect={false}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Core Skills & Projects Checklists */}
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Required Competencies</span>
                            <div className="space-y-2">
                              {phase.skills.map((skill: string) => {
                                const isDone = completedRoadmapTasks.includes(skill);
                                return (
                                  <label key={skill} className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      onChange={() => toggleRoadmapTask(skill)}
                                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                                    />
                                    <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{skill}</span>
                                  </label>
                                );
                              })}
                            </div>

                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block pt-2">Build Proof-of-work</span>
                            <div className="space-y-2">
                              {phase.projects.map((proj: string) => {
                                const isDone = completedRoadmapTasks.includes(proj);
                                return (
                                  <label key={proj} className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      onChange={() => toggleRoadmapTask(proj)}
                                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                                    />
                                    <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{proj}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                          {/* Networking, Interview Prep, Courses */}
                          <div className="space-y-3">
                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Networking & Events</span>
                            <div className="space-y-2">
                              {phase.networkingTasks.map((net: string) => {
                                const isDone = completedRoadmapTasks.includes(net);
                                return (
                                  <label key={net} className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      onChange={() => toggleRoadmapTask(net)}
                                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                                    />
                                    <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{net}</span>
                                  </label>
                                );
                              })}
                            </div>

                            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block pt-2">Interview Prep</span>
                            <div className="space-y-2">
                              {phase.interviewPrep.map((prep: string) => {
                                const isDone = completedRoadmapTasks.includes(prep);
                                return (
                                  <label key={prep} className="flex items-center gap-2.5 cursor-pointer">
                                    <input
                                      type="checkbox"
                                      checked={isDone}
                                      onChange={() => toggleRoadmapTask(prep)}
                                      className="w-3.5 h-3.5 rounded accent-indigo-500"
                                    />
                                    <span className={`text-xs ${isDone ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-200'}`}>{prep}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>

                        </div>
                      </GlassCard>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: IKIGAI GENERATOR */}
          {activeTab === 'ikigai' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Your Ikigai Discovery</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Merge Love, Good At, Needs, and Paid For vectors into a unified life direction statement.
                </p>
              </div>

              <IkigaiDiagram
                data={ikigaiData}
                onSave={(updated) => {
                  setProfileData({ ...profileData, ikigai: updated });
                  confetti({ particleCount: 30 });
                }}
              />
            </div>
          )}

          {/* TAB 5: STUDY PLANNER */}
          {activeTab === 'planner' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Simulated Study Planner</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Plan your weekly focus blocks. Checking off items increases your daily study streak.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Custom Task Creator */}
                <GlassCard className="lg:col-span-5 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Add New Schedule Task</h4>
                  <form onSubmit={handleAddTask} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Task Title</label>
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="e.g. Build AWS VPC network architecture diagram"
                        className="w-full bg-slate-100 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Task</span>
                    </button>
                  </form>
                </GlassCard>

                {/* Calendar list */}
                <GlassCard className="lg:col-span-7 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Upcoming Tasks</h4>
                  <div className="space-y-3">
                    {tasks.map(t => (
                      <div key={t.id} className="flex justify-between items-center p-3 rounded-lg bg-slate-100/30 dark:bg-slate-900/40 border border-slate-200/20 dark:border-slate-800/20">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={t.isCompleted}
                            onChange={(e) => handleToggleTask(t.id, e.target.checked)}
                            className="w-4 h-4 accent-indigo-500 rounded"
                          />
                          <div>
                            <span className={`text-xs ${t.isCompleted ? 'line-through text-slate-400' : 'text-slate-850 dark:text-slate-100 font-bold'}`}>{t.title}</span>
                            <span className="text-[9px] text-slate-500 block">Due Date: {t.date}</span>
                          </div>
                        </div>
                        <span className="text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-850 text-slate-500">{t.type}</span>
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>
          )}

          {/* TAB 6: STUDY TRACKER */}
          {activeTab === 'tracker' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Study Activity Tracker</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Log your study stats and check earned achievements badges.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Hours logger */}
                <GlassCard className="lg:col-span-5 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Log Study Session</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-150/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">Quick Add 1 Hour</span>
                        <span className="text-[10px] text-slate-400">Log study session focus hours</span>
                      </div>
                      <button
                        onClick={() => {
                          setHoursStudied(hoursStudied + 1);
                          confetti({ particleCount: 30 });
                        }}
                        className="px-3 py-1.5 text-xs bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg transition-colors font-bold"
                      >
                        + 1 Hr
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-xl bg-slate-150/40 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20">
                      <div>
                        <span className="text-xs font-bold text-slate-800 dark:text-white block">Unlock a Skill Badge</span>
                        <span className="text-[10px] text-slate-400">Confirm you mastered a skill concept</span>
                      </div>
                      <button
                        onClick={() => {
                          setSkillsLearned(skillsLearned + 1);
                          confetti({ particleCount: 40 });
                        }}
                        className="px-3 py-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-bold"
                      >
                        Unlock
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Badge Achievements list */}
                <GlassCard className="lg:col-span-7 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Earned Badges</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center ${hoursStudied >= 10 ? 'bg-indigo-600/10 border-indigo-500/30 text-indigo-400' : 'bg-slate-900/20 border-slate-800/40 text-slate-600'}`}>
                      <Clock className="w-8 h-8 mb-2" />
                      <h5 className="text-xs font-bold">Deep Thinker</h5>
                      <span className="text-[9px] text-slate-500 block">Logged 10+ hours</span>
                    </div>

                    <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center ${streak >= 5 ? 'bg-orange-600/10 border-orange-500/30 text-orange-400' : 'bg-slate-900/20 border-slate-800/40 text-slate-600'}`}>
                      <Flame className="w-8 h-8 mb-2" />
                      <h5 className="text-xs font-bold">Consistently Alive</h5>
                      <span className="text-[9px] text-slate-500 block">5+ Day Study Streak</span>
                    </div>

                    <div className={`p-4 rounded-xl border text-center flex flex-col items-center justify-center ${skillsLearned >= 3 ? 'bg-emerald-600/10 border-emerald-500/30 text-emerald-400' : 'bg-slate-900/20 border-slate-800/40 text-slate-600'}`}>
                      <Award className="w-8 h-8 mb-2" />
                      <h5 className="text-xs font-bold">Badge Hoarder</h5>
                      <span className="text-[9px] text-slate-500 block">Unlocked 3+ skill badges</span>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-200/20 dark:border-slate-800/40 text-center bg-slate-100/30 dark:bg-slate-900/20 flex flex-col items-center justify-center text-slate-600">
                      <GraduationCap className="w-8 h-8 mb-2" />
                      <h5 className="text-xs font-bold">Master Builder</h5>
                      <span className="text-[9px] text-slate-500 block">Finish 5 roadmap projects</span>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </div>
          )}          {/* TAB 7: BOOKS RECOMMENDED */}
          {activeTab === 'books' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Recommended Reading</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Books specifically suggested based on your career goals, ranging from core habits to leadership strategy.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {['beginner', 'intermediate', 'advanced'].flatMap((level) => 
                  (profileData?.books?.[level] || []).map((b: any, idx: number) => {
                    const titleLower = b.title.toLowerCase();
                    const isAtomicHabits = titleLower.includes('atomic habits');
                    const isDeepWork = titleLower.includes('deep work');
                    const coverUrl = isAtomicHabits ? '/images/book_habits.png' : (isDeepWork ? '/images/book_deep.png' : null);

                    const badgeStyles = level === 'beginner' 
                      ? 'bg-blue-500/10 text-blue-500 dark:text-blue-400 border border-blue-500/20' 
                      : level === 'intermediate' 
                      ? 'bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 border border-indigo-500/20' 
                      : 'bg-rose-500/10 text-rose-500 dark:text-rose-400 border border-rose-500/20';

                    const levelLabel = level.charAt(0).toUpperCase() + level.slice(1);

                    return (
                      <GlassCard key={`${level}-${idx}`} className="p-5 flex flex-col sm:flex-row gap-5" hoverEffect={true}>
                        {/* Book Cover Container */}
                        <div className="shrink-0 flex justify-center items-start">
                          {coverUrl ? (
                            <img
                              src={coverUrl}
                              alt={b.title}
                              className="w-24 h-36 object-cover rounded-lg shadow-lg border border-slate-200/20 dark:border-slate-800/40"
                            />
                          ) : (
                            <div className={`w-24 h-36 rounded-lg shadow-lg border border-slate-200/20 dark:border-slate-800/40 bg-gradient-to-br ${
                              level === 'beginner' ? 'from-blue-600 to-indigo-650' :
                              level === 'intermediate' ? 'from-indigo-600 to-purple-650' :
                              'from-rose-600 to-amber-650'
                            } p-3 flex flex-col justify-between text-left relative overflow-hidden select-none`}>
                              <div className="absolute top-0 left-0 bottom-0 w-1 bg-black/15" />
                              <div className="absolute top-0 left-1 bottom-0 w-0.5 bg-white/10" />
                              <div>
                                <span className="text-[7px] uppercase font-extrabold text-white/75 tracking-widest block mb-1">{levelLabel}</span>
                                <h5 className="text-[10px] font-black text-white leading-tight line-clamp-3 font-display">{b.title}</h5>
                              </div>
                              <div>
                                <div className="w-5 h-0.5 bg-white/20 mb-1" />
                                <span className="text-[7px] font-medium text-white/85 block truncate">by {b.author}</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Book Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className={`text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${badgeStyles}`}>
                                {levelLabel}
                              </span>
                              <div className="flex gap-2.5">
                                <a href={b.amazonLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber-500 font-bold hover:underline">
                                  Amazon ↗
                                </a>
                                <a href={b.goodreadsLink} target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 font-bold hover:underline">
                                  Goodreads ↗
                                </a>
                              </div>
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display line-clamp-2">{b.title}</h4>
                            <span className="text-[10px] text-slate-500 block mb-2">by {b.author}</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3">{b.summary}</p>
                          </div>
                          <div className="mt-3 pt-2 border-t border-slate-200/20 dark:border-slate-800/20">
                            <span className="text-[9px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">Why it matters</span>
                            <p className="text-xs text-indigo-500 dark:text-indigo-400 italic font-medium">"{b.whyItMatters}"</p>
                          </div>
                        </div>
                      </GlassCard>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* TAB 8: COURSES RECOMMENDED */}
          {activeTab === 'courses' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Suggested Curriculums</h3>
                <p className="text-xs text-slate-400 mt-1">
                  High-yield courses mapped to help you acquire skills listed in your roadmap.
                </p>
              </div>

              <div className="space-y-4">
                {(profileData?.courses || []).map((c: any, idx: number) => (
                  <GlassCard key={idx} className="p-4 flex items-center justify-between gap-4" hoverEffect={true}>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center text-indigo-400 shrink-0 font-bold">
                        {c.platform[0]}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-850 dark:text-white">{c.title}</h4>
                        <div className="flex gap-3 text-[10px] text-slate-450 mt-1">
                          <span>Platform: <span className="font-semibold">{c.platform}</span></span>
                          <span>Difficulty: <span className="font-semibold text-blue-400">{c.difficulty}</span></span>
                          <span>Duration: <span className="font-semibold">{c.duration}</span></span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${c.priority === 'High' ? 'bg-red-500/15 text-red-500' : 'bg-slate-200 dark:bg-slate-850 text-slate-400'}`}>
                        {c.priority} Priority
                      </span>
                      <span className="text-[10px] text-slate-500 flex items-center justify-end gap-1 mt-1">
                        <span>Rating: {c.rating}</span>
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      </span>
                    </div>
                  </GlassCard>
                ))}
              </div>
            </div>
          )}

          {/* TAB 9: NETWORKING & EVENTS */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Networking & Events</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Local and online conferences, hackathons, and seminars suggested based on your career pathway.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassCard className="p-6 flex flex-col justify-between" hoverEffect={true}>
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">Online Webinar</span>
                    <h4 className="text-base font-bold font-display mt-2 text-slate-900 dark:text-white">AI Frontiers Technical Conference 2026</h4>
                    <span className="text-[10px] text-slate-500 block mb-3">Eventbrite Sync — July 14, 2026</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Listen to senior engineers detail scalability benchmarks, next-gen routing algorithms, and LLM orchestration stacks.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert('Simulated calendar sync completed! Event bookmarked.');
                      confetti({ particleCount: 30 });
                    }}
                    className="mt-6 w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold rounded-lg text-xs hover:bg-slate-300 transition-colors"
                  >
                    RSVP & Sync to Google Calendar
                  </button>
                </GlassCard>

                <GlassCard className="p-6 flex flex-col justify-between" hoverEffect={true}>
                  <div>
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">Hackathon</span>
                    <h4 className="text-base font-bold font-display mt-2 text-slate-900 dark:text-white">Global SaaS Hackathon (Fall)</h4>
                    <span className="text-[10px] text-slate-500 block mb-3">Meetup API Sync — August 22, 2026</span>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Collaborate with other designers, coders, and marketers to build a fully validated startup prototype in 48 hours.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      alert('Simulated calendar sync completed! Event bookmarked.');
                      confetti({ particleCount: 30 });
                    }}
                    className="mt-6 w-full py-2 bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-100 font-bold rounded-lg text-xs hover:bg-slate-300 transition-colors"
                  >
                    RSVP & Sync to Google Calendar
                  </button>
                </GlassCard>
              </div>
            </div>
          )}

          {/* TAB 10: COMMUNITY HUB */}
          {activeTab === 'community' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Community Discussion boards</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Connect with peers pursuing similar career roadmaps and request mentorship check-ins.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Channel Post Creator */}
                <GlassCard className="lg:col-span-5 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">New Discussion Thread</h4>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Thread Title</label>
                      <input
                        type="text"
                        value={postTitle}
                        onChange={(e) => setPostTitle(e.target.value)}
                        placeholder="e.g. AWS study circles?"
                        className="w-full bg-slate-100 dark:bg-slate-950 text-slate-850 dark:text-white px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                        required
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discussion Channel</label>
                      <select
                        value={postGroup}
                        onChange={(e) => setPostGroup(e.target.value)}
                        className="w-full bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none text-xs"
                      >
                        <option value="Tech">Technology</option>
                        <option value="Creative">Creative / Design</option>
                        <option value="Business">Business / Entrepreneurship</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Content Description</label>
                      <textarea
                        value={postContent}
                        onChange={(e) => setPostContent(e.target.value)}
                        placeholder="Enter description details..."
                        rows={4}
                        className="w-full bg-slate-100 dark:bg-slate-950 text-slate-850 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Thread</span>
                    </button>
                  </form>
                </GlassCard>

                {/* Forum feed list */}
                <GlassCard className="lg:col-span-7 p-6" hoverEffect={false}>
                  <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 mb-4 block">Discussion Feed</h4>
                  <div className="space-y-4">
                    {forumPosts.map(p => (
                      <div key={p.id} className="p-4 rounded-xl bg-slate-100/30 dark:bg-slate-900/40 border border-slate-200/25 dark:border-slate-800/25">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-indigo-400 tracking-wider">#{p.groupName}</span>
                            <h5 className="text-xs font-bold text-slate-850 dark:text-white mt-1">{p.title}</h5>
                          </div>
                          <span className="text-[9px] text-slate-500 font-semibold">{p.userName}</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed mb-3">{p.content}</p>
                        <div className="flex gap-4 text-[10px] text-slate-500">
                          <button 
                            onClick={() => alert('Upvoted post!')} 
                            className="hover:text-white flex items-center gap-1.5 bg-slate-200/50 dark:bg-slate-800/40 hover:bg-slate-300/65 dark:hover:bg-slate-750/65 px-3 py-1.5 rounded-lg border border-slate-200/20 dark:border-slate-800/20 transition-all font-semibold"
                          >
                            <ThumbsUp className="w-3.5 h-3.5 text-indigo-400" />
                            <span>{p.likes} Likes</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>

              </div>
            </div>
          )}

          {/* TAB 11: AI COACH */}
          {activeTab === 'coach' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">AI Career Coach</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ask career suggestions, study optimizations, or request mockup interview questions.
                </p>
              </div>

              <GlassCard className="p-6 h-[500px] flex flex-col justify-between border-slate-850 bg-slate-950/20" hoverEffect={false}>
                {/* Chat Message Box */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                  {chatMessages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs sm:max-w-md p-3 rounded-2xl text-xs leading-relaxed ${msg.role === 'user' ? 'bg-indigo-650 text-white rounded-tr-none' : 'bg-slate-150 dark:bg-slate-900 text-slate-800 dark:text-slate-250 rounded-tl-none border border-slate-200/10'}`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  {coachLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-900 text-slate-400 p-3 rounded-2xl rounded-tl-none text-xs">
                        Coach is typing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Input form */}
                <form onSubmit={handleCoachSubmit} className="flex gap-3 border-t border-slate-200/20 dark:border-slate-800/20 pt-4 shrink-0">
                  <input
                    type="text"
                    value={coachInput}
                    onChange={(e) => setCoachInput(e.target.value)}
                    placeholder="Ask me: 'What skill should I study next?'"
                    className="w-full bg-slate-100 dark:bg-slate-950 text-slate-850 dark:text-white px-4 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    disabled={coachLoading}
                  />
                  <button
                    type="submit"
                    className="px-4 py-2.5 bg-blue-650 hover:bg-blue-650 text-white font-bold rounded-xl flex items-center justify-center transition-colors shrink-0"
                    disabled={coachLoading}
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </GlassCard>
            </div>
          )}

          {/* TAB 12: SETTINGS / SYSTEM CONTROL */}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="max-w-xl">
                <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">Settings & Developer Console</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage app configurations, review database connection strings, and toggle demo setups.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* System Configuration panel */}
                <GlassCard className="p-6" hoverEffect={false}>
                  <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white mb-4">Application Config</h4>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex justify-between items-center py-2 border-b border-slate-200/20 dark:border-slate-800/20">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Active Language</span>
                        <span className="text-[10px] text-slate-500">Change translation settings</span>
                      </div>
                      <button
                        onClick={() => setLanguage(language === 'EN' ? 'HI' : 'EN')}
                        className="px-3 py-1.5 bg-slate-200 dark:bg-slate-850 hover:bg-slate-300 rounded-lg text-slate-700 dark:text-white font-semibold"
                      >
                        {language === 'EN' ? 'Hindi' : 'English'}
                      </button>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-slate-200/20 dark:border-slate-800/20">
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white block">Reset Profile Data</span>
                        <span className="text-[10px] text-slate-500">Restarts the onboarding discovery sequence</span>
                      </div>
                      <button
                        onClick={() => {
                          localStorage.removeItem('careermate_user');
                          router.push('/onboarding');
                        }}
                        className="px-3 py-1.5 bg-red-950/20 hover:bg-red-900/30 text-red-500 rounded-lg font-bold"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </GlassCard>

                {/* Database Connectivity panel */}
                <GlassCard className="p-6" hoverEffect={false}>
                  <h4 className="text-sm font-bold font-display text-slate-900 dark:text-white mb-4">Database Monitoring</h4>
                  
                  <div className="space-y-4 text-xs">
                    <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-600/10 border border-emerald-500/20 text-emerald-400">
                      <div className="flex items-center gap-2">
                        <Database className="w-5 h-5" />
                        <div>
                          <span className="font-bold block text-xs">Provider: {dbStatus.provider}</span>
                          <span className="text-[10px] text-emerald-500/80">Schema synchronization matches perfectly</span>
                        </div>
                      </div>
                      <ShieldCheck className="w-5 h-5" />
                    </div>

                    <div className="p-3 bg-slate-100/30 dark:bg-slate-900/40 border border-slate-200/25 dark:border-slate-800/25 rounded-xl">
                      <span className="font-bold block text-slate-800 dark:text-white mb-1">Developer Mode Quick actions</span>
                      <p className="text-[10px] text-slate-500 mb-3">Force session bypass tokens to inspect Admin controls.</p>
                      <button
                        onClick={() => {
                          setMockUser({
                            userId: 'admin-developer-uid',
                            email: 'admin@careermate.ai',
                            name: 'ADMIN DEVELOPER',
                            role: 'ADMIN'
                          });
                          confetti({ particleCount: 40 });
                          alert('Bypassed session! Admin role loaded. Click "Admin Panel" in the sidebar to review logs.');
                        }}
                        className="w-full py-2 bg-blue-600/15 text-blue-400 font-bold border border-blue-500/25 hover:bg-blue-600/25 transition-colors text-center rounded-lg block text-[11px]"
                      >
                        Toggle Session Bypass (Load Admin Account)
                      </button>
                    </div>
                  </div>
                </GlassCard>

              </div>
            </div>
          )}

        </div>
      </main>

      {/* EMERGENCY MOTIVATION OVERLAY MODAL */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <GlassCard className="max-w-lg w-full p-8 border-red-500 bg-slate-950/90 text-left relative z-10 shadow-2xl shadow-red-500/10" hoverEffect={false}>
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2 text-red-500">
                <ShieldAlert className="w-6 h-6 animate-pulse" />
                <h4 className="text-lg font-black uppercase font-display tracking-wider">AI Emergency Recovery Plan</h4>
              </div>
              <button
                onClick={() => setShowEmergencyModal(false)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {emergencyLoading ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                Analyzing crisis patterns and compiling affirmative support structures...
              </div>
            ) : (
              <div className="space-y-6">
                <p className="text-slate-300 text-sm leading-relaxed italic border-l-2 border-red-500 pl-4 py-1">
                  "{emergencyAffirmation}"
                </p>

                <div className="space-y-3 pt-4 border-t border-slate-800">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">Uplifting Video Pick</span>
                  <div className="flex items-center gap-4 p-3 bg-slate-900 rounded-xl border border-slate-800">
                    <div className="w-10 h-10 rounded bg-red-600/10 flex items-center justify-center text-red-500 shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Steve Jobs Stanford Commencement Speech</span>
                      <a href="https://www.youtube.com/watch?v=UF8uR6Z6KLc" target="_blank" className="text-[10px] text-blue-400 hover:underline">Watch on YouTube ↗</a>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    onClick={() => {
                      setShowEmergencyModal(false);
                      setActiveTab('planner');
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white rounded-lg text-xs font-semibold"
                  >
                    Check Planner
                  </button>
                  <button
                    onClick={() => setShowEmergencyModal(false)}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg text-xs font-bold"
                  >
                    I'm Ready to focus
                  </button>
                </div>
              </div>
            )}
          </GlassCard>
        </div>
      )}

    </div>
  );
}
