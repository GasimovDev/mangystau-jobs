"use client";
import React, { useState, useEffect } from 'react';

export default function Feed() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [vacancies, setVacancies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Hackathon Requirement 05: Filtering
  const [activeTab, setActiveTab] = useState('jobs'); // 'jobs' or 'talent'
  const [filterDistrict, setFilterDistrict] = useState('All');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { 'ngrok-skip-browser-warning': 'true' };
        
        // Fetch BOTH Profiles and Vacancies at the same time
        const [profilesRes, vacanciesRes] = await Promise.all([
          fetch('https://raven-companion-starboard.ngrok-free.dev/profiles', { headers }),
          fetch('https://raven-companion-starboard.ngrok-free.dev/vacancies', { headers })
        ]);
        
        if (!profilesRes.ok || !vacanciesRes.ok) throw new Error("Server Error");
        
        const profilesData = await profilesRes.json();
        const vacanciesData = await vacanciesRes.json();
        
        setProfiles(profilesData.data || profilesData);
        setVacancies(vacanciesData.data || vacanciesData);
        
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to the backend. Is Ferhad's server running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter Logic
  const displayedProfiles = profiles.filter(p => filterDistrict === 'All' || p.microdistrict === filterDistrict);
  const displayedVacancies = vacancies.filter(v => filterDistrict === 'All' || v.microdistrict === filterDistrict);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Aktau<span className="text-blue-600">Match</span> Live Feed
          </h1>
          <p className="text-slate-500 font-medium">Smart matching for Aktau youth and small business.</p>
        </div>
        <div className="flex gap-3">
           <select 
              value={filterDistrict} 
              onChange={(e) => setFilterDistrict(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            >
              <option value="All">All Microdistricts</option>
              <option value="14th">14th Microdistrict</option>
              <option value="15th">15th Microdistrict</option>
              <option value="27th">27th Microdistrict</option>
              <option value="Seafront">Seafront</option>
            </select>
          <button 
            onClick={() => window.location.href = '/'}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-slate-800 transition-all text-sm shadow-sm"
          >
            + Add New
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mb-8 flex bg-slate-200 p-1.5 rounded-xl w-fit">
        <button 
          onClick={() => setActiveTab('jobs')}
          className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Find a Job (Vacancies)
        </button>
        <button 
          onClick={() => setActiveTab('talent')}
          className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${activeTab === 'talent' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Find Talent (Profiles)
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="font-bold animate-pulse">Syncing with AI Database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-bold">
          ⚠️ {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* === JOBS TAB === */}
          {activeTab === 'jobs' && displayedVacancies.map((job, index) => (
             <div key={`job-${index}`} className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 hover:shadow-md transition-shadow flex flex-col">
               <div className="mb-4">
                 <span className="bg-emerald-100 text-emerald-700 text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider mb-2 inline-block">Hiring Now</span>
                 <h3 className="font-bold text-xl text-slate-900 leading-tight">{job.job_title}</h3>
                 <p className="text-emerald-600 font-semibold">{job.company_name}</p>
               </div>
               <p className="text-slate-600 text-sm mb-4 line-clamp-3">{job.requirements}</p>
               <p className="text-slate-800 font-bold mb-4">💰 {job.salary}</p>
               
               <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
                 <span className="text-xs font-bold text-slate-500 flex items-center">
                   📍 {job.microdistrict || 'Aktau'}
                 </span>
                 {/* Hackathon Requirement 06: Apply Flow */}
                 <a 
                   href={`https://t.me/${job.telegram_contact?.replace('@', '')}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg flex items-center transition-colors shadow-sm"
                 >
                   Откликнуться (Apply)
                 </a>
               </div>
             </div>
          ))}

          {/* === TALENT TAB === */}
          {activeTab === 'talent' && displayedProfiles.map((profile, index) => (
            <div key={`profile-${index}`} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xl border-2 border-blue-50">
                    {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-bold text-lg text-slate-900 leading-tight">{profile.full_name}</h3>
                    <p className="text-blue-600 text-sm font-semibold">{profile.title}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-4 flex-grow">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.ai_tags ? profile.ai_tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="bg-blue-50 text-blue-700 border border-blue-100 text-[11px] px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                      {tag.trim()}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-xs italic">No tags generated.</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-slate-500 flex items-center">
                  📍 {profile.microdistrict || 'Aktau'}
                </span>
                <a 
                  href={`https://t.me/${profile.telegram_username?.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  Contact
                </a>
              </div>
            </div>
          ))}

          {/* Empty States */}
          {activeTab === 'jobs' && displayedVacancies.length === 0 && !isLoading && (
            <div className="col-span-full text-center p-10 text-slate-500 font-bold">No jobs found for this filter.</div>
          )}
          {activeTab === 'talent' && displayedProfiles.length === 0 && !isLoading && (
            <div className="col-span-full text-center p-10 text-slate-500 font-bold">No talent found for this filter.</div>
          )}
        </div>
      )}
    </div>
  );
}