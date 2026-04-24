"use client";
import React, { useState, useEffect } from 'react';

export default function Feed() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Automatically fetch data from Ferhad when the page loads
    const fetchProfiles = async () => {
      try {
        const response = await fetch('https://raven-companion-starboard.ngrok-free.dev/profiles', {
          method: 'GET',
          headers: {
            'ngrok-skip-browser-warning': 'true' // Crucial for bypassing the ngrok screen
          }
        });
        
        if (!response.ok) {
          throw new Error(`Server returned ${response.status}`);
        }
        
        const result = await response.json();
        
        // Ferhad's API returns { status: "success", data: [...] }
        if (result.data) {
           setProfiles(result.data);
        } else {
           // Just in case he returns the array directly
           setProfiles(result);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Could not connect to the backend. Is Ferhad's server running?");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Aktau<span className="text-blue-600">Match</span> Feed
          </h1>
          <p className="text-slate-500 font-medium">Live candidate dashboard powered by AI.</p>
        </div>
        <button 
          onClick={() => window.location.href = '/'}
          className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg font-bold hover:bg-slate-100 transition-all text-sm"
        >
          + Add Profile
        </button>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="font-bold animate-pulse">Fetching from database...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-bold">
          ⚠️ {error}
        </div>
      ) : profiles.length === 0 ? (
        <div className="bg-white p-10 rounded-3xl border border-slate-200 text-center shadow-sm">
          <p className="text-slate-500 font-bold text-lg mb-2">No profiles found yet!</p>
          <p className="text-slate-400 text-sm">Go back and add a test profile to see it here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {profiles.map((profile, index) => (
            <div key={index} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
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
              
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">AI Strengths</p>
                <div className="flex flex-wrap gap-1.5">
                  {profile.ai_tags ? profile.ai_tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] px-2 py-1 rounded-md font-bold uppercase tracking-wide">
                      {tag.trim()}
                    </span>
                  )) : (
                    <span className="text-slate-400 text-xs italic">No tags generated.</span>
                  )}
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between mt-auto">
                <span className="text-xs font-bold text-slate-500 flex items-center">
                  <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  {profile.microdistrict || 'Aktau'}
                </span>
                <a 
                  href={`https://t.me/${profile.telegram_username?.replace('@', '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center transition-colors shadow-sm"
                >
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.223-.548.223l.188-2.85 5.18-4.686c.223-.225-.046-.35-.35-.146l-6.4 4.02-2.76-.864c-.6-.187-.61-.6-.125-.793l10.796-4.162c.5-.187.945.105.786.915z"/></svg>
                  Contact
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}