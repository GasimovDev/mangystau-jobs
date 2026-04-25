"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 z-50">
      <span className={`text-xs font-bold ${language === 'en' ? 'text-blue-600' : 'text-slate-400'}`}>ENG</span>
      <button 
        onClick={toggleLanguage}
        className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
      >
        <div 
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-md transition-all duration-300 ${language === 'ru' ? 'left-7 bg-blue-500' : 'left-1'}`}
        />
      </button>
      <span className={`text-xs font-bold ${language === 'ru' ? 'text-blue-600' : 'text-slate-400'}`}>РУС</span>
    </div>
  );
}
