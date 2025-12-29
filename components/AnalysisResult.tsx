import React from 'react';
import { NutritionalData } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Utensils, Activity, Leaf, Droplet, Wheat, RotateCcw } from 'lucide-react';

interface AnalysisResultProps {
  data: NutritionalData;
  imageSrc: string | null;
  onReset: () => void;
}

const COLORS = ['#10B981', '#F59E0B', '#3B82F6']; // Protein (Green), Fat (Yellow), Carbs (Blue)

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, imageSrc, onReset }) => {
  const chartData = [
    { name: 'Белки', value: data.macros.protein },
    { name: 'Жиры', value: data.macros.fat },
    { name: 'Углеводы', value: data.macros.carbs },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Header Image or Gradient Fallback */}
      <div className="relative h-64 w-full rounded-2xl overflow-hidden shadow-lg bg-gray-900">
        {imageSrc ? (
          <img src={imageSrc} alt="Analyzed food" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700 flex items-center justify-center">
            <Utensils className="w-20 h-20 text-white opacity-20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <h2 className="text-white text-3xl font-bold p-6 w-full truncate shadow-black drop-shadow-md">
            {data.dishName}
          </h2>
        </div>
      </div>

      {/* Main Stats Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
                <Activity className="text-emerald-500 w-6 h-6" />
                <h3 className="text-xl font-bold text-gray-800">Энергетическая ценность</h3>
            </div>
            <span className="text-3xl font-black text-emerald-600">{data.calories} <span className="text-lg text-gray-500 font-medium">ккал</span></span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => [`${value}г`, '']} />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div className="p-3 bg-green-50 rounded-xl">
                <div className="flex justify-center mb-1"><Leaf className="w-5 h-5 text-green-600"/></div>
                <div className="text-sm text-gray-500">Белки</div>
                <div className="font-bold text-gray-800">{data.macros.protein}г</div>
            </div>
            <div className="p-3 bg-yellow-50 rounded-xl">
                <div className="flex justify-center mb-1"><Droplet className="w-5 h-5 text-yellow-600"/></div>
                <div className="text-sm text-gray-500">Жиры</div>
                <div className="font-bold text-gray-800">{data.macros.fat}г</div>
            </div>
            <div className="p-3 bg-blue-50 rounded-xl">
                <div className="flex justify-center mb-1"><Wheat className="w-5 h-5 text-blue-600"/></div>
                <div className="text-sm text-gray-500">Углеводы</div>
                <div className="font-bold text-gray-800">{data.macros.carbs}г</div>
            </div>
        </div>
      </div>

      {/* Ingredients & Summary */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
             <div className="flex items-center space-x-2 mb-4">
                <Utensils className="text-orange-500 w-5 h-5" />
                <h3 className="text-lg font-bold text-gray-800">Ингредиенты</h3>
            </div>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
                {data.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                ))}
            </ul>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Заключение</h3>
            <p className="text-gray-600 leading-relaxed">
                {data.summary}
            </p>
        </div>
      </div>

       <button 
        onClick={onReset}
        className="fixed bottom-6 right-6 md:static md:w-full md:mt-4 flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-4 rounded-full shadow-xl transition-all z-50"
      >
        <RotateCcw className="w-5 h-5" />
        <span>Сканировать еще</span>
      </button>
    </div>
  );
};
