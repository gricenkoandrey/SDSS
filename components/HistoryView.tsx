import React from 'react';
import { HistoryItem } from '../types';
import { Clock, ChevronRight, Trash2, Calendar } from 'lucide-react';

interface HistoryViewProps {
  items: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  onClose: () => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ items, onSelect, onClear, onClose }) => {
  const formatDate = (timestamp: number) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(timestamp));
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Clock className="w-6 h-6 text-emerald-600" />
          История
        </h2>
        {items.length > 0 && (
          <button 
            onClick={onClear}
            className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Очистить
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg">История пока пуста</p>
          <p className="text-gray-400 text-sm mt-1">Проанализируйте блюдо, чтобы сохранить результат</p>
          <button 
            onClick={onClose}
            className="mt-6 text-emerald-600 font-semibold hover:text-emerald-700"
          >
            Начать сканирование
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div 
              key={item.id}
              onClick={() => onSelect(item)}
              className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                    <span>{formatDate(item.timestamp)}</span>
                </div>
                <h3 className="font-bold text-gray-900 truncate pr-4">{item.data.dishName}</h3>
                <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {item.data.calories} ккал
                    </span>
                    <span className="text-gray-500 text-xs">
                        Б: {item.data.macros.protein} • Ж: {item.data.macros.fat} • У: {item.data.macros.carbs}
                    </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-emerald-500 transition-colors" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
