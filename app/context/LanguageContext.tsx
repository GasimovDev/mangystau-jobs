"use client";
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type Language = 'en' | 'ru';

interface Translations {
  [key: string]: {
    en: string;
    ru: string;
  };
}

const translations: Translations = {
  // Page.tsx (Home / Registration)
  createProfile: { en: "Upload your CV and let our AI instantly build your smart profile.", ru: "Загрузите свое резюме, и наш ИИ мгновенно создаст ваш умный профиль." },
  findJob: { en: "Find a Job (Vacancies)", ru: "Найти работу (Вакансии)" },
  findTalent: { en: "Find Talent (Profiles)", ru: "Найти таланты (Профили)" },
  magicAI: { en: "✨ Magic AI Autofill", ru: "✨ ИИ-автозаполнение" },
  uploadCV: { en: "Upload your CV (PDF/JPEG/PNG) and let our AI fill out your profile automatically.", ru: "Загрузите резюме (PDF/JPEG/PNG), и ИИ автоматически заполнит ваш профиль." },
  parsing: { en: "Parsing...", ru: "Обработка..." },
  uploadCVBtn: { en: "Upload CV", ru: "Загрузить резюме" },
  fullName: { en: "Full Name", ru: "Полное имя (ФИО)" },
  cvPhoto: { en: "CV Photo (Max 3x4 PNG/JPG)", ru: "Фото для резюме (Макс. 3x4 PNG/JPG)" },
  desiredRole: { en: "Desired Role", ru: "Желаемая должность" },
  industry: { en: "Industry", ru: "Сфера (Отрасль)" },
  foodBev: { en: "Food & Beverage", ru: "Общепит (Еда и напитки)" },
  itTech: { en: "IT & Tech", ru: "IT и Технологии" },
  retailSales: { en: "Retail & Sales", ru: "Розничная торговля и продажи" },
  type: { en: "Type", ru: "Тип занятости" },
  fullTime: { en: "Full-time", ru: "Полная занятость" },
  partTime: { en: "Part-time", ru: "Частичная занятость" },
  microdistrict: { en: "Microdistrict", ru: "Микрорайон" },
  selectLocation: { en: "Select location...", ru: "Выберите микрорайон..." },
  fourteenth: { en: "14th Microdistrict", ru: "14-й микрорайон" },
  fifteenth: { en: "15th Microdistrict", ru: "15-й микрорайон" },
  twentySeventh: { en: "27th Microdistrict", ru: "27-й микрорайон" },
  seafront: { en: "Seafront", ru: "Набережная" },
  telegramUsername: { en: "Telegram Username", ru: "Имя пользователя Telegram" },
  topSkills: { en: "Top Skills (comma separated)", ru: "Ключевые навыки (через запятую)" },
  motivationLetter: { en: "Motivation Letter", ru: "Сопроводительное письмо" },
  companyName: { en: "Company Name", ru: "Название компании" },
  jobTitle: { en: "Job Title", ru: "Название должности" },
  requirements: { en: "Requirements", ru: "Требования" },
  salary: { en: "Salary Amount (₸)", ru: "Зарплата (₸)" },
  hrTelegram: { en: "HR Telegram Contact", ru: "Telegram контакт HR" },
  createSeeker: { en: "Create Seeker Profile", ru: "Создать профиль соискателя" },
  createEmployer: { en: "Publish Vacancy", ru: "Опубликовать вакансию" },
  loading: { en: "Connecting to AI server...", ru: "Подключение к ИИ серверу..." },
  successSaved: { en: "Data Saved Successfully!", ru: "Данные успешно сохранены!" },
  successAI: { en: "Your information has been processed by our AI matching engine.", ru: "Ваша информация обработана нашим ИИ." },
  aiStrengths: { en: "AI Generated Strengths", ru: "Навыки, выделенные ИИ" },
  joinTelegram: { en: "Join Our Telegram Channel", ru: "Присоединяйтесь к Telegram каналу" },
  viewProfile: { en: "View Your Profile", ru: "Посмотреть ваш профиль" },
  goFeed: { en: "Go to the Live Feed", ru: "Перейти к ленте" },
  
  // New keys for page.tsx
  lookingForWork: { en: "I'm looking for work", ru: "Я ищу работу" },
  amEmployer: { en: "I'm an Employer", ru: "Я работодатель" },
  buildProfile: { en: "Build Your Profile", ru: "Создать профиль" },
  postVacancy: { en: "Post a Vacancy", ru: "Разместить вакансию" },
  saveProfile: { en: "Save Profile & Activate AI Matching", ru: "Сохранить профиль и активировать ИИ" },
  processing: { en: "🤖 Processing...", ru: "🤖 Обработка..." },
  monthlySalary: { en: "Monthly Salary (KZT)", ru: "Ежемесячная зарплата (KZT)" },
  jobRequirements: { en: "Job Requirements", ru: "Требования к работе" },
  analyzeHumanity: { en: "Analyze Humanity", ru: "Анализ человечности" },
  humanityScore: { en: "Humanity Score", ru: "Показатель человечности" },
  bioTooShort: { en: "Bio is too short to analyze.", ru: "Текст слишком короткий для анализа." },
  analyzeFirst: { en: "Please analyze your Humanity Score first!", ru: "Пожалуйста, сначала проанализируйте ваш показатель человечности!" },
  humanityTooLow: { en: "Your Humanity Score is below 60%. Please rewrite your motivation letter to sound more authentic and human.", ru: "Ваш показатель человечности ниже 60%. Пожалуйста, перепишите письмо, чтобы оно звучало более естественно." },
  
  // Feed page
  liveFeed: { en: "Live", ru: "Live" },
  smartMatching: { en: "AI-powered job matching. Upload your CV and let the magic happen.", ru: "ИИ-подбор кадров. Загрузите резюме и позвольте магии случиться." },
  allLocations: { en: "All Locations", ru: "Все локации" },
  addNew: { en: "+ Add New", ru: "+ Добавить" },
  syncingAI: { en: "Syncing with AI Database...", ru: "Синхронизация с базой ИИ..." },
  hiringNow: { en: "Hiring Now", ru: "Ищем сотрудника" },
  negotiable: { en: "Negotiable", ru: "Договорная" },
  apply: { en: "Apply", ru: "Откликнуться" },
  noTags: { en: "No tags generated.", ru: "Теги не сгенерированы." },
  contact: { en: "Contact", ru: "Связаться" },
  noJobs: { en: "No jobs found for this filter.", ru: "Вакансии не найдены." },
  noTalent: { en: "No talent found for this filter.", ru: "Кандидаты не найдены." },
  
  // Profile page
  back: { en: "← Back", ru: "← Назад" },
  backToFeed: { en: "Back to Feed", ru: "Вернуться в ленту" },
  loadingProfile: { en: "Loading Profile...", ru: "Загрузка профиля..." },
  aiVerified: { en: "AI Verified Strengths", ru: "Навыки, подтвержденные ИИ" },
  motivationBio: { en: "Motivation & Bio", ru: "О себе и мотивация" },
  noBio: { en: "This user hasn't written a bio yet.", ru: "Пользователь пока не добавил информацию о себе." },
  contactTelegram: { en: "Contact on Telegram", ru: "Связаться в Telegram" },
};

interface LanguageContextProps {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('ru'); // Default to RU based on request
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Check localStorage on mount
    const saved = localStorage.getItem('language') as Language;
    if (saved === 'en' || saved === 'ru') {
      setLanguage(saved);
    }
    setMounted(true);
  }, []);

  const toggleLanguage = () => {
    const next = language === 'en' ? 'ru' : 'en';
    setLanguage(next);
    localStorage.setItem('language', next);
  };

  const t = (key: string) => {
    if (!translations[key]) {
      console.warn(`Translation key not found: ${key}`);
      return key;
    }
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
