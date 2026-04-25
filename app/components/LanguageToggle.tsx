"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggle = () => setLanguage(language === 'en' ? 'ru' : 'en');

  return (
    <div className="flex items-center gap-2 z-50">
      <button 
        onClick={() => setLanguage('en')}
        className={`text-xs font-bold transition-colors ${language === 'en' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        ENG
      </button>
      <button 
        onClick={toggle}
        className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer outline-none focus:ring-2 focus:ring-blue-500 transition-colors border border-slate-300"
      >
        <div 
          className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${language === 'ru' ? 'left-7 bg-blue-500' : 'left-1'}`}
        />
      </button>
      <button 
        onClick={() => setLanguage('ru')}
        className={`text-xs font-bold transition-colors ${language === 'ru' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
      >
        РУС
      </button>
    </div>
  );
}
