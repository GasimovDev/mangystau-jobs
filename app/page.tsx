"use client";
import React, { useState } from 'react';
import LanguageToggle from './components/LanguageToggle';
import { useLanguage } from './context/LanguageContext';

export default function App() {
  const { t } = useLanguage();
  const [userType, setUserType] = useState('seeker'); 
  const [isLoading, setIsLoading] = useState(false);
  const [isParsingCV, setIsParsingCV] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  
  const [seekerData, setSeekerData] = useState({
    name: '', title: '', microdistrict: '', industry: 'Food & Beverage', type: 'Full-time', skills: '', bio: '', telegram: '', photoBase64: ''
  });

  // === FIXED: MATCHING FERHAD'S DB EXACTLY ===
  const [employerData, setEmployerData] = useState({
    companyName: '', industry: 'Food & Beverage', type: 'Full-time', microdistrict: '', jobTitle: '', requirements: '', salary: '', telegram: ''
  });

  const handleSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setSeekerData({ ...seekerData, [e.target.name]: e.target.value });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // This converts the image to a long text string!
        setSeekerData(prev => ({ ...prev, photoBase64: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsParsingCV(true);
    const formData = new FormData();
    formData.append('cv_file', file);

    try {
      const res = await fetch('/api/parse-cv', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: res.statusText }));
        alert(`Error parsing CV: ${err.error || res.statusText}`);
        return;
      }

      const parsedData = await res.json();
      
      // Farhad's backend might wrap the response in a 'data' key or an array
      const actualData = Array.isArray(parsedData?.data) ? parsedData.data[0] : (parsedData?.data || parsedData);
      
      console.log("Magic AI Data:", actualData);

      setSeekerData(prev => ({
        ...prev,
        name: actualData.full_name || actualData.name || prev.name,
        title: actualData.title || actualData.job_title || actualData.role || prev.title,
        skills: actualData.skills || actualData.top_skills || prev.skills,
        bio: actualData.bio || actualData.motivation || prev.bio,
      }));
      
      alert("✨ Magic AI Autofill Complete! (Check console if fields are empty)");
    } catch (error) {
      console.error("CV Upload failed:", error);
      alert("Network Error: Could not reach the CV parsing service.");
    } finally {
      setIsParsingCV(false);
    }
  };
    
  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setEmployerData({ ...employerData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    if (userType === 'seeker') {
      const missing = [];
      if (!seekerData.name) missing.push("Full Name");
      if (!seekerData.title) missing.push("Desired Role");
      if (!seekerData.microdistrict) missing.push("Microdistrict");
      if (!seekerData.skills) missing.push("Top Skills");
      if (!seekerData.bio) missing.push("Motivation Letter");
      if (!seekerData.telegram) missing.push("Telegram Username");

      if (missing.length > 0) {
        alert(`Missing Seeker Fields: ${missing.join(", ")}`);
        return;
      }
    } else {
      const missing = [];
      if (!employerData.companyName) missing.push("Company Name");
      if (!employerData.jobTitle) missing.push("Job Title");
      if (!employerData.microdistrict) missing.push("Microdistrict");
      if (!employerData.salary) missing.push("Salary");
      if (!employerData.telegram) missing.push("Telegram Contact");
      if (!employerData.requirements) missing.push("Requirements");

      if (missing.length > 0) {
        alert(`Missing Employer Fields: ${missing.join(", ")}`);
        return;
      }
    }
    setIsLoading(true);

    // === FIXED: MAPPING TO FERHAD'S EXACT KEYS ===
    const payload = userType === 'seeker' ? {
        full_name: seekerData.name,
        title: seekerData.title,
        microdistrict: seekerData.microdistrict,
        industry: seekerData.industry,               
        employment_type: seekerData.type,            
        photo_data: "",   // <--- BYPASSING THE MASSIVE IMAGE CRASH
        skills: seekerData.skills,
        bio: seekerData.bio,
        telegram_username: seekerData.telegram
    } : {
        company_name: employerData.companyName,
        industry: employerData.industry,
        employment_type: employerData.type,        // NEW: This fixes the filters!
        microdistrict: employerData.microdistrict,
        job_title: employerData.jobTitle,
        requirements: employerData.requirements,
        salary: employerData.salary,
        telegram_contact: employerData.telegram 
    };

    const backendUrl = userType === 'seeker' 
      ? "https://raven-companion-starboard.ngrok-free.dev/profiles" 
      : "https://raven-companion-starboard.ngrok-free.dev/vacancies"; 

    try {
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' 
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        const finalData = Array.isArray(result.data) ? result.data[0] : (result.data || result);
        setSuccessData(finalData); 
        
        // Attempt to automatically open the Telegram channel in a new tab
        window.open('https://t.me/KaspianJobAnnouncements', '_blank');
      } else {
        const errorText = await response.text();
        alert(`Server Error! Press F12. Logs: ${errorText}`);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
      alert("Network Error: Could not reach the backend.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Aktau<span className="text-blue-600">Match</span>
          </h1>
          <p className="text-slate-500 mb-6 font-medium">{t('createProfile')}</p>
        </div>
        <LanguageToggle />
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <div className="lg:col-span-7">
          {successData ? (
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8 md:p-12 flex flex-col items-center text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500 border-4 border-emerald-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">{t('successSaved')}</h2>
              <p className="text-slate-500 font-medium mb-8">{t('successAI')}</p>
              
              {/* Only show AI tags if it's a Seeker (Employers might not have tags depending on Ferhad's code) */}
              {successData.ai_tags && (
                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">{t('aiStrengths')}</p>
                  <div className="flex flex-wrap gap-2">
                    {successData.ai_tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                        ✨ {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {userType === 'seeker' && (successData?.telegram_username || seekerData.telegram) && (
                <button 
                  onClick={() => window.location.href = `/profile/${(successData?.telegram_username || seekerData.telegram).replace('@', '')}`} 
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg w-full flex justify-center items-center mb-4"
                >
                  {t('viewProfile')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </button>
              )}

              <a 
                href="https://t.me/KaspianJobAnnouncements" 
                target="_blank"
                rel="noopener noreferrer"
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg w-full flex justify-center items-center mb-4"
              >
                {t('joinTelegram')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
              </a>

              <button 
                onClick={() => window.location.href = '/feed'} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg w-full flex justify-center items-center"
              >
                {t('goFeed')}
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
              <div className="flex bg-slate-200 p-1.5 rounded-xl w-fit mb-8">
                <button 
                  onClick={() => setUserType('seeker')}
                  className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${userType === 'seeker' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t('lookingForWork')}
                </button>
                <button 
                  onClick={() => setUserType('employer')}
                  className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${userType === 'employer' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  {t('amEmployer')}
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-8 text-slate-800">
                {userType === 'seeker' ? t('buildProfile') : t('postVacancy')}
              </h2>

              {userType === 'seeker' ? (
                // === SEEKER FORM (UNCHANGED) ===
                <div className="space-y-5">
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                      <h3 className="font-bold text-blue-900 flex items-center gap-2">
                        {t('magicAI')}
                      </h3>
                      <p className="text-sm text-blue-700 mt-1">{t('uploadCV')}</p>
                    </div>
                    <div className="relative">
                      <input 
                        type="file" 
                        accept="application/pdf, image/jpeg, image/png" 
                        onChange={handleCVUpload}
                        disabled={isParsingCV}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
                      />
                      <button 
                        disabled={isParsingCV}
                        className={`bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all ${isParsingCV ? 'opacity-70 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                      >
                        {isParsingCV ? t('parsing') : t('uploadCVBtn')}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('fullName')}</label>
                      <input type="text" name="name" value={seekerData.name} onChange={handleSeekerChange} placeholder="e.g., Arman Serikov" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('cvPhoto')}</label>
                      {/* NEW FILE UPLOAD */}
                      <input type="file" accept="image/png, image/jpeg" onChange={handlePhotoUpload} className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('desiredRole')}</label>
                      <input type="text" name="title" value={seekerData.title} onChange={handleSeekerChange} placeholder="e.g., Barista" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('industry')}</label>
                      <select name="industry" value={seekerData.industry} onChange={handleSeekerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                        <option value="Food & Beverage">{t('foodBev')}</option>
                        <option value="IT & Tech">{t('itTech')}</option>
                        <option value="Retail & Sales">{t('retailSales')}</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('type')}</label>
                      <select name="type" value={seekerData.type} onChange={handleSeekerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                        <option value="Full-time">{t('fullTime')}</option>
                        <option value="Part-time">{t('partTime')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('microdistrict')}</label>
                      <select name="microdistrict" value={seekerData.microdistrict} onChange={handleSeekerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                        <option value="">{t('selectLocation')}</option>
                        <option value="14th">{t('fourteenth')}</option>
                        <option value="15th">{t('fifteenth')}</option>
                        <option value="27th">{t('twentySeventh')}</option>
                        <option value="Seafront">{t('seafront')}</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('telegramUsername')}</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                        <input type="text" name="telegram" value={seekerData.telegram} onChange={handleSeekerChange} placeholder="username" className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('topSkills')}</label>
                    <input type="text" name="skills" value={seekerData.skills} onChange={handleSeekerChange} placeholder="Latte Art, Fluent English, Fast Paced" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('motivationLetter')}</label>
                    <textarea name="bio" value={seekerData.bio} onChange={handleSeekerChange} rows={4} placeholder="..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              ) : (
                // === FIXED EMPLOYER FORM ===
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('companyName')}</label>
                      <input type="text" name="companyName" onChange={handleEmployerChange} placeholder="e.g., OceanView Cafe" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('industry')}</label>
                      <select name="industry" value={employerData.industry} onChange={handleEmployerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none">
                        <option value="Food & Beverage">{t('foodBev')}</option>
                        <option value="IT & Tech">{t('itTech')}</option>
                        <option value="Retail & Sales">{t('retailSales')}</option>
                      </select>
                    </div>
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('type')}</label>
                      <select name="type" value={employerData.type} onChange={handleEmployerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none">
                        <option value="Full-time">{t('fullTime')}</option>
                        <option value="Part-time">{t('partTime')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('jobTitle')}</label>
                      <input type="text" name="jobTitle" onChange={handleEmployerChange} placeholder="e.g., Barista needed" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('microdistrict')}</label>
                      <select name="microdistrict" onChange={handleEmployerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none">
                        <option value="">{t('selectLocation')}</option>
                        <option value="14th">{t('fourteenth')}</option>
                        <option value="15th">{t('fifteenth')}</option>
                        <option value="Seafront">{t('seafront')}</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('monthlySalary')}</label>
                      <input type="number" name="salary" onChange={handleEmployerChange} placeholder="e.g., 200,000 KZT" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('hrTelegram')}</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                        <input type="text" name="telegram" onChange={handleEmployerChange} placeholder="username" className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">{t('jobRequirements')}</label>
                    <textarea name="requirements" onChange={handleEmployerChange} rows={3} placeholder="..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              )}

              <button 
                onClick={handleSubmit}
                disabled={isLoading}
                className={`w-full mt-10 text-white font-bold text-lg py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 
                ${userType === 'seeker' ? 'bg-blue-600 shadow-blue-200' : 'bg-emerald-600 shadow-emerald-200'} 
                ${isLoading ? 'opacity-70 cursor-not-allowed animate-pulse' : ''}`}
              >
                {isLoading ? t('processing') : t('saveProfile')}
              </button>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN: IMAGE OVERRIDE */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <img src="/hero.jpeg" alt="AktauMatch AI" className="rounded-3xl shadow-lg w-full object-cover" />
        </div>

      </div>
    </div>
  );
}