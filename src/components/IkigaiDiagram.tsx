'use client';

import React, { useState } from 'react';
import { GlassCard } from './GlassCard';
import { Heart, Award, Target, Landmark, Save, RefreshCw } from 'lucide-react';

interface IkigaiData {
  love: string[];
  goodAt: string[];
  worldNeeds: string[];
  paidFor: string[];
  summary: string;
  purposeStatement: string;
}

interface IkigaiDiagramProps {
  data: IkigaiData;
  onSave?: (updatedData: IkigaiData) => void;
}

export function IkigaiDiagram({ data, onSave }: IkigaiDiagramProps) {
  const [activeTab, setActiveTab] = useState<'all' | 'love' | 'goodAt' | 'worldNeeds' | 'paidFor'>('all');
  const [editedData, setEditedData] = useState<IkigaiData>({ ...data });
  const [isEditing, setIsEditing] = useState(false);

  const handleTextChange = (field: keyof IkigaiData, index: number, value: string) => {
    const arr = [...(editedData[field] as string[])];
    arr[index] = value;
    setEditedData({ ...editedData, [field]: arr });
  };

  const addItem = (field: 'love' | 'goodAt' | 'worldNeeds' | 'paidFor') => {
    const arr = [...editedData[field]];
    arr.push('');
    setEditedData({ ...editedData, [field]: arr });
  };

  const removeItem = (field: 'love' | 'goodAt' | 'worldNeeds' | 'paidFor', index: number) => {
    const arr = [...editedData[field]];
    arr.splice(index, 1);
    setEditedData({ ...editedData, [field]: arr });
  };

  const saveChanges = () => {
    if (onSave) {
      onSave(editedData);
    }
    setIsEditing(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Venn Diagram Visualizer */}
      <GlassCard className="lg:col-span-6 flex flex-col items-center justify-center p-8 bg-slate-900/40 relative min-h-[450px] overflow-hidden" hoverEffect={false}>
        {/* Abstract background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

        <h3 className="text-xl font-semibold mb-6 text-slate-800 dark:text-slate-100 font-display text-center">
          Interactive Ikigai Blueprint
        </h3>

        {/* SVG Diagram */}
        <div className="w-full max-w-[320px] aspect-square relative">
          <svg viewBox="0 0 400 400" className="w-full h-full transform transition-all duration-500">
            <defs>
              <radialGradient id="love-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#EF4444" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="goodAt-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="needs-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
              </radialGradient>
              <radialGradient id="paid-grad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.05" />
              </radialGradient>
            </defs>

            {/* What you Love Circle (Red/Pinkish) - Top */}
            <circle
              cx="200"
              cy="150"
              r="90"
              fill="url(#love-grad)"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeDasharray={activeTab === 'love' ? '0' : '4 4'}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'love' ? 'stroke-[3px]' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => setActiveTab('love')}
            />

            {/* What you are Good At Circle (Blue) - Left */}
            <circle
              cx="145"
              cy="230"
              r="90"
              fill="url(#goodAt-grad)"
              stroke="#3B82F6"
              strokeWidth="1.5"
              strokeDasharray={activeTab === 'goodAt' ? '0' : '4 4'}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'goodAt' ? 'stroke-[3px]' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => setActiveTab('goodAt')}
            />

            {/* What you can be Paid For (Amber) - Bottom */}
            <circle
              cx="200"
              cy="270"
              r="90"
              fill="url(#paid-grad)"
              stroke="#F59E0B"
              strokeWidth="1.5"
              strokeDasharray={activeTab === 'paidFor' ? '0' : '4 4'}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'paidFor' ? 'stroke-[3px]' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => setActiveTab('paidFor')}
            />

            {/* What the World Needs (Green) - Right */}
            <circle
              cx="255"
              cy="230"
              r="90"
              fill="url(#needs-grad)"
              stroke="#10B981"
              strokeWidth="1.5"
              strokeDasharray={activeTab === 'worldNeeds' ? '0' : '4 4'}
              className={`cursor-pointer transition-all duration-300 ${activeTab === 'worldNeeds' ? 'stroke-[3px]' : 'opacity-70 hover:opacity-100'}`}
              onClick={() => setActiveTab('worldNeeds')}
            />

            {/* Venn Intersection Labels */}
            <text x="200" y="100" fill="#EF4444" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none">PASSION</text>
            <text x="75" y="235" fill="#3B82F6" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none">STRENGTHS</text>
            <text x="325" y="235" fill="#10B981" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none">MISSION</text>
            <text x="200" y="375" fill="#F59E0B" fontSize="10" fontWeight="bold" textAnchor="middle" className="pointer-events-none">VOCATION</text>

            {/* Center Core: Ikigai */}
            <circle
              cx="200"
              cy="220"
              r="22"
              fill="#FFFFFF"
              className="dark:fill-slate-950 cursor-pointer stroke-indigo-500 hover:stroke-[3px] transition-all"
              strokeWidth="2"
              onClick={() => setActiveTab('all')}
            />
            <text x="200" y="223" fill="#6366F1" fontSize="8" fontWeight="black" textAnchor="middle" className="pointer-events-none">IKIGAI</text>
          </svg>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-6">
          <button onClick={() => setActiveTab('all')} className={`px-3 py-1 text-xs rounded-full border transition-all ${activeTab === 'all' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'}`}>All</button>
          <button onClick={() => setActiveTab('love')} className={`px-3 py-1 text-xs rounded-full border transition-all ${activeTab === 'love' ? 'bg-red-600/25 text-red-400 border-red-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'}`}>Love</button>
          <button onClick={() => setActiveTab('goodAt')} className={`px-3 py-1 text-xs rounded-full border transition-all ${activeTab === 'goodAt' ? 'bg-blue-600/25 text-blue-400 border-blue-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'}`}>Good At</button>
          <button onClick={() => setActiveTab('worldNeeds')} className={`px-3 py-1 text-xs rounded-full border transition-all ${activeTab === 'worldNeeds' ? 'bg-emerald-600/25 text-emerald-400 border-emerald-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'}`}>World Needs</button>
          <button onClick={() => setActiveTab('paidFor')} className={`px-3 py-1 text-xs rounded-full border transition-all ${activeTab === 'paidFor' ? 'bg-amber-600/25 text-amber-400 border-amber-500/50' : 'bg-transparent text-slate-400 border-slate-700 hover:text-white'}`}>Paid For</button>
        </div>
      </GlassCard>

      {/* Editor & Detail Lists */}
      <GlassCard className="lg:col-span-6 min-h-[450px] flex flex-col justify-between" hoverEffect={false}>
        <div>
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-100 font-display flex items-center gap-2">
              {activeTab === 'all' && <Target className="w-5 h-5 text-indigo-500" />}
              {activeTab === 'love' && <Heart className="w-5 h-5 text-red-500" />}
              {activeTab === 'goodAt' && <Award className="w-5 h-5 text-blue-500" />}
              {activeTab === 'worldNeeds' && <Target className="w-5 h-5 text-emerald-500" />}
              {activeTab === 'paidFor' && <Landmark className="w-5 h-5 text-amber-500" />}
              {activeTab === 'all' ? 'Ikigai Summary' : `What You ${activeTab === 'love' ? 'Love' : activeTab === 'goodAt' ? 'Are Good At' : activeTab === 'worldNeeds' ? 'The World Needs' : 'Can Be Paid For'}`}
            </h4>

            <div className="flex gap-2">
              {isEditing ? (
                <button onClick={saveChanges} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-all">
                  <Save className="w-3.5 h-3.5" /> Save
                </button>
              ) : (
                <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-750 transition-all">
                  <RefreshCw className="w-3.5 h-3.5" /> Edit
                </button>
              )}
            </div>
          </div>

          {activeTab === 'all' ? (
            <div className="space-y-6">
              <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-100 dark:border-slate-800">
                <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Core Purpose Statement</span>
                <p className="mt-1 text-base text-slate-700 dark:text-slate-200 italic font-medium leading-relaxed">
                  "{isEditing ? (
                    <input
                      type="text"
                      value={editedData.purposeStatement}
                      onChange={(e) => setEditedData({ ...editedData, purposeStatement: e.target.value })}
                      className="w-full bg-slate-800 text-white px-2 py-1 rounded border border-slate-700 text-sm focus:outline-none"
                    />
                  ) : editedData.purposeStatement}"
                </p>
              </div>

              <div className="space-y-3">
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">Analysis Summary</span>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {isEditing ? (
                    <textarea
                      value={editedData.summary}
                      onChange={(e) => setEditedData({ ...editedData, summary: e.target.value })}
                      rows={3}
                      className="w-full bg-slate-800 text-white px-2 py-1 rounded border border-slate-700 text-sm focus:outline-none"
                    />
                  ) : editedData.summary}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <ul className="space-y-3">
                {editedData[activeTab].map((item, index) => (
                  <li key={index} className="flex gap-2 items-center">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${activeTab === 'love' ? 'bg-red-500' : activeTab === 'goodAt' ? 'bg-blue-500' : activeTab === 'worldNeeds' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    {isEditing ? (
                      <div className="flex w-full gap-2 items-center">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => handleTextChange(activeTab, index, e.target.value)}
                          className="w-full bg-slate-100 dark:bg-slate-800 text-slate-850 dark:text-white px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-sm focus:outline-none"
                        />
                        <button onClick={() => removeItem(activeTab, index)} className="text-xs text-red-500 hover:text-red-400 px-1 font-bold">✕</button>
                      </div>
                    ) : (
                      <span className="text-sm text-slate-700 dark:text-slate-200">{item}</span>
                    )}
                  </li>
                ))}
              </ul>
              {isEditing && (
                <button
                  onClick={() => addItem(activeTab)}
                  className="mt-2 text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  + Add Item
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 leading-relaxed">
            Ikigai is a Japanese concept meaning "a reason for being". Clicking outer circles filters down details. Click "Edit" to customize any generated list item.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
