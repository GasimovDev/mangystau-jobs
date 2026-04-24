"use client";
import React, { useState } from 'react';

export default function App() {
  const [userType, setUserType] = useState('seeker'); 
  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<any>(null);
  
  const [seekerData, setSeekerData] = useState({
    name: '', title: '', microdistrict: '', skills: '', bio: '', telegram: ''
  });

  // === FIXED: MATCHING FERHAD'S DB EXACTLY ===
  const [employerData, setEmployerData] = useState({
    companyName: '', industry: '', microdistrict: '', jobTitle: '', requirements: '', salary: '', telegram: ''
  });

  const handleSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setSeekerData({ ...seekerData, [e.target.name]: e.target.value });
    
  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setEmployerData({ ...employerData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setIsLoading(true);

    // === FIXED: MAPPING TO FERHAD'S EXACT KEYS ===
    const payload = userType === 'seeker' ? {
        full_name: seekerData.name,
        title: seekerData.title,
        microdistrict: seekerData.microdistrict,
        skills: seekerData.skills,
        bio: seekerData.bio,
        telegram_username: seekerData.telegram
    } : {
        company_name: employerData.companyName,
        industry: employerData.industry,
        microdistrict: employerData.microdistrict,
        job_title: employerData.jobTitle,
        requirements: employerData.requirements,
        salary: employerData.salary,
        telegram_contact: employerData.telegram // Note the exact key name!
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
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Aktau<span className="text-blue-600">Match</span>
        </h1>
        <p className="text-slate-500 mb-6 font-medium">Create your smart profile. Skip the CV. Get hired today.</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        <div className="lg:col-span-7">
          {successData ? (
            <div className="bg-white rounded-3xl shadow-sm border border-emerald-100 p-8 md:p-12 flex flex-col items-center text-center animate-fade-in-up">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6 text-emerald-500 border-4 border-emerald-50">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Data Saved Successfully!</h2>
              <p className="text-slate-500 font-medium mb-8">Your information has been processed by our AI matching engine.</p>
              
              {/* Only show AI tags if it's a Seeker (Employers might not have tags depending on Ferhad's code) */}
              {successData.ai_tags && (
                <div className="w-full bg-slate-50 rounded-2xl p-6 border border-slate-100 text-left mb-8">
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">AI Generated Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {successData.ai_tags.split(',').map((tag: string, i: number) => (
                      <span key={i} className="bg-blue-100 text-blue-700 border border-blue-200 px-4 py-2 rounded-xl font-bold text-sm shadow-sm">
                        ✨ {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button 
                onClick={() => window.location.href = '/feed'} 
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg w-full flex justify-center items-center"
              >
                Go to the Live Feed 
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
                  I'm looking for work
                </button>
                <button 
                  onClick={() => setUserType('employer')}
                  className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${userType === 'employer' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  I'm an Employer
                </button>
              </div>

              <h2 className="text-2xl font-bold mb-8 text-slate-800">
                {userType === 'seeker' ? 'Build Your Profile' : 'Post a Vacancy'}
              </h2>

              {userType === 'seeker' ? (
                // === SEEKER FORM (UNCHANGED) ===
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                    <input type="text" name="name" onChange={handleSeekerChange} placeholder="e.g., Arman Serikov" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Desired Role</label>
                      <input type="text" name="title" onChange={handleSeekerChange} placeholder="e.g., Barista" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Microdistrict</label>
                      <select name="microdistrict" onChange={handleSeekerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none">
                        <option value="">Select location...</option>
                        <option value="14th">14th Microdistrict</option>
                        <option value="15th">15th Microdistrict</option>
                        <option value="27th">27th Microdistrict</option>
                        <option value="Other">Other (Aktau)</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Telegram Username</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                      <input type="text" name="telegram" onChange={handleSeekerChange} placeholder="username" className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Top Skills (comma separated)</label>
                    <input type="text" name="skills" onChange={handleSeekerChange} placeholder="Latte Art, Fluent English, Fast Paced" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Short Bio</label>
                    <textarea name="bio" onChange={handleSeekerChange} rows={3} placeholder="I'm a fast learner looking for evening shifts..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                  </div>
                </div>
              ) : (
                // === FIXED EMPLOYER FORM ===
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                      <input type="text" name="companyName" onChange={handleEmployerChange} placeholder="e.g., OceanView Cafe" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry</label>
                      <input type="text" name="industry" onChange={handleEmployerChange} placeholder="e.g., Food & Beverage" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Title</label>
                      <input type="text" name="jobTitle" onChange={handleEmployerChange} placeholder="e.g., Barista needed" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Microdistrict</label>
                      <select name="microdistrict" onChange={handleEmployerChange} className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none">
                        <option value="">Select location...</option>
                        <option value="14th">14th Microdistrict</option>
                        <option value="15th">15th Microdistrict</option>
                        <option value="Seafront">Aktau Seafront</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                     <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Monthly Salary (KZT)</label>
                      <input type="text" name="salary" onChange={handleEmployerChange} placeholder="e.g., 200,000 KZT" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1.5">Telegram Contact</label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                        <input type="text" name="telegram" onChange={handleEmployerChange} placeholder="username" className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Job Requirements</label>
                    <textarea name="requirements" onChange={handleEmployerChange} rows={3} placeholder="What are the daily tasks and required skills?..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
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
                {isLoading ? '🤖 Processing...' : 'Save Profile & Activate AI Matching'}
              </button>
            </div>
          )}
        </div>
        
        {/* RIGHT COLUMN: IMAGE OVERRIDE */}
        <div className="lg:col-span-5 flex justify-center items-center">
          <img src="/hero.png" alt="AktauMatch AI" className="rounded-3xl shadow-lg w-full object-cover" />
        </div>

      </div>
    </div>
  );
}