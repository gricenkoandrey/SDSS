import React, { useRef } from 'react';
import { Camera, Image as ImageIcon, UploadCloud } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const triggerGallery = () => {
    if (fileInputRef.current) {
        fileInputRef.current.removeAttribute('capture');
        fileInputRef.current.click();
    }
  };

  const triggerCamera = () => {
    if (fileInputRef.current) {
        fileInputRef.current.setAttribute('capture', 'environment');
        fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in py-10">
      <div className="text-center space-y-2">
        <div className="bg-emerald-100 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-6">
            <UploadCloud className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Анализ Питания</h1>
        <p className="text-gray-500 max-w-xs mx-auto">
            Сфотографируйте еду или загрузите фото из галереи для мгновенного подсчета калорий.
        </p>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="w-full max-w-xs space-y-4">
        <button
          onClick={triggerCamera}
          className="w-full flex items-center justify-center space-x-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white py-4 px-6 rounded-2xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-1"
        >
          <Camera className="w-6 h-6" />
          <span className="text-lg font-semibold">Сделать фото</span>
        </button>

        <button
          onClick={triggerGallery}
          className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-200 py-4 px-6 rounded-2xl transition-all transform hover:-translate-y-1"
        >
          <ImageIcon className="w-6 h-6 text-gray-600" />
          <span className="text-lg font-semibold">Выбрать из галереи</span>
        </button>
      </div>
      
      <div className="pt-10 grid grid-cols-2 gap-4 w-full max-w-md text-center opacity-60">
        <div className="bg-white p-3 rounded-lg border border-gray-100">
            <div className="text-xs uppercase font-bold text-gray-400 mb-1">Точность</div>
            <div className="text-emerald-600 font-bold">AI 2.0</div>
        </div>
        <div className="bg-white p-3 rounded-lg border border-gray-100">
            <div className="text-xs uppercase font-bold text-gray-400 mb-1">Скорость</div>
            <div className="text-emerald-600 font-bold">~2 сек</div>
        </div>
      </div>
    </div>
  );
};
