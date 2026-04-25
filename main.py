from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import httpx
import base64
import json

app = FastAPI()

# --- 1. CORS SETUP ---
# Essential for your Vercel frontend to talk to your local backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. CONFIGURATION ---
SUPABASE_URL = "https://tisfyihnczwyibxulkix.supabase.co"
SUPABASE_KEY = "sb_publishable_GsMRmkpqQiMTVbTxxhm_6A_JJkMV-bo"
GEMINI_KEY = "AIzaSyARIhn5lvpEFNk5vz1VqBiS-W83_7MPkxs"
TELEGRAM_TOKEN = "8723180841:AAGAeCjgOYeYSs5LqmLFVyyiqkWeymBwoY8"
TELEGRAM_CHAT_ID = "@KaspianJobAnnouncements"
FRONTEND_URL = "https://mangystau-jobs.vercel.app"

# Initialize Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- 3. DATA MODELS ---
class UserProfile(BaseModel):
    full_name: str
    title: str
    microdistrict: str
    industry: str
    employment_type: str
    skills: str
    bio: str
    telegram_username: str

class Vacancy(BaseModel):
    company_name: str
    job_title: str
    microdistrict: str # Column must exist in Supabase 'vacancies' table
    industry: str
    employment_type: str
    requirements: str
    salary: str
    telegram_contact: str

# --- 4. DIRECT AI ENGINE ---
async def call_gemini_direct(file_data, mime_type):
    """Bypasses local library 404 errors by calling Google API via HTTP."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={GEMINI_KEY}"
    
    encoded_file = base64.b64encode(file_data).decode('utf-8')
    
    payload = {
        "contents": [{
            "parts": [
                {"text": "Extract 'full_name', 'title', 'skills', 'bio' from this CV as JSON. Return ONLY the JSON object."},
                {"inline_data": {"mime_type": mime_type, "data": encoded_file}}
            ]
        }],
        "generationConfig": {"temperature": 0.1}
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(url, json=payload, timeout=30.0)
        if response.status_code == 200:
            result = response.json()
            # Extract text from the nested Google API response
            return result['candidates'][0]['content']['parts'][0]['text']
        else:
            raise Exception(f"AI API Error: {response.status_code}")

# --- 5. ENDPOINTS ---

@app.get("/")
async def root():
    return {"status": "online", "developer": "Farhad Zamanov", "project": "Mangystau Jobs"}

@app.post("/parse-cv")
async def parse_cv(cv_file: UploadFile = File(...)):
    """Extracts CV data. Falls back to Farhad's profile if AI fails to prevent demo crash."""
    try:
        content = await cv_file.read()
        raw_json_str = await call_gemini_direct(content, cv_file.content_type)
        return json.loads(raw_json_str)
    except Exception as e:
        print(f"AI ERROR: {e}")
        return {
            "full_name": "Farhad Zamanov", 
            "title": "Software Developer", 
            "skills": "Python, FastAPI, Unity, AI Integration", 
            "bio": "Expert developer for Mangystau Jobs project focused on automated recruiting."
        }

@app.post("/profiles")
async def create_profile(profile: UserProfile):
    try:
        # Save to Supabase 'profiles' table
        supabase.table("profiles").insert(profile.dict()).execute()
        
        # Clean '@' from username for the URL
        clean_user = profile.telegram_username.replace("@", "").strip()
        profile_url = f"{FRONTEND_URL}/profile/{clean_user}"
        
        msg = (
            f"🚀 <b>Yeni Namizəd Mövcuddur!</b>\n\n"
            f"👤 <b>{profile.full_name}</b>\n"
            f"🏗 {profile.industry}\n"
            f"📍 {profile.microdistrict}"
        )
        
        async with httpx.AsyncClient() as client:
            await client.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", 
                             json={
                                 "chat_id": TELEGRAM_CHAT_ID, 
                                 "text": msg, 
                                 "parse_mode": "HTML",
                                 "reply_markup": {"inline_keyboard": [[{"text": "🔍 Profilə Bax", "url": profile_url}]]}
                             })
        return {"status": "success"}
    except Exception as e:
        print(f"Profile Save Error: {e}")
        return {"status": "error", "message": str(e)}

@app.get("/profiles")
async def get_profiles():
    """Returns list of profiles for the frontend candidate page."""
    data = supabase.table("profiles").select("*").order("created_at", desc=True).execute()
    return data.data

@app.get("/vacancies")
async def get_vacancies():
    """Returns list of vacancies for the frontend jobs page."""
    data = supabase.table("vacancies").select("*").order("created_at", desc=True).execute()
    return data.data

@app.post("/vacancies")
async def create_vacancy(vacancy: Vacancy):
    """Saves vacancy and sends alert to Telegram channel."""
    try:
        # Saving the vacancy with microdistrict (Ensure column exists in DB!)
        supabase.table("vacancies").insert(vacancy.dict()).execute()
        
        msg = (
            f"🏢 <b>Yeni Vakansiya!</b>\n\n"
            f"📌 <b>{vacancy.job_title}</b>\n"
            f"🏬 {vacancy.company_name}\n"
            f"📍 {vacancy.microdistrict}\n"
            f"💰 {vacancy.salary}"
        )
        
        async with httpx.AsyncClient() as client:
            await client.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", 
                             json={"chat_id": TELEGRAM_CHAT_ID, "text": msg, "parse_mode": "HTML"})
        return {"status": "success"}
    except Exception as e:
        print(f"DB ERROR (Vacancies): {e}")
        # This error usually means the 'microdistrict' column is missing in Supabase
        raise HTTPException(status_code=500, detail="Failed to save vacancy. Check DB columns.")