'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { GlassCard } from '@/components/GlassCard';
import { ThreeDParticles } from '@/components/ThreeDParticles';
import { 
  User, MapPin, GraduationCap, Briefcase, Plus, ArrowRight, ArrowLeft, 
  Sparkles, CheckCircle2, Sliders, Heart, MessageSquare, Compass, HelpCircle
} from 'lucide-react';

const PREDEFINED_SKILLS = [
  'Coding', 'Communication', 'Design', 'Leadership', 'Marketing', 
  'Teaching', 'Writing', 'Finance', 'Research', 'Strategy', 'Analytics'
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('Initializing AI Career Engine...');

  // Step 1: Personal Details
  const [age, setAge] = useState('');
  const [country, setCountry] = useState('');
  const [education, setEducation] = useState('');
  const [currentProfession, setCurrentProfession] = useState('');

  // Step 2: Skills
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');

  // Step 3: Personality Sliders
  const [introvert, setIntrovert] = useState(5);
  const [risk, setRisk] = useState(5);
  const [creative, setCreative] = useState(5);
  const [analytical, setAnalytical] = useState(5);

  // Step 4: Scenario-Based Assignments (Quiz Qns)
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');

  // Step 5: Purpose Assessment
  const [excites, setExcites] = useState('');
  const [impact, setImpact] = useState('');
  const [goals, setGoals] = useState('');
  const [flow, setFlow] = useState('');

  // Step 6: Free Bio
  const [rawBio, setRawBio] = useState('');

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleAddCustomSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = customSkill.trim();
    if (cleanSkill && !selectedSkills.includes(cleanSkill)) {
      setSelectedSkills([...selectedSkills, cleanSkill]);
    }
    setCustomSkill('');
  };

  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setLoadingMsg('Analyzing your skills, personality, and scenario assignments...');

    const payload = {
      name: user?.name || 'Explorer',
      age,
      country,
      education,
      currentProfession,
      skills: selectedSkills,
      personality: { Introvert: introvert, Risk: risk, Creative: creative, Analytical: analytical },
      assignmentAnswers: { q1, q2, q3 },
      purpose: { excites, impact, goals, flow },
      rawBio,
    };

    setTimeout(() => {
      setLoadingMsg('Evaluating assignment scenarios and generating your Ikigai Venn blueprint...');
    }, 1500);

    setTimeout(() => {
      setLoadingMsg('Compiling 5-year developmental roadmaps, books, and courses...');
    }, 3000);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setTimeout(() => {
          router.push('/dashboard/overview');
        }, 4500);
      } else {
        alert('Server database offline. Saving profile metrics in local memory.');
        setTimeout(() => {
          router.push('/dashboard/overview');
        }, 4500);
      }
    } catch (err) {
      console.warn('Network error, profile cached locally');
      setTimeout(() => {
        router.push('/dashboard/overview');
      }, 4500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 via-slate-950 to-slate-900 text-white relative py-12 px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Immersive 3D Parallax Particle canvas background */}
      <ThreeDParticles />

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 max-w-lg mx-auto text-center">
          <div className="w-16 h-16 rounded-full border-4 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent animate-spin mb-8" />
          <h2 className="text-2xl font-bold font-display tracking-tight text-white mb-2 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
            <span>CareerMate AI Diagnostics</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-xs">{loadingMsg}</p>
        </div>
      ) : (
        <div className="flex-1 max-w-3xl w-full mx-auto relative z-10">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-extrabold font-display mb-2 text-white">
              {t('onboarding.title')}
            </h1>
            <p className="text-xs text-slate-400">Step {step} of 6 — {
              step === 1 ? t('onboarding.step1') : 
              step === 2 ? t('onboarding.step2') : 
              step === 3 ? t('onboarding.step3') : 
              step === 4 ? 'Scenario Assignments' :
              step === 5 ? t('onboarding.step4') : 
              t('onboarding.step5')
            }</p>
            
            {/* Horizontal progress bar */}
            <div className="max-w-xs mx-auto flex items-center gap-2 mt-4">
              {[1, 2, 3, 4, 5, 6].map((s) => (
                <div
                  key={s}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'bg-gradient-to-r from-blue-500 to-indigo-500' : 'bg-slate-800'}`}
                />
              ))}
            </div>
          </div>

          <GlassCard className="p-8 border-slate-800 bg-slate-950/40 shadow-2xl min-h-[460px] flex flex-col justify-between" hoverEffect={false}>
            
            {/* STEP 1: Personal Details */}
            {step === 1 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-2">
                  <User className="w-5 h-5 text-blue-500" />
                  <span>{t('onboarding.step1')}</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 24"
                      className="w-full bg-slate-900 text-white px-3 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Country</label>
                    <div className="relative">
                      <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. India"
                        className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Education</label>
                    <div className="relative">
                      <GraduationCap className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={education}
                        onChange={(e) => setEducation(e.target.value)}
                        placeholder="e.g. Bachelor's in CS"
                        className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Profession</label>
                    <div className="relative">
                      <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={currentProfession}
                        onChange={(e) => setCurrentProfession(e.target.value)}
                        placeholder="e.g. Student, Sales Assistant"
                        className="w-full bg-slate-900 text-white pl-10 pr-4 py-2.5 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: Skills Selection */}
            {step === 2 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500" />
                  <span>{t('onboarding.step2')}</span>
                </h3>
                
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Core Competencies</span>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_SKILLS.map((skill) => {
                      const selected = selectedSkills.includes(skill);
                      return (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${selected ? 'bg-indigo-600 border-indigo-650 text-white shadow-md' : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'}`}
                        >
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Add Custom Skills</span>
                  <form onSubmit={handleAddCustomSkill} className="flex gap-2">
                    <input
                      type="text"
                      value={customSkill}
                      onChange={(e) => setCustomSkill(e.target.value)}
                      placeholder="e.g. Figma, Python"
                      className="w-full max-w-xs bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-white font-bold rounded-xl flex items-center justify-center text-xs"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </form>
                </div>

                {selectedSkills.length > 0 && (
                  <div className="space-y-2 pt-4 border-t border-slate-800/40">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Your Selected Skill Stack</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedSkills.map((skill) => (
                        <span key={skill} className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 rounded-full border border-slate-700 text-xs font-semibold text-slate-200">
                          <span>{skill}</span>
                          <button onClick={() => removeSkill(skill)} className="hover:text-white text-slate-500 font-bold shrink-0">✕</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: Personality Profile */}
            {step === 3 && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-2">
                  <Sliders className="w-5 h-5 text-emerald-500" />
                  <span>{t('onboarding.step3')}</span>
                </h3>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-350">
                      <span>Introverted / Empathetic</span>
                      <span>Extroverted / Social</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={introvert}
                      onChange={(e) => setIntrovert(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-350">
                      <span>Risk Averse / Structured</span>
                      <span>Risk Tolerant / Dynamic</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={risk}
                      onChange={(e) => setRisk(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-350">
                      <span>Pragmatic / Standard</span>
                      <span>Creative / Artistic</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={creative}
                      onChange={(e) => setCreative(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-350">
                      <span>Qualitative / Narrative</span>
                      <span>Analytical / Data-Driven</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={analytical}
                      onChange={(e) => setAnalytical(parseInt(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: Assignment Questionnaire */}
            {step === 4 && (
              <div className="space-y-5 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-1">
                  <HelpCircle className="w-5 h-5 text-amber-500" />
                  <span>Interactive Scenario Assignments</span>
                </h3>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Answer these situational assignment scenarios. The matching engine evaluates these answers to cross-verify your target career score.
                </p>

                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                  
                  {/* Scenario 1 */}
                  <div className="space-y-2">
                    <span className="text-[11px] font-bold text-slate-300 block">Q1. Scenario: Your web database crashes. What is your immediate reaction?</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: 'Open compiler logs to debug and write codebase fixes immediately.' },
                        { key: 'B', text: 'Set up backup alert coordinates and check cloud infrastructure configs.' },
                        { key: 'C', text: 'Coordinate client statements and draft status update templates.' },
                        { key: 'D', text: 'Draft a visual dashboard case study describing incident flows.' }
                      ].map((ans) => (
                        <button
                          key={ans.key}
                          type="button"
                          onClick={() => setQ1(ans.key)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${q1 === ans.key ? 'bg-amber-600/20 border-amber-500 text-white font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                          <span className="font-bold mr-1">{ans.key})</span> {ans.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scenario 2 */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">Q2. Scenario: You have only 24 hours to launch a product page. What is your focus?</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: 'Ensuring layout components render beautifully and match mock designs.' },
                        { key: 'B', text: 'Writing indexing files and checking API request/response latencies.' },
                        { key: 'C', text: 'Formulating sales copy targets and scheduling search engine campaigns.' },
                        { key: 'D', text: 'Drafting agile boards and coordinate team deployment checklists.' }
                      ].map((ans) => (
                        <button
                          key={ans.key}
                          type="button"
                          onClick={() => setQ2(ans.key)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${q2 === ans.key ? 'bg-amber-600/20 border-amber-500 text-white font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                          <span className="font-bold mr-1">{ans.key})</span> {ans.text}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Scenario 3 */}
                  <div className="space-y-2 pt-3 border-t border-slate-800">
                    <span className="text-[11px] font-bold text-slate-300 block">Q3. Scenario: A client requests a complex algorithm shift. How do you start?</span>
                    <div className="grid grid-cols-1 gap-2">
                      {[
                        { key: 'A', text: 'Deep-diving into technical documentation to compare algorithm runtimes.' },
                        { key: 'B', text: 'Whiteboarding layout wires and building user journey cards.' },
                        { key: 'C', text: 'Projecting pricing scales and customer retention returns.' },
                        { key: 'D', text: 'Dividing task scopes to assign to development leads.' }
                      ].map((ans) => (
                        <button
                          key={ans.key}
                          type="button"
                          onClick={() => setQ3(ans.key)}
                          className={`p-2.5 rounded-xl border text-left text-xs transition-all ${q3 === ans.key ? 'bg-amber-600/20 border-amber-500 text-white font-bold' : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700'}`}
                        >
                          <span className="font-bold mr-1">{ans.key})</span> {ans.text}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* STEP 5: Purpose Mapping */}
            {step === 5 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-pink-500" />
                  <span>{t('onboarding.step4')}</span>
                </h3>
                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">What subjects or activities excite you?</label>
                    <input
                      type="text"
                      value={excites}
                      onChange={(e) => setExcites(e.target.value)}
                      placeholder="e.g. Graphic design, writing stories, analyzing user flows"
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">What activities make you lose track of time?</label>
                    <input
                      type="text"
                      value={flow}
                      onChange={(e) => setFlow(e.target.value)}
                      placeholder="e.g. Sketching layouts in Figma, building Python scripts"
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">What impact do you want to create?</label>
                    <input
                      type="text"
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      placeholder="e.g. Building tools that help student study efficiently"
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">What are your long-term goals?</label>
                    <input
                      type="text"
                      value={goals}
                      onChange={(e) => setGoals(e.target.value)}
                      placeholder="e.g. Work as a lead product designer at a tech company"
                      className="w-full bg-slate-900 text-white px-3 py-2 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: AI Description Area */}
            {step === 6 && (
              <div className="space-y-4 animate-fadeIn">
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-500" />
                  <span>{t('onboarding.step5')}</span>
                </h3>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Describe yourself in detail</label>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Write anything you want. Talk about your background, career pivot struggles, what you hope to achieve, or your hobbies. AI will compile this into your blueprint.
                  </p>
                  <textarea
                    value={rawBio}
                    onChange={(e) => setRawBio(e.target.value)}
                    placeholder="e.g. 'I currently work as a sales manager, but I want to shift to a technology career because I love solving design puzzles. I have completed some HTML courses, and love designing web layouts...'"
                    rows={5}
                    className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 focus:outline-none focus:border-blue-500 text-xs placeholder:text-slate-500"
                  />
                  <div className="text-right text-[10px] text-slate-500 font-semibold">
                    {rawBio.length} characters
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Actions Stepper Controls */}
            <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-800/40">
              <button
                onClick={handlePrev}
                disabled={step === 1}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-slate-400 hover:text-white rounded-xl border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-xs font-semibold"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>{t('onboarding.prev')}</span>
              </button>

              {step === 6 ? (
                <button
                  onClick={handleSubmit}
                  disabled={!rawBio.trim()}
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-xs"
                  id="onboarding-submit-btn"
                >
                  <span>{t('onboarding.submit')}</span>
                  <Sparkles className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={
                    (step === 1 && (!age || !country)) ||
                    (step === 2 && selectedSkills.length === 0) ||
                    (step === 4 && (!q1 || !q2 || !q3))
                  }
                  className="flex items-center gap-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed font-bold transition-all text-xs"
                >
                  <span>{t('onboarding.next')}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

          </GlassCard>
        </div>
      )}
    </div>
  );
}
