"use client";
import React, { useState } from 'react';

export default function App() {
  const [userType, setUserType] = useState('seeker'); // 'seeker' or 'employer'
  
  // Seeker State
  const [seekerData, setSeekerData] = useState({
    name: '',
    title: '',
    microdistrict: '',
    skills: '',
    bio: ''
  });

  // Employer State
  const [employerData, setEmployerData] = useState({
    companyName: '',
    industry: '',
    microdistrict: '',
    vibe: '',
    achievements: ''
  });

  const handleSeekerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setSeekerData({ ...seekerData, [e.target.name]: e.target.value });
    
  const handleEmployerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
    setEmployerData({ ...employerData, [e.target.name]: e.target.value });

  // === THE SUBMIT FUNCTION ===
  const handleSubmit = async () => {
    // 1. Figure out which data to send
    const payload = userType === 'seeker' ? seekerData : employerData;
    const endpoint = userType === 'seeker' ? '/api/seekers' : '/api/employers';

    // 2. Ask Ferhad for this exact URL! 
    // Example: "http://localhost:8000" (for testing) or his deployed backend link
    const backendUrl = "REPLACE_WITH_FERHADS_URL" + endpoint; 

    try {
      console.log("Sending data to:", backendUrl);
      console.log("Payload:", payload);

      // 3. Send the POST request
      /* UNCOMMENT THIS WHEN FERHAD GIVES YOU THE URL
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        alert("Profile Saved! AI Matching Activated.");
      } else {
        alert("Error saving profile.");
      }
      */
      
      alert("Ready to send! Just waiting on Ferhad's API URL. Check the console to see the JSON payload.");
    } catch (error) {
      console.error("Failed to fetch:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 p-4 md:p-8">
      {/* Header & Toggle */}
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
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            I'm looking for work
          </button>
          <button 
            onClick={() => setUserType('employer')}
            className={`flex items-center px-6 py-2.5 rounded-lg font-semibold text-sm transition-all ${userType === 'employer' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            I'm an Employer
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* LEFT COLUMN: THE FORM */}
        <div className="lg:col-span-7 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-10">
          <h2 className="text-2xl font-bold mb-8 text-slate-800">
            {userType === 'seeker' ? 'Build Your Profile' : 'Company Setup'}
          </h2>

          {userType === 'seeker' ? (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                <input type="text" name="name" onChange={handleSeekerChange} placeholder="e.g., Arman Serikov" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
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
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Top Skills (comma separated)</label>
                <input type="text" name="skills" onChange={handleSeekerChange} placeholder="Latte Art, Fluent English, Fast Paced" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Short Bio (Keep it real)</label>
                <textarea name="bio" onChange={handleSeekerChange} rows={3} placeholder="I'm a fast learner looking for evening shifts. I live right next to the seafront..." className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
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
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Key Selling Point</label>
                <input type="text" name="achievements" onChange={handleEmployerChange} placeholder="e.g., 'Free meals on shift', 'Young & Fun Team'" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Workplace Vibe</label>
                <textarea name="vibe" onChange={handleEmployerChange} rows={3} placeholder="Describe the atmosphere. Why should local youth work here instead of somewhere else?" className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all resize-none"></textarea>
              </div>
            </div>
          )}

          {/* === THE BUTTON WITH ONCLICK === */}
          <button 
            onClick={handleSubmit}
            className={`w-full mt-10 text-white font-bold text-lg py-4 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${userType === 'seeker' ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
          >
            Save Profile & Activate AI Matching
          </button>
        </div>

        {/* RIGHT COLUMN: LIVE PREVIEW */}
        <div className="lg:col-span-5 bg-slate-100/50 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center border-2 border-dashed border-slate-200">
          <p className="text-xs text-slate-400 mb-6 font-bold uppercase tracking-widest">Live App Preview</p>
          
          {/* Mobile Phone Mockup Container */}
          <div className="w-full max-w-[320px] bg-white rounded-[3rem] shadow-2xl overflow-hidden border-[10px] border-slate-900 relative h-[650px] flex flex-col">
            <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-2xl w-40 mx-auto z-10"></div>
            
            <div className="pt-10 pb-4 px-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
               <span className="font-extrabold text-slate-800 text-lg">AktauMatch</span>
               <div className="w-8 h-8 bg-slate-200 rounded-full"></div>
            </div>

            <div className="p-5 flex-1 bg-slate-50 overflow-y-auto no-scrollbar">
              {userType === 'seeker' ? (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5 text-blue-500 border-4 border-blue-100">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-center text-slate-900 leading-tight">{seekerData.name || 'Your Name'}</h3>
                  <p className="text-center text-blue-600 font-semibold mb-4 mt-1">{seekerData.title || 'Desired Role'}</p>
                  
                  <div className="flex items-center text-slate-500 text-sm mb-6 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
                    <svg className="w-4 h-4 mr-1 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    {seekerData.microdistrict ? `${seekerData.microdistrict} Microdistrict` : 'Aktau Location'}
                  </div>
                  
                  <div className="w-full bg-blue-50/50 p-4 rounded-2xl mb-6">
                    <p className="text-slate-600 text-sm text-center leading-relaxed">
                      "{seekerData.bio || 'Your bio will appear here. Tell employers why they should hire you.'}"
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 pl-1">Key Skills</p>
                    <div className="flex flex-wrap gap-2">
                      {seekerData.skills ? seekerData.skills.split(',').map((skill, i) => (
                        <span key={i} className="bg-white border border-slate-200 shadow-sm text-slate-700 text-xs px-3.5 py-1.5 rounded-lg font-semibold">
                          {skill.trim()}
                        </span>
                      )) : (
                        <span className="bg-slate-100 text-slate-400 text-xs px-3.5 py-1.5 rounded-lg font-medium">Add skills to stand out</span>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
                  <div className="h-32 bg-emerald-500 relative flex items-center justify-center">
                     <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  </div>
                  
                  <div className="p-6 relative">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center absolute -top-8 left-6 border-4 border-white">
                      <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mt-8 leading-tight">{employerData.companyName || 'Company Name'}</h3>
                    <p className="text-emerald-600 font-semibold text-sm mb-4 mt-1">{employerData.industry || 'Industry'}</p>
                    
                    <div className="flex items-center text-slate-500 text-sm mb-5 bg-slate-50 px-3 py-1.5 rounded-lg w-fit border border-slate-100 font-medium">
                      <svg className="w-4 h-4 mr-1.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      {employerData.microdistrict || 'Aktau Location'}
                    </div>

                    {employerData.achievements && (
                      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3.5 mb-5 flex items-start">
                        <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
                        <span className="text-sm text-amber-900 font-semibold">{employerData.achievements}</span>
                      </div>
                    )}

                    <p className="text-slate-600 text-sm leading-relaxed mb-6">
                      {employerData.vibe || 'Your workplace vibe description will go here...'}
                    </p>
                  </div>
                  
                  <div className="p-4 border-t border-slate-100 mt-auto bg-slate-50">
                     <button className="w-full bg-slate-900 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center shadow-md">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                        Send CV via Telegram
                     </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}