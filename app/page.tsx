"use client";
import React, { useState } from 'react';

export default function App() {
  const [userType, setUserType] = useState('seeker'); 
  
  // Added 'telegram' to state
  const [seekerData, setSeekerData] = useState({
    name: '',
    title: '',
    microdistrict: '',
    skills: '',
    bio: '',
    telegram: ''
  });

  const [employerData, setEmployerData] = useState({
    companyName: '',
    industry: '',
    microdistrict: '',
    vibe: '',
    achievements: '',
    telegram: ''
  });

  const handleSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setSeekerData({ ...seekerData, [e.target.name]: e.target.value });
    
  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setEmployerData({ ...employerData, [e.target.name]: e.target.value });

 // === FULLY ACTIVE SUBMIT FUNCTION ===
  const handleSubmit = async () => {
    // 1. Map data to Ferhad's exact keys
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
        achievements: employerData.achievements,
        vibe: employerData.vibe,
        telegram_username: employerData.telegram
    };

    // 2. Put Ferhad's exact ngrok URL here!
    // NOTE: Replace "your-ngrok-url" with the actual random words ngrok gave him!
    const backendUrl = "https://your-ngrok-url.ngrok-free.app/profiles"; 

    try {
      console.log("Sending Payload:", payload);

      // 3. The actual API call to Ferhad's server
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true' // VERY IMPORTANT FOR NGROK!
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Success! Profile Sent to Ferhad's AI.");
      } else {
        alert("Error: Ferhad's server rejected the data. Tell him to check his terminal logs!");
      }
      
    } catch (error) {
      console.error("Failed to fetch:", error);
      alert("Network Error: Could not reach the backend. Is Ferhad's ngrok running?");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Aktau<span className="text-blue-600">Match</span>
        </h1>
        <p className="text-slate-500 mb-6 font-medium">Create your smart profile. Skip the CV. Get hired today.</p>
        
        <div className="flex bg-slate-200 p-1.5 rounded-xl w-fit">
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
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-8 text-slate-800">
            {userType === 'seeker' ? 'Build Your Profile' : 'Company Setup'}
          </h2>

          {userType === 'seeker' ? (
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
              {/* TELEGRAM INPUT SEEKER */}
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
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Company Name</label>
                <input type="text" name="companyName" onChange={handleEmployerChange} placeholder="e.g., OceanView Cafe" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Industry</label>
                  <input type="text" name="industry" onChange={handleEmployerChange} placeholder="e.g., Food & Beverage" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
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
               {/* TELEGRAM INPUT EMPLOYER */}
               <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Telegram Username (For Notifications)</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 font-bold">@</span>
                  <input type="text" name="telegram" onChange={handleEmployerChange} placeholder="username" className="w-full p-3.5 pl-8 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Key Selling Point</label>
                <input type="text" name="achievements" onChange={handleEmployerChange} placeholder="e.g., 'Free meals on shift'" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Workplace Vibe</label>
                <textarea name="vibe" onChange={handleEmployerChange} rows={3} placeholder="Describe the atmosphere..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          )}

          <button 
            onClick={handleSubmit}
            className={`w-full mt-10 text-white font-bold text-lg py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${userType === 'seeker' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
          >
            Save Profile & Activate AI Matching
          </button>
        </div>
        
        {/* RIGHT COLUMN: PREVIEW (Simplified for length) */}
        <div className="lg:col-span-5 bg-slate-100/50 rounded-3xl p-6 flex flex-col justify-center items-center border-2 border-dashed border-slate-200">
           <p className="text-slate-500 font-medium">Live Preview Update Active. Check Live Site.</p>
        </div>

      </div>
    </div>
  );
}