
import React, { useState } from 'react';
import { UserPreferences } from '../types';

interface SidebarProps {
  preferences: UserPreferences;
  onUpdatePreferences: (prefs: UserPreferences) => void;
  onRunAnalysis: () => void;
  isAnalyzing: boolean;
}

const AVAILABLE_SOURCES = [
  { id: 'Bilibili', name: 'Bilibili Trending', icon: 'fa-play-circle', color: 'text-pink-500' },
  { id: 'TechNews', name: 'Hacker News / Tech', icon: 'fa-microchip', color: 'text-blue-500' },
  { id: 'Reddit', name: 'Reddit / Popular', icon: 'fa-reddit', color: 'text-orange-500' },
  { id: 'Community', name: 'Personalized Feed', icon: 'fa-users', color: 'text-green-500' },
];

const Sidebar: React.FC<SidebarProps> = ({ 
  preferences, 
  onUpdatePreferences, 
  onRunAnalysis, 
  isAnalyzing 
}) => {
  const [newInterest, setNewInterest] = useState('');
  const [newDislike, setNewDislike] = useState('');

  const toggleSource = (sourceId: string) => {
    const isCurrentlyActive = preferences.activeSources.includes(sourceId);
    onUpdatePreferences({
      ...preferences,
      activeSources: isCurrentlyActive 
        ? preferences.activeSources.filter(id => id !== sourceId)
        : [...preferences.activeSources, sourceId]
    });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      onUpdatePreferences({
        ...preferences,
        interests: [...preferences.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const addDislike = () => {
    if (newDislike.trim()) {
      onUpdatePreferences({
        ...preferences,
        dislikes: [...preferences.dislikes, newDislike.trim()]
      });
      setNewDislike('');
    }
  };

  return (
    <div className="w-80 h-screen bg-white border-l border-slate-200 p-6 flex flex-col fixed right-0 top-0 shadow-2xl z-50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
          <i className="fas fa-sparkles text-lg"></i>
        </div>
        <div>
          <h1 className="text-lg font-black text-slate-800 leading-tight tracking-tight">IntelliFilter</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Cross-Platform Curator</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-8 pr-2 scrollbar-thin scrollbar-thumb-slate-200">
        {/* Sources Management */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Content Sources</h2>
          <div className="space-y-2">
            {AVAILABLE_SOURCES.map(source => (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  preferences.activeSources.includes(source.id)
                  ? 'bg-white border-indigo-200 shadow-sm ring-1 ring-indigo-50'
                  : 'bg-slate-50 border-transparent opacity-60 grayscale'
                }`}
              >
                <i className={`fas ${source.icon} ${source.color} text-base`}></i>
                <span className="text-xs font-bold text-slate-700 flex-1 text-left">{source.name}</span>
                {preferences.activeSources.includes(source.id) && (
                  <i className="fas fa-check-circle text-indigo-500 text-xs"></i>
                )}
              </button>
            ))}
          </div>
        </section>

        {/* Interests */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Focus Topics</h2>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. LLM Updates" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addInterest()}
            />
            <button onClick={addInterest} className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md shadow-indigo-100">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.interests.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full flex items-center gap-2 group hover:bg-indigo-100 transition-colors">
                {tag}
                <button onClick={() => onUpdatePreferences({...preferences, interests: preferences.interests.filter((_, idx) => idx !== i)})} className="text-indigo-300 hover:text-indigo-600">
                  <i className="fas fa-times text-[8px]"></i>
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Hide Topics */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">Filtered Themes</h2>
          <div className="flex gap-2 mb-3">
            <input 
              type="text" 
              value={newDislike}
              onChange={(e) => setNewDislike(e.target.value)}
              placeholder="e.g. Sports News" 
              className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              onKeyDown={(e) => e.key === 'Enter' && addDislike()}
            />
            <button onClick={addDislike} className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 shadow-md shadow-rose-100">
              <i className="fas fa-plus"></i>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {preferences.dislikes.map((tag, i) => (
              <span key={i} className="px-3 py-1 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-full flex items-center gap-2 group hover:bg-rose-100 transition-colors">
                {tag}
                <button onClick={() => onUpdatePreferences({...preferences, dislikes: preferences.dislikes.filter((_, idx) => idx !== i)})} className="text-rose-300 hover:text-rose-600">
                  <i className="fas fa-times text-[8px]"></i>
                </button>
              </span>
            ))}
          </div>
        </section>

        {/* Custom AI Context */}
        <section>
          <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">AI Curator Persona</h2>
          <textarea 
            value={preferences.customPrompt}
            onChange={(e) => onUpdatePreferences({...preferences, customPrompt: e.target.value})}
            placeholder="Tell the AI how to think... (e.g. Prioritize educational over viral content)"
            className="w-full h-28 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none leading-relaxed italic"
          />
        </section>
      </div>

      <div className="mt-auto pt-8">
        <button 
          onClick={onRunAnalysis}
          disabled={isAnalyzing}
          className={`w-full py-4 rounded-2xl font-black text-sm text-white flex items-center justify-center gap-3 transition-all shadow-xl ${
            isAnalyzing ? 'bg-indigo-400 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-indigo-200 hover:-translate-y-1'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Curating Feed...
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles"></i>
              Refresh Smart Feed
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
