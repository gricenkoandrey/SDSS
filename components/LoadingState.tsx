import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
        <Loader2 className="w-16 h-16 text-emerald-600 animate-spin relative z-10" />
      </div>
      <h2 className="mt-8 text-2xl font-bold text-gray-800">Анализируем блюдо...</h2>
      <p className="text-gray-500 mt-2">Определяем ингредиенты и считаем калории</p>
    </div>
  );
};
