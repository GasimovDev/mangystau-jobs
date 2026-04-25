/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useLanguage } from '../../context/LanguageContext';

export default function ProfilePage() {
  const { t } = useLanguage();
  const params = useParams();
  const username = params.username as string;

  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('https://mangystau-jobs.onrender.com/profiles');
        if (!res.ok) throw new Error("Server Error");
        
        const data = await res.json();
        const profilesList = data.data || data;
        
        // Find the profile where telegram_username matches (ignoring @)
        const matched = profilesList.find((p: any) => 
          p.telegram_username && p.telegram_username.replace('@', '').toLowerCase() === username.toLowerCase()
        );

        if (matched) {
          setProfile(matched);
        } else {
          setError("Profile not found.");
        }
      } catch (err) {
        console.error(err);
        setError("Could not connect to the backend.");
      } finally {
        setIsLoading(false);
      }
    };
    if (username) {
      fetchProfile();
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 font-sans text-slate-800 flex items-center justify-center">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="font-bold animate-pulse">{t('loadingProfile')}</p>
        </div>
      ) : error ? (
        <div className="text-center">
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-center font-bold mb-4">⚠️ {error}</div>
          <button onClick={() => window.location.href = '/feed'} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">{t('backToFeed')}</button>
        </div>
      ) : profile ? (
        <div className="w-full max-w-2xl bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-slate-100 relative">
          <button onClick={() => window.location.href = '/feed'} className="absolute top-6 left-6 text-slate-400 hover:text-slate-600 font-bold text-sm">
            {t('back')}
          </button>
          
          <div className="flex flex-col items-center text-center mt-6">
            {profile.photo_data ? (
              <img src={profile.photo_data} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md mb-6" />
            ) : (
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-5xl border-4 border-blue-50 shadow-md mb-6">
                {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : '?'}
              </div>
            )}
            
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{profile.full_name}</h1>
            <p className="text-xl text-blue-600 font-bold mb-4">{profile.title}</p>
            
            <div className="flex gap-2 justify-center mb-8 flex-wrap">
               <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-lg font-bold">
                 {profile.industry || 'Unknown'}
               </span>
               <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-lg font-bold">
                 {profile.employment_type || 'Full-time'}
               </span>
               <span className="bg-slate-100 text-slate-600 text-sm px-3 py-1 rounded-lg font-bold">
                 📍 {profile.microdistrict || 'Aktau'}
               </span>
            </div>

            {profile.ai_tags && (
              <div className="w-full bg-blue-50 rounded-2xl p-6 border border-blue-100 text-left mb-8">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">{t('aiVerified')}</p>
                <div className="flex flex-wrap gap-2">
                  {profile.ai_tags.split(',').map((tag: string, i: number) => (
                    <span key={i} className="bg-white text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg font-bold text-xs shadow-sm">
                      ✨ {tag.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="w-full text-left mb-10">
              <h3 className="font-bold text-lg text-slate-900 mb-3">{t('motivationBio')}</h3>
              <p className="text-slate-600 leading-relaxed bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {profile.bio || t('noBio')}
              </p>
            </div>

            <a 
              href={`https://t.me/${profile.telegram_username?.replace('@', '')}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg mb-4"
            >
              {t('contactTelegram')}
            </a>

            <a 
              href="https://t.me/KaspianJobAnnouncements" 
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold py-4 rounded-xl flex items-center justify-center transition-all shadow-lg"
            >
              {t('joinTelegram')}
            </a>
          </div>
        </div>
      ) : null}
    </div>
  );
}
