from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import httpx, base64, json

app = FastAPI()

# 1. Allow Frontend to talk to Backend (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Configuration & Keys
SUPABASE_URL = "https://tisfyihnczwyibxulkix.supabase.co"
SUPABASE_KEY = "sb_publishable_GsMRmkpqQiMTVbTxxhm_6A_JJkMV-bo"
GEMINI_KEY = "AIzaSyARIhn5lvpEFNk5vz1VqBiS-W83_7MPkxs"
TELEGRAM_TOKEN = "8723180841:AAGAeCjgOYeYSs5LqmLFVyyiqkWeymBwoY8"
TELEGRAM_CHAT_ID = "@KaspianJobAnnouncements"
FRONTEND_URL = "https://mangystau-jobs.vercel.app"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# 3. Data Models
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
    microdistrict: str
    industry: str
    employment_type: str
    requirements: str
    salary: str  # We keep this as the main input
    telegram_contact: str

# 4. API Endpoints
@app.get("/")
async def root():
    return {"status": "online", "project": "Mangystau Jobs", "city": "Aktau"}

@app.get("/vacancies")
async def get_vacancies():
    try:
        response = supabase.table("vacancies").select("*").order("created_at", desc=True).execute()
        # FIX: Ensure frontend sees 'price' even if database uses 'salary'
        data = []
        for item in response.data:
            if 'salary' in item and ('price' not in item or item['price'] is None):
                item['price'] = item['salary']
            data.append(item)
        return data
    except Exception as e:
        return {"error": str(e)}

@app.post("/vacancies")
async def create_vacancy(vacancy: Vacancy):
    try:
        # Save to both 'salary' and 'price' columns to prevent "NaN" errors
        data = vacancy.dict()
        data['price'] = vacancy.salary 
        supabase.table("vacancies").insert(data).execute()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/parse-cv")
async def parse_cv(cv_file: UploadFile = File(...)):
    try:
        content = await cv_file.read()
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key={GEMINI_KEY}"
        payload = {
            "contents": [{
                "parts": [
                    {"text": "Extract 'full_name', 'title', 'skills', 'bio' from this CV as JSON."},
                    {"inline_data": {"mime_type": cv_file.content_type, "data": base64.b64encode(content).decode('utf-8')}}
                ]
            }]
        }
        async with httpx.AsyncClient() as client:
            res = await client.post(url, json=payload, timeout=60.0)
            result = res.json()['candidates'][0]['content']['parts'][0]['text']
            return json.loads(result.replace("```json", "").replace("```", "").strip())
    except:
        return {"full_name": "Applicant", "title": "Job Seeker", "skills": "Available in CV", "bio": "Bio extracted by AI"}

@app.post("/profiles")
async def create_profile(profile: UserProfile):
    try:
        supabase.table("profiles").insert(profile.dict()).execute()
        clean_user = profile.telegram_username.replace("@", "").strip()
        profile_url = f"{FRONTEND_URL}/profile/{clean_user}"
        
        msg = f"🚀 <b>Yeni Namizəd!</b>\n👤 <b>{profile.full_name}</b>\n💼 {profile.title}\n📍 {profile.microdistrict}"
        
        async with httpx.AsyncClient() as client:
            await client.post(f"https://api.telegram.org/bot{TELEGRAM_TOKEN}/sendMessage", 
                             json={
                                 "chat_id": TELEGRAM_CHAT_ID, 
                                 "text": msg, 
                                 "parse_mode": "HTML",
                                 "reply_markup": {"inline_keyboard": [[{"text": "🔍 Profilə Bax", "url": profile_url}]]}
                             })
        return {"status": "success"}
    except:
        return {"status": "error"}

@app.get("/profiles")
async def get_profiles():
    return supabase.table("profiles").select("*").order("created_at", desc=True).execute().data