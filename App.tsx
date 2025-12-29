import React, { useState, useEffect } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingState } from './components/LoadingState';
import { HistoryView } from './components/HistoryView';
import { analyzeFoodImage, fileToGenerativePart } from './services/gemini';
import { saveHistoryItem, getHistoryItems, clearHistory } from './services/storage';
import { AppState, NutritionalData, HistoryItem } from './types';
import { ScanLine, History, ArrowLeft } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [data, setData] = useState<NutritionalData | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // Load history on mount to have it ready
    setHistoryItems(getHistoryItems());
  }, [appState]);

  const handleImageSelect = async (file: File) => {
    try {
      setAppState(AppState.ANALYZING);
      setError(null);
      
      // Create preview
      const objectUrl = URL.createObjectURL(file);
      setImageSrc(objectUrl);

      // Convert for API
      const base64Data = await fileToGenerativePart(file);
      const mimeType = file.type;

      // Call API
      const result = await analyzeFoodImage(base64Data, mimeType);
      
      // Save to history
      saveHistoryItem(result);
      
      setData(result);
      setAppState(AppState.RESULT);
    } catch (err) {
      console.error(err);
      setError('Не удалось проанализировать изображение. Попробуйте другое фото или проверьте соединение.');
      setAppState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setData(null);
    setImageSrc(null);
    setError(null);
  };

  const toggleHistory = () => {
    if (appState === AppState.HISTORY) {
      handleReset();
    } else {
      setHistoryItems(getHistoryItems());
      setAppState(AppState.HISTORY);
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setData(item.data);
    setImageSrc(null); // No image stored in history
    setAppState(AppState.RESULT);
  };

  const handleClearHistory = () => {
    if (window.confirm('Вы уверены, что хотите очистить всю историю?')) {
      clearHistory();
      setHistoryItems([]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center space-x-2" onClick={handleReset} style={{cursor: 'pointer'}}>
              <div className="bg-emerald-600 p-1.5 rounded-lg">
                <ScanLine className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-gray-900">NutriScan</span>
           </div>
           
           <button 
             onClick={toggleHistory}
             className={`p-2 rounded-full transition-colors ${appState === AppState.HISTORY ? 'bg-gray-100 text-emerald-600' : 'text-gray-500 hover:bg-gray-100'}`}
             title="История"
           >
              {appState === AppState.HISTORY ? (
                 <ArrowLeft className="w-6 h-6" />
              ) : (
                 <History className="w-6 h-6" />
              )}
           </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {appState === AppState.IDLE && (
          <ImageUploader onImageSelect={handleImageSelect} />
        )}

        {appState === AppState.ANALYZING && (
          <LoadingState />
        )}

        {appState === AppState.HISTORY && (
          <HistoryView 
            items={historyItems} 
            onSelect={handleHistorySelect}
            onClear={handleClearHistory}
            onClose={handleReset}
          />
        )}

        {appState === AppState.ERROR && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center animate-fade-in">
            <div className="bg-red-50 p-6 rounded-2xl border border-red-100 max-w-md">
                <h3 className="text-xl font-bold text-red-600 mb-2">Ошибка анализа</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <button 
                    onClick={handleReset}
                    className="bg-red-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-red-700 transition-colors"
                >
                    Попробовать снова
                </button>
            </div>
          </div>
        )}

        {appState === AppState.RESULT && data && (
          <AnalysisResult 
            data={data} 
            imageSrc={imageSrc} 
            onReset={handleReset} 
          />
        )}
      </main>
    </div>
  );
};

export default App;
