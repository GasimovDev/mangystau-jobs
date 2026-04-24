# Project: AktauMatch MVP (Hackathon Deadline Approaching)

**Stack:** Next.js (Frontend), Tailwind CSS, FastAPI (Backend managed by Ferhad), PostgreSQL.

**Current State:** * The entire UI is 100% complete and working. 
* We have successfully built the Seeker/Employer onboarding flows.
* The Live Feed with complex filtering is operational.
* Dynamic Profile Routing (`/profile/[username]`) is built.

**Current Mission:** We are implementing a "Magic AI Autofill" feature. When users upload a PDF CV, the frontend hits `POST /parse-cv` with a `multipart/form-data` file named `cv_file`. The backend parses it into a JSON object (`full_name`, `title`, `skills`, `bio`) to auto-fill the React state. I need you to monitor this endpoint connection with Ferhad's backend and debug any 500 errors if the PDF file buffer gets too large.