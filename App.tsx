
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ContentItem, UserPreferences } from './types';
import Sidebar from './components/Sidebar';
import ContentCard from './components/ContentCard';
import { analyzeContent } from './services/geminiService';

const MOCK_DATA: ContentItem[] = [
  // Bilibili
  { id: 'b1', title: '【4K】2024年最全的AI开发工具清单，提升效率200%', description: '从代码补全到自动调试，涵盖了目前市面上最火的10款工具。', category: '科技', author: '代码艺术家', thumbnail: 'https://picsum.photos/seed/b1/800/450', views: '1.2M', source: 'Bilibili', timestamp: '2h ago' },
  { id: 'b2', title: '半夜刷到这个视频，我笑出猪叫声', description: '生活区up主的沙雕日常，拯救不开心。', category: '娱乐', author: '沙雕大王', thumbnail: 'https://picsum.photos/seed/b2/800/450', views: '800K', source: 'Bilibili', timestamp: '5h ago' },
  
  // TechNews
  { id: 't1', title: 'Hacker News: Why Python is still winning in the LLM era', description: 'An in-depth look at libraries and ecosystem advantages.', category: 'Software', author: 'PaulG', thumbnail: 'https://picsum.photos/seed/t1/800/450', views: '45K', source: 'TechNews', timestamp: '30m ago' },
  { id: 't2', title: 'OpenAI releases new vision fine-tuning capabilities', description: 'Developers can now customize GPT-4o for specific visual tasks.', category: 'AI', author: 'SamA', thumbnail: 'https://picsum.photos/seed/t2/800/450', views: '120K', source: 'TechNews', timestamp: '1h ago' },
  
  // Reddit
  { id: 'r1', title: 'r/ProgrammerHumor: Senior Dev vs Junior Dev in PR review', description: 'A collection of the funniest memes from this week.', category: 'Humor', author: 'u/CodeMaster', thumbnail: 'https://picsum.photos/seed/r1/800/450', views: '15K upvotes', source: 'Reddit', timestamp: '4h ago' },
  { id: 'r2', title: 'r/MachineLearning: New paper on 1-bit LLMs', description: 'Massive reduction in memory usage with minimal accuracy loss.', category: 'Research', author: 'u/PaperReader', thumbnail: 'https://picsum.photos/seed/r2/800/450', views: '2K upvotes', source: 'Reddit', timestamp: '8h ago' },
  
  // Community
  { id: 'c1', title: 'My journey building a SaaS in 30 days', description: 'Lessons learned, failures encountered, and $0 to $1k MRR.', category: 'Entrepreneur', author: 'IndieMaker', thumbnail: 'https://picsum.photos/seed/c1/800/450', views: '300 readers', source: 'Community', timestamp: '1d ago' },
  { id: 'c2', title: 'Top 5 Design Trends for Mobile Apps in 2025', description: 'Neuomorphism returns? A look at glassmorphism and motion design.', category: 'Design', author: 'PixelPerfect', thumbnail: 'https://picsum.photos/seed/c2/800/450', views: '1.5K readers', source: 'Community', timestamp: '2d ago' },
];

const App: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(MOCK_DATA);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'Unified' | 'HighMatch'>('Unified');
  const [preferences, setPreferences] = useState<UserPreferences>({
    interests: ['AI Tools', 'Software Engineering', 'Startup', 'Deep Learning'],
    dislikes: ['Gossip', 'Clickbait', 'Political Dramas'],
    activeSources: ['Bilibili', 'TechNews', 'Reddit', 'Community'],
    customPrompt: 'I prefer technical, educational, and productive content. Filter out entertainment-only or low-effort viral posts.'
  });

  const handleRunAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      // Analyze only visible sources
      const itemsToAnalyze = MOCK_DATA.filter(item => preferences.activeSources.includes(item.source));
      const results = await analyzeContent(itemsToAnalyze, preferences);
      
      const updatedItems = itemsToAnalyze.map(item => {
        const result = results.find(r => r.itemId === item.id);
        if (result) {
          return { ...item, score: result.score, recommendationReason: result.reason };
        }
        return { ...item, score: 0 };
      });

      // Sort by score
      updatedItems.sort((a, b) => (b.score || 0) - (a.score || 0));
      setItems(updatedItems);
      // Auto switch to high match if we got results
      if (updatedItems.length > 0) setViewMode('HighMatch');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  }, [preferences]);

  const filteredItems = useMemo(() => {
    let list = items.filter(item => preferences.activeSources.includes(item.source));
    if (viewMode === 'HighMatch') {
      list = list.filter(i => (i.score || 0) >= 60);
    }
    return list;
  }, [items, preferences.activeSources, viewMode]);

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      {/* Simulation Content */}
      <main className="flex-1 pr-80 transition-all duration-300">
        <header className="sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-100 px-10 py-5">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-12">
              <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center text-white rotate-3 group-hover:rotate-12 transition-transform">
                  <i className="fas fa-layer-group"></i>
                </div>
                <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">
                  Aggregator<span className="text-indigo-600">Pro</span>
                </h2>
              </div>
              
              <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
                <button 
                  onClick={() => setViewMode('Unified')}
                  className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                    viewMode === 'Unified' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <i className="fas fa-list-ul mr-2"></i>
                  Unified Feed
                </button>
                <button 
                  onClick={() => setViewMode('HighMatch')}
                  className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${
                    viewMode === 'HighMatch' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <i className="fas fa-sparkles mr-2"></i>
                  AI Recommended
                </button>
              </nav>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Profile</p>
                <p className="text-xs font-bold text-slate-700">Content Architect</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-slate-200 to-indigo-100 border-2 border-white shadow-sm flex items-center justify-center text-indigo-600 font-bold">
                CA
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto p-10">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                {viewMode === 'HighMatch' ? 'Top Picks for You' : 'Recent Discoveries'}
              </h1>
              <p className="text-slate-500 font-medium">
                {filteredItems.length} items aggregated from {preferences.activeSources.length} sources.
              </p>
            </div>
            <div className="flex gap-2">
              {preferences.activeSources.map(s => (
                <div key={s} className="bg-white border border-slate-100 px-3 py-1 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-wider shadow-sm">
                  {s}
                </div>
              ))}
            </div>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                <i className="fas fa-inbox text-2xl text-slate-300"></i>
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No items match your filters</h3>
              <p className="text-slate-500 max-w-sm text-center">
                Try enabling more sources in the sidebar or refreshing the smart feed with broader interests.
              </p>
              <button 
                onClick={handleRunAnalysis}
                className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
              >
                Run Smart Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredItems.map(item => (
                <ContentCard 
                  key={item.id} 
                  item={item} 
                  isRecommended={(item.score || 0) >= 80} 
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Sidebar 
        preferences={preferences}
        onUpdatePreferences={setPreferences}
        onRunAnalysis={handleRunAnalysis}
        isAnalyzing={isAnalyzing}
      />
    </div>
  );
};

export default App;
