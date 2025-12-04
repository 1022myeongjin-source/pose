export interface EmotionAnalysis {
  emotion: string;
  koreanLabel: string;
  emoji: string;
  description: string;
  reasoning: string[];
  confidence: number;
}

export type AppState = 'intro' | 'camera' | 'analyzing' | 'result' | 'error';
