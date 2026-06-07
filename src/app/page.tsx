'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { GlassCard } from '@/components/GlassCard';
import { ThreeDCard } from '@/components/ThreeDCard';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Sparkles, CheckCircle2, ChevronRight, Zap, Target, BookOpen, Calendar, HelpCircle, 
  Map, Star, Compass, ArrowRight, MessageSquare, ShieldCheck, TrendingUp
} from 'lucide-react';

export default function Home() {
  const { t } = useLanguage();
  const [demoBio, setDemoBio] = useState('');
  const [demoMatches, setDemoMatches] = useState<any[] | null>(null);
  const [analyzingDemo, setAnalyzingDemo] = useState(false);

  // Run a micro matching demo in the client without auth
  const handleDemoAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!demoBio.trim()) return;
    setAnalyzingDemo(true);
    
    setTimeout(() => {
      const bio = demoBio.toLowerCase();
      let matches = [];

      if (bio.includes('code') || bio.includes('computer') || bio.includes('program') || bio.includes('tech')) {
        matches = [
          { name: 'AI & Machine Learning Engineer', score: 96, growth: 'High', color: 'text-blue-500' },
          { name: 'Full Stack Software Engineer', score: 88, growth: 'High', color: 'text-indigo-500' },
          { name: 'Technical Product Manager', score: 81, growth: 'Stable', color: 'text-emerald-500' }
        ];
      } else if (bio.includes('design') || bio.includes('draw') || bio.includes('art') || bio.includes('paint') || bio.includes('creative')) {
        matches = [
          { name: 'Lead UI/UX Product Designer', score: 94, growth: 'High', color: 'text-pink-500' },
          { name: 'Creative Content Director', score: 87, growth: 'Stable', color: 'text-purple-500' },
          { name: 'Digital Brand Architect', score: 80, growth: 'High', color: 'text-amber-500' }
        ];
      } else if (bio.includes('business') || bio.includes('sell') || bio.includes('lead') || bio.includes('finance') || bio.includes('manage')) {
        matches = [
          { name: 'SaaS Start-up Founder', score: 91, growth: 'High', color: 'text-amber-500' },
          { name: 'Product Growth Consultant', score: 85, growth: 'Stable', color: 'text-emerald-500' },
          { name: 'Investment Advisor', score: 79, growth: 'Medium', color: 'text-blue-500' }
        ];
      } else {
        // General defaults
        matches = [
          { name: 'Data Operations Strategist', score: 86, growth: 'High', color: 'text-indigo-500' },
          { name: 'Technical Project Consultant', score: 82, growth: 'Stable', color: 'text-blue-500' },
          { name: 'Growth Coordinator', score: 77, growth: 'High', color: 'text-emerald-500' }
        ];
      }

      setDemoMatches(matches);
      setAnalyzingDemo(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 overflow-hidden bg-gradient-to-b from-blue-50/20 via-slate-50 to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 dark:bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-48 left-1/4 w-[300px] h-[300px] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center text-center lg:text-left">
            
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-semibold mb-6 animate-pulse">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Generation Career Engineering</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight font-display mb-6">
                <span className="block text-slate-900 dark:text-white leading-tight">
                  {t('landing.title')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-500 dark:text-slate-400 mb-10 leading-relaxed">
                {t('landing.subtitle')}
              </p>

              <div className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-4">
                <Link
                  href="/login?tab=signup"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-center flex items-center justify-center gap-2"
                  id="landing-hero-cta"
                >
                  <span>{t('landing.cta.start')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#demo-section"
                  className="w-full sm:w-auto px-8 py-4 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 hover:bg-slate-150 dark:hover:bg-slate-800 font-semibold rounded-xl border border-slate-200/60 dark:border-slate-800 transition-all text-center"
                  id="landing-demo-btn"
                >
                  {t('landing.cta.demo')}
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <ThreeDCard className="p-2 border-slate-800/80 bg-slate-950/20 max-w-[380px] w-full" intensity={10}>
                <img
                  src="/images/hero_illustration.png"
                  alt="CareerMate AI 3D Illustration"
                  className="rounded-xl w-full h-auto object-cover border border-slate-700/30"
                />
              </ThreeDCard>
            </div>

          </div>

          {/* Interactive Mini-Demo Section */}
          <div id="demo-section" className="max-w-2xl mx-auto scroll-mt-24">
            <GlassCard className="p-8 border-slate-200/60 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/50 shadow-xl" hoverEffect={false}>
              <h3 className="text-lg font-bold mb-4 font-display text-slate-850 dark:text-white flex items-center gap-2">
                <Compass className="w-5 h-5 text-blue-500" />
                <span>AI Matching Sandbox Preview</span>
              </h3>
              <form onSubmit={handleDemoAnalyze} className="space-y-4">
                <textarea
                  value={demoBio}
                  onChange={(e) => setDemoBio(e.target.value)}
                  placeholder="Describe your interests: e.g. 'I love solving complex math puzzles, writing Python code, and drawing minimalist layouts...'"
                  rows={3}
                  className="w-full bg-slate-50 dark:bg-slate-950 text-slate-850 dark:text-white p-3 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-blue-500 text-sm placeholder:text-slate-400"
                  required
                />
                <button
                  type="submit"
                  disabled={analyzingDemo}
                  className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 font-bold rounded-lg hover:bg-slate-850 dark:hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 text-xs"
                >
                  {analyzingDemo ? (
                    <span>Analyzing with AI...</span>
                  ) : (
                    <>
                      <span>Analyze My Sentence</span>
                      <Zap className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </form>

              {demoMatches && (
                <div className="mt-6 space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800 animate-fadeIn text-left">
                  <span className="text-xs uppercase font-bold tracking-wider text-slate-400 block mb-2">Simulated Career Matches</span>
                  <div className="space-y-3">
                    {demoMatches.map((m, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-slate-100/50 dark:bg-slate-950/40 border border-slate-200/20 dark:border-slate-800/20">
                        <div>
                          <p className="text-xs font-bold text-slate-800 dark:text-white">{m.name}</p>
                          <span className="text-[10px] text-slate-400">Demand: <span className="text-emerald-500 font-semibold">{m.growth}</span></span>
                        </div>
                        <div className="text-right">
                          <span className={`text-sm font-black ${m.color}`}>{m.score}% Match</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/login?tab=signup" className="text-xs font-semibold text-blue-500 dark:text-blue-400 flex items-center gap-1 hover:underline mt-4">
                    <span>Unlock complete Ikigai dashboard & detailed 5-year roadmap</span>
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              )}
            </GlassCard>
          </div>

        </div>
      </section>

      {/* Feature Section */}
      <section className="py-20 bg-slate-100/40 dark:bg-slate-950/40 border-y border-slate-200/30 dark:border-slate-900/30 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Everything you need for growth, in one platform
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto">
              Skip static counseling. CareerMate AI tracks your milestones, syncs courses, monitors daily focus, and guides you with an AI coach.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 mb-4">
                <Target className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">AI Career Matching</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Matches your answers against 500+ categories mapping out Career Score, Salary Scale, growth, and compatibility reasoning.
              </p>
            </ThreeDCard>

            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-500 mb-4">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">Interactive Ikigai Mapping</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Connect passions, skills, social demands, and salary vectors with a live Venn editor. Update parameters anytime.
              </p>
            </ThreeDCard>

            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/10 border border-emerald-500/20 flex items-center justify-center text-emerald-500 mb-4">
                <Map className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">5-Year Milestones Roadmap</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Broken down into actionable phases (0-3m, 3-6m, 1y, etc.) including books to read, portfolio items, and interview preps.
              </p>
            </ThreeDCard>

            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 mb-4">
                <Calendar className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">Integrated Study Planner</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Organize learning with simulated weekly calendars, checklist completion rates, and streak counters.
              </p>
            </ThreeDCard>

            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-pink-600/10 border border-pink-500/20 flex items-center justify-center text-pink-500 mb-4">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">Bespoke AI Career Coach</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                A built-in chat advisor answering queries ("what skill to learn next?") loaded with your onboarding profile.
              </p>
            </ThreeDCard>

            <ThreeDCard className="p-6">
              <div className="w-10 h-10 rounded-xl bg-amber-600/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-4">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="text-base font-bold mb-2 font-display text-slate-900 dark:text-white">Books & Resources Engine</h4>
              <p className="text-slate-400 text-xs leading-relaxed">
                Personalized books from beginners to advanced with direct summaries and external tracking links.
              </p>
            </ThreeDCard>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              Simple 3-step Career Transformation
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg font-bold mx-auto mb-4">
                1
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-2">Onboard & Self Describe</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Fill details on skills, personality dimensions, excitation prompts, and write a bio.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg font-bold mx-auto mb-4">
                2
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-2">Get AI Analytics</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Our analysis engine creates structured reports matching careers, books, courses, and roadmaps.
              </p>
            </div>

            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg font-bold mx-auto mb-4">
                3
              </div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-2">Execute & Track Streaks</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Use our calendar and streak boards to update completed tasks, and consult the AI coach as you grow.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-20 bg-slate-100/30 dark:bg-slate-900/20 border-t border-slate-200/20 dark:border-slate-800/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white">
              Success Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <GlassCard className="p-6">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-350 italic text-sm mb-4 leading-relaxed">
                "I was working in sales but coding was always a hobby. CareerMate's 5-step onboarding mapped out exactly where my sales experience overlapped with technology product management. I'm now a Technical PM earning 2x my old salary!"
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/images/avatar_siddharth.png"
                  alt="Siddharth Kumar"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200/20 dark:border-slate-800/40 shadow-sm shrink-0"
                />
                <div>
                  <h6 className="text-xs font-bold text-slate-850 dark:text-white">Siddharth Kumar</h6>
                  <span className="text-[10px] text-slate-400">Technical PM, Hyderabad</span>
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="flex gap-1 text-amber-500 mb-3">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
              </div>
              <p className="text-slate-600 dark:text-slate-350 italic text-sm mb-4 leading-relaxed">
                "Finding books and courses that weren't basic tutorial hell was tough. The 1-3 years and 3-5 years milestones roadmap on CareerMate told me exactly what systems certifications to pursue. A total game changer for my consulting career."
              </p>
              <div className="flex items-center gap-3">
                <img
                  src="/images/avatar_ananya.png"
                  alt="Ananya Mehta"
                  className="w-9 h-9 rounded-full object-cover border border-slate-200/20 dark:border-slate-800/40 shadow-sm shrink-0"
                />
                <div>
                  <h6 className="text-xs font-bold text-slate-850 dark:text-white">Ananya Mehta</h6>
                  <span className="text-[10px] text-slate-400">Cloud Consultant, Mumbai</span>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-slate-400 text-xs max-w-sm mx-auto">
              Start finding your career today. Upgrade whenever you need deeper analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Free Plan */}
            <GlassCard className="p-8 border-slate-200 dark:border-slate-800 flex flex-col justify-between" hoverEffect={true}>
              <div>
                <h4 className="text-lg font-bold font-display text-slate-850 dark:text-white">Starter</h4>
                <p className="text-slate-400 text-xs mt-1 mb-4">Basic Discovery</p>
                <div className="text-3xl font-black mb-6 dark:text-white">
                  $0 <span className="text-xs text-slate-400 font-normal">/ forever</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Single career matching report</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Basic 3-month roadmap</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <span>Full Ikigai Venn Diagram Editor</span>
                  </li>
                  <li className="flex items-center gap-2 text-slate-400 line-through">
                    <span>Built-in AI coach support</span>
                  </li>
                </ul>
              </div>
              <Link href="/login?tab=signup" className="w-full py-2 px-4 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-slate-350 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 font-bold text-center block text-xs">
                Start Free
              </Link>
            </GlassCard>

            {/* Pro Plan */}
            <GlassCard className="p-8 border-blue-500 bg-blue-550/5 dark:bg-blue-950/10 flex flex-col justify-between relative" glowColor="blue" hoverEffect={true}>
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-600 text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>
              <div>
                <h4 className="text-lg font-bold font-display text-slate-850 dark:text-white">Premium AI</h4>
                <p className="text-slate-400 text-xs mt-1 mb-4">Ultimate Growth</p>
                <div className="text-3xl font-black mb-6 dark:text-white">
                  $19 <span className="text-xs text-slate-400 font-normal">/ month</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Unlimited Career matches</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Full 5-year detailed roadmaps</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Interactive Ikigai Diagrams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>AI Coach chat availability</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>PDF/DOCX/JSON exports</span>
                  </li>
                </ul>
              </div>
              <Link href="/login?tab=signup" className="w-full py-2 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-center block text-xs shadow-md shadow-blue-500/20">
                Upgrade to Premium
              </Link>
            </GlassCard>

            {/* Enterprise Plan */}
            <GlassCard className="p-8 border-slate-200 dark:border-slate-800 flex flex-col justify-between" hoverEffect={true}>
              <div>
                <h4 className="text-lg font-bold font-display text-slate-850 dark:text-white">Institution</h4>
                <p className="text-slate-400 text-xs mt-1 mb-4">Colleges & Teams</p>
                <div className="text-3xl font-black mb-6 dark:text-white">
                  Custom <span className="text-xs text-slate-400 font-normal">/ contract</span>
                </div>
                <ul className="space-y-3 mb-8 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Admin Panel metrics dashboard</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>School/Team bulk invites</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Dedicated organization channels</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>Prisma SQLite/Postgres syncing</span>
                  </li>
                </ul>
              </div>
              <Link href="mailto:sales@careermate.ai" className="w-full py-2 px-4 rounded-lg bg-slate-800 dark:bg-slate-900 hover:bg-slate-750 text-white font-bold text-center block text-xs">
                Contact Sales
              </Link>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/20 dark:border-slate-900/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold font-display text-slate-900 dark:text-white flex items-center justify-center gap-2">
              <HelpCircle className="w-8 h-8 text-indigo-500" />
              <span>Frequently Asked Questions</span>
            </h2>
          </div>

          <div className="space-y-6">
            <GlassCard className="p-5" hoverEffect={false}>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-2">How accurate is the AI Career matching?</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Our discovery matching compares your skills, sliders (personality dimensions), and goals against standard profiles compiled from real industry jobs. It gives highly relevant directions and can be tweaked in real-time.
              </p>
            </GlassCard>

            <GlassCard className="p-5" hoverEffect={false}>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Can I switch between English and Hindi?</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes! We have an English and Hindi translation system built into the app headers. Simply toggle the Globe button in the navbar at any time.
              </p>
            </GlassCard>

            <GlassCard className="p-5" hoverEffect={false}>
              <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-2">Does the roadmap provide course resource links?</h5>
              <p className="text-slate-400 text-xs leading-relaxed">
                Yes. For each roadmap phase, we suggest verified books (with direct summaries and links) and filtered online courses (Coursera, Udemy, etc.) relevant to the path.
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-slate-100 dark:bg-slate-950 border-t border-slate-200/30 dark:border-slate-900/30 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>{t('landing.footer')}</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-slate-800 dark:hover:text-white">Security</Link>
            <Link href="/" className="hover:text-slate-800 dark:hover:text-white">Privacy Policy</Link>
            <Link href="/" className="hover:text-slate-800 dark:hover:text-white">Terms of Use</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
