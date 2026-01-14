
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  author: string;
  thumbnail: string;
  views?: string;
  source: 'Bilibili' | 'TechNews' | 'Reddit' | 'Community';
  sourceUrl?: string;
  score?: number; // AI calculated score 0-100
  recommendationReason?: string;
  timestamp: string;
}

export interface UserPreferences {
  interests: string[];
  dislikes: string[];
  activeSources: string[];
  customPrompt: string;
}

export interface AIRankingResult {
  itemId: string;
  score: number;
  reason: string;
}
