import React from 'react';
import { EmotionAnalysis } from '../types';
import { Sparkles, RefreshCw } from 'lucide-react';

interface ResultCardProps {
  analysis: EmotionAnalysis;
  imageSrc: string;
  onRetry: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({ analysis, imageSrc, onRetry }) => {
  // Determine color theme based on emotion
  const getThemeColor = (emotion: string) => {
    const e = emotion.toLowerCase();
    if (e.includes('happy')) return 'bg-yellow-100 text-yellow-800 border-yellow-400';
    if (e.includes('sad')) return 'bg-blue-100 text-blue-800 border-blue-400';
    if (e.includes('angry')) return 'bg-red-100 text-red-800 border-red-400';
    if (e.includes('surprised')) return 'bg-purple-100 text-purple-800 border-purple-400';
    return 'bg-gray-100 text-gray-800 border-gray-400';
  };

  const themeClass = getThemeColor(analysis.emotion);

  return (
    <div className="w-full max-w-md mx-auto animate-fade-in-up">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-white">
        
        {/* Header Image */}
        <div className="relative h-48 bg-gray-100">
           <img 
            src={imageSrc} 
            alt="Captured face" 
            className="w-full h-full object-cover opacity-90"
          />
           <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-white to-transparent"></div>
           <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 text-8xl filter drop-shadow-lg">
             {analysis.emoji}
           </div>
        </div>

        {/* Content */}
        <div className="pt-14 pb-8 px-8 text-center">
          
          <h2 className={`font-display text-4xl mb-2 ${themeClass.split(' ')[1]}`}>
            {analysis.koreanLabel}
          </h2>
          
          <p className="text-gray-600 font-bold mb-6 text-lg break-keep">
            "{analysis.description}"
          </p>

          <div className="bg-background rounded-2xl p-4 mb-6 text-left">
            <h3 className="flex items-center gap-2 text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-accent" />
              AI 탐정의 추리 노트
            </h3>
            <ul className="space-y-2">
              {analysis.reasoning.map((reason, idx) => (
                <li key={idx} className="flex items-start gap-2 text-gray-700">
                  <span className="inline-block w-5 h-5 bg-white rounded-full text-center text-xs leading-5 shadow-sm text-accent font-bold shrink-0">
                    {idx + 1}
                  </span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={onRetry}
            className="w-full py-4 bg-accent hover:bg-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            다시 해보기
          </button>
        </div>
      </div>
    </div>
  );
};