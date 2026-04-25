/* eslint-disable @typescript-eslint/no-explicit-any */

/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect } from 'react';
import LanguageToggle from '../components/LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function Feed() {
  const { t } = useLanguage();
  const [profiles, setProfiles] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('jobs'); 
  
  // === NEW: ALL THREE FILTERS CONNECTED ===
  const [filterDistrict, setFilterDistrict] = useState('All');
  const [filterIndustry, setFilterIndustry] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profilesRes, vacanciesRes] = await Promise.all([
          fetch('https://mangystau-jobs.onrender.com/profiles'),
          fetch('https://mangystau-jobs.onrender.com/vacancies')
        ]);
        
        if (!profilesRes.ok || !vacanciesRes.ok) throw new Error("Server Error");
        
        const profilesData = await profilesRes.json();
        const vacanciesData = await vacanciesRes.json();
        
        setProfiles(profilesData.data || profilesData);
        setVacancies(vacanciesData.data || vacanciesData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to the backend.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // === BULLETPROOF FILTER LOGIC ===
  const displayedProfiles = profiles.filter(p => {
    // We add fallbacks here so if Ferhad's DB returns null, React doesn't crash
    const pDistrict = p.microdistrict || 'Unknown';
    const pIndustry = p.industry || 'Unknown';
    const pType = p.employment_type || 'Unknown';

    const matchDistrict = filterDistrict === 'All' || pDistrict === filterDistrict;
    const matchIndustry = filterIndustry === 'All' || pIndustry === filterIndustry;
    const matchType = filterType === 'All' || pType === filterType;

    return matchDistrict && matchIndustry && matchType;
  });

  const displayedVacancies = vacancies.filter(v => {
    const vDistrict = v.microdistrict || 'Unknown';
    const vIndustry = v.industry || 'Unknown';
    const vType = v.employment_type || 'Unknown';

    const matchDistrict = filterDistrict === 'All' || vDistrict === filterDistrict;
    const matchIndustry = filterIndustry === 'All' || vIndustry === filterIndustry;
    const matchType = filterType === 'All' || vType === filterType;

    return matchDistrict && matchIndustry && matchType;
  });

  console.log("DATA FROM FERHAD:", profiles[0], vacancies[0]);

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto mb-8">
        {/* TOP ROW: Title & Main Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">Mangy</span>Jobs {t('liveFeed')}
            </h1>
            <p className="text-slate-500 font-medium">{t('smartMatching')}</p>
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap items-center w-full md:w-auto gap-3 md:gap-4">
            <div className="flex-shrink-0 mb-2 sm:mb-0">
              <LanguageToggle />
            </div>
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>
            <a 
              href="https://t.me/KaspianJobAnnouncements" target="_blank" rel="noopener noreferrer"
              className="flex-1 sm:flex-none justify-center bg-[#0088cc] hover:bg-[#007bb5] text-white px-4 py-2.5 rounded-xl font-bold transition-all text-sm shadow-sm flex items-center whitespace-nowrap"
            >
              {t('joinTelegram')}
            </a>
            <button 
              onClick={() => window.location.href = '/'}
              className="flex-1 sm:flex-none bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all text-sm shadow-md whitespace-nowrap"
            >
              {t('addNew')}
            </button>
          </div>
        </div>
        
        {/* BOTTOM ROW: Tabs & Filters unified in a sleek bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-slate-50 p-2 rounded-2xl border border-slate-200 gap-4">
          
          <div className="flex bg-slate-100 p-1 rounded-xl w-full lg:w-auto">
            <button onClick={() => setActiveTab('jobs')} className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              {t('findJob')}
            </button>
            <button onClick={() => setActiveTab('talent')} className={`flex-1 lg:flex-none px-6 py-2.5 rounded-lg font-bold text-sm transition-all ${activeTab === 'talent' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
              {t('findTalent')}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap items-center gap-3 px-2 pb-2 lg:pb-0 w-full lg:w-auto">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1 hidden lg:block">Filter:</span>
              <select 
                value={filterIndustry}
                onChange={(e) => setFilterIndustry(e.target.value)}
                className="flex-1 w-full sm:w-auto min-w-[140px] bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="All">Industry (Сфера)</option>
                <option value="Food & Beverage">{t('foodBev')}</option>
                <option value="IT & Tech">{t('itTech')}</option>
                <option value="Retail & Sales">{t('retailSales')}</option>
              </select>
              
              <select 
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="flex-1 w-full sm:w-auto min-w-[140px] bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="All">Type (Тип)</option>
                <option value="Full-time">{t('fullTime')}</option>
                <option value="Part-time">{t('partTime')}</option>
              </select>

              <select 
                value={filterDistrict} 
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="flex-1 w-full sm:w-auto min-w-[140px] bg-white border border-slate-200 text-slate-700 px-4 py-2.5 rounded-xl font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all cursor-pointer shadow-sm"
              >
                <option value="All">{t('allLocations')}</option>
                <option value="14th">{t('fourteenth')}</option>
                <option value="15th">{t('fifteenth')}</option>
                <option value="27th">{t('twentySeventh')}</option>
                <option value="Seafront">{t('seafront')}</option>
              </select>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="font-bold animate-pulse">{t('syncingAI')}</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-bold">⚠️ {error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* === JOBS TAB === */}
          {activeTab === 'jobs' && displayedVacancies.map((job, index) => (
             <div key={`job-${index}`} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
               <div className="mb-4">
                 <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider mb-2 inline-block">{t('hiringNow')}</span>
                 <h3 className="font-bold text-xl text-slate-900 leading-tight">{job.job_title}</h3>
                 <p className="text-emerald-600 font-semibold">{job.company_name}</p>
                 {/* THIS SHOWS THE TYPE UNDER THE JOB */}
                 <p className="text-slate-500 text-xs mt-1 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded-md">
                    {job.industry || 'Unknown'} • {job.employment_type || 'Full-time'}
                 </p>
               </div>
               <p className="text-slate-600 text-sm mb-4 line-clamp-3">{job.requirements}</p>
               <p className="text-slate-800 font-bold text-lg mb-4">
                💰 {job.salary ? (String(job.salary).replace(/\d+/g, m => Number(m).toLocaleString('ru-RU')) + (String(job.salary).includes('₸') ? '' : ' ₸')) : t('negotiable')}
               </p>
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
                 <a 
                   href={`https://2gis.kz/aktau/search/${encodeURIComponent(job.microdistrict || 'Aktau')}`} 
                   target="_blank" 
                   rel="noopener noreferrer" 
                   className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors cursor-pointer"
                   title="Open in 2GIS"
                 >
                   📍 {job.microdistrict || 'Aktau'}
                 </a>
                 <a href={`https://t.me/${job.telegram_contact?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm">{t('apply')}</a>
               </div>
             </div>
          ))}

          {/* === TALENT TAB === */}
          {activeTab === 'talent' && displayedProfiles.map((profile, index) => (
            <div key={`profile-${index}`} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  {/* === NEW: SHOW PHOTO IF IT EXISTS, OTHERWISE SHOW INITIAL === */}
                  {profile.photo_data ? (
                     <img src={profile.photo_data} alt="Profile" className="w-12 h-12 rounded-full object-cover border-2 border-blue-100" />
                  ) : (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-50">
                      {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                    </div>
                  )}
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{profile.full_name}</h3>
                    <p className="text-blue-600 text-sm font-semibold">{profile.title}</p>
                    {/* THIS SHOWS THE TYPE UNDER THE NAME */}
                    <p className="text-slate-500 text-xs mt-1 font-bold bg-slate-100 inline-block px-2 py-0.5 rounded-md">
                      {profile.industry || 'Unknown'} • {profile.employment_type || 'Full-time'}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mb-4 flex-grow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{t('aiStrengths')}</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.ai_tags ? profile.ai_tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] px-2 py-1 rounded-md font-bold uppercase tracking-wide">{tag.trim()}</span>
                  )) : (
                    <span className="text-slate-400 text-xs italic">{t('noTags')}</span>
                  )}
                </div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-slate-500">📍 {profile.microdistrict || 'Aktau'}</span>
                <div className="flex gap-2">
                  <a href={`/profile/${profile.telegram_username?.replace('@', '')}`} className="bg-white border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors shadow-sm">{t('viewProfile')}</a>
                  <a href={`https://t.me/${profile.telegram_username?.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm">{t('contact')}</a>
                </div>
              </div>
            </div>
          ))}

          {activeTab === 'jobs' && displayedVacancies.length === 0 && !isLoading && <div className="col-span-full text-center p-10 text-slate-500 font-bold">{t('noJobs')}</div>}
          {activeTab === 'talent' && displayedProfiles.length === 0 && !isLoading && <div className="col-span-full text-center p-10 text-slate-500 font-bold">{t('noTalent')}</div>}
        </div>
      )}
    </div>
  );
}
