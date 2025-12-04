import React, { useState } from 'react';
import { Camera } from './components/Camera';
import { ResultCard } from './components/ResultCard';
import { analyzeExpression } from './services/geminiService';
import { AppState, EmotionAnalysis } from './types';
import { Bot, Sparkles, AlertCircle, Loader2 } from 'lucide-react';

export default function App() {
  const [appState, setAppState] = useState<AppState>('intro');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<EmotionAnalysis | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCapture = async (imageData: string) => {
    setCapturedImage(imageData);
    setAppState('analyzing');
    
    try {
      const result = await analyzeExpression(imageData);
      setAnalysisResult(result);
      setAppState('result');
    } catch (error) {
      console.error(error);
      setErrorMsg("AI가 잠시 생각에 잠겼나봐요. 다시 시도해볼까요?");
      setAppState('error');
    }
  };

  const resetApp = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setErrorMsg(null);
    setAppState('camera');
  };

  return (
    <div className="min-h-screen p-4 flex flex-col font-sans">
      {/* Header */}
      <header className="w-full max-w-2xl mx-auto flex items-center justify-between py-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="bg-white p-2 rounded-xl shadow-md">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-800">AI 감정 탐정</h1>
        </div>
        {appState !== 'intro' && (
           <button onClick={() => setAppState('intro')} className="text-sm text-gray-500 underline">
             처음으로
           </button>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center w-full max-w-2xl mx-auto">
        
        {/* Intro Screen */}
        {appState === 'intro' && (
          <div className="text-center animate-fade-in">
            <div className="mb-8 relative inline-block">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
              <img 
                src="https://picsum.photos/400/300" 
                alt="Happy kids" 
                className="relative rounded-3xl shadow-xl w-80 h-60 object-cover border-4 border-white mx-auto transform rotate-2 hover:rotate-0 transition-transform" 
              />
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-lg border border-gray-100 flex items-center gap-2">
                <span className="text-4xl">🕵️‍♂️</span>
                <div className="text-left">
                  <p className="text-xs text-gray-400 font-bold uppercase">AI Detective</p>
                  <p className="font-bold text-gray-800">표정을 분석해요!</p>
                </div>
              </div>
            </div>
            
            <h2 className="text-3xl font-display font-bold text-gray-800 mb-4">
              내 표정엔 어떤 감정이 숨어있을까?
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              카메라를 켜고 활짝 웃거나, 찌푸려보세요!<br/>
              인공지능이 친구들의 표정을 보고 기분을 맞춰볼게요.
            </p>
            
            <button 
              onClick={() => setAppState('camera')}
              className="bg-primary hover:bg-yellow-400 text-gray-900 font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-3 mx-auto"
            >
              <Sparkles className="w-6 h-6" />
              시작하기
            </button>
          </div>
        )}

        {/* Camera Screen */}
        {appState === 'camera' && (
          <div className="w-full animate-fade-in">
            <Camera onCapture={handleCapture} onError={(msg) => {
              setErrorMsg(msg);
              setAppState('error');
            }} />
            <p className="text-center text-gray-500 mt-6 font-medium bg-white/50 py-2 px-4 rounded-full inline-block mx-auto">
              💡 팁: 얼굴이 잘 보이게 밝은 곳에서 찍어주세요!
            </p>
          </div>
        )}

        {/* Analyzing Screen */}
        {appState === 'analyzing' && capturedImage && (
          <div className="text-center w-full max-w-md animate-pulse">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border-4 border-white mb-8 opacity-50 blur-sm">
               <img src={capturedImage} alt="Analyzing" className="w-full aspect-[4/3] object-cover" />
               <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                 <Loader2 className="w-16 h-16 text-white animate-spin" />
               </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              AI가 표정을 살펴보고 있어요...
            </h3>
            <p className="text-gray-500">
              눈은 어떻게 생겼지? 입꼬리는 올라갔나? 🤔
            </p>
          </div>
        )}

        {/* Result Screen */}
        {appState === 'result' && analysisResult && capturedImage && (
          <ResultCard 
            analysis={analysisResult} 
            imageSrc={capturedImage}
            onRetry={resetApp}
          />
        )}

        {/* Error Screen */}
        {appState === 'error' && (
          <div className="text-center p-8 bg-white rounded-3xl shadow-xl border-4 border-danger/20 max-w-sm mx-auto animate-bounce-in">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-danger" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">어라? 문제가 생겼어요</h3>
            <p className="text-gray-600 mb-6">{errorMsg || "알 수 없는 오류가 발생했습니다."}</p>
            <button 
              onClick={resetApp}
              className="bg-gray-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-gray-700 transition-colors w-full"
            >
              다시 시도하기
            </button>
          </div>
        )}
      </main>
      
      <footer className="mt-8 text-center text-gray-400 text-sm py-4">
        © AI Emotion Detective | Gemini AI
      </footer>
    </div>
  );
}