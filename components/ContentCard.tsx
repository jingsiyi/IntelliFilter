
import React from 'react';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  isRecommended?: boolean;
}

const ContentCard: React.FC<ContentCardProps> = ({ item, isRecommended }) => {
  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Bilibili': return 'fa-play-circle text-pink-500';
      case 'TechNews': return 'fa-microchip text-blue-500';
      case 'Reddit': return 'fa-reddit text-orange-500';
      default: return 'fa-globe text-slate-400';
    }
  };

  return (
    <div className={`group relative bg-white rounded-2xl overflow-hidden border transition-all duration-500 ${
      isRecommended 
      ? 'border-indigo-400 ring-4 ring-indigo-50 shadow-xl scale-[1.01]' 
      : 'border-slate-100 hover:border-slate-300 hover:shadow-md'
    }`}>
      {isRecommended && (
        <div className="absolute top-3 left-3 z-20 bg-indigo-600 text-white px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg animate-pulse">
          <i className="fas fa-sparkles"></i>
          AI Top Pick
        </div>
      )}
      
      {item.score !== undefined && (
        <div className={`absolute top-3 right-3 z-20 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold shadow-sm border ${
          (item.score || 0) > 80 ? 'bg-green-500/90 text-white border-green-400' : 
          (item.score || 0) > 50 ? 'bg-indigo-500/90 text-white border-indigo-400' : 
          'bg-slate-500/90 text-white border-slate-400'
        }`}>
          {item.score}% Match
        </div>
      )}

      <div className="aspect-[16/10] relative overflow-hidden bg-slate-200">
        <img 
          src={item.thumbnail} 
          alt={item.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2">
          <span className="bg-white/90 backdrop-blur py-0.5 px-2 rounded text-[10px] font-bold text-slate-800 uppercase">
            {item.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <i className={`fas ${getSourceIcon(item.source)} text-sm`}></i>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{item.source}</span>
          <span className="text-[11px] text-slate-300 ml-auto">{item.timestamp}</span>
        </div>

        <h3 className="font-bold text-slate-800 leading-snug mb-2 line-clamp-2 text-base group-hover:text-indigo-600 transition-colors">
          {item.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-4">
          <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[10px] text-slate-500 font-bold">
            {item.author[0]}
          </div>
          <span className="text-xs text-slate-500 font-medium">{item.author}</span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-slate-400">{item.views}</span>
        </div>
        
        {item.recommendationReason ? (
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-[11px] text-slate-600 leading-relaxed relative italic">
             <i className="fas fa-quote-left text-indigo-300 mr-1 opacity-50"></i>
             {item.recommendationReason}
          </div>
        ) : (
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed italic">
            {item.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default ContentCard;
