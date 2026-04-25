"use client";
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-3 z-50 bg-slate-100 p-1 rounded-full border border-slate-200">
      <button 
        onClick={() => setLanguage('en')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        ENG
      </button>
      <button 
        onClick={() => setLanguage('ru')}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${language === 'ru' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
      >
        РУС
      </button>
    </div>
  );
}
