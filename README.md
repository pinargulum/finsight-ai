# 🧠 FinSight AI
**AI-Powered Financial Analysis Assistant**  
Built with **FastAPI**, **React**, **OpenAI**, and **MongoDB**

FinSight AI enables users to analyze company performance, market trends, and investment risks using real-time AI insights powered by OpenAI’s GPT models.

---

## 🚀 Features
- 🔐 Secure **JWT Authentication** (Login & Register)
- 💬 **AI-Powered Financial Analysis** using GPT-4o-mini
- 📊 Real-Time Financial Insights
- ⚡ **Protected API Routes** with token-based access
- 💾 MongoDB Integration for user data
- 🎨 Responsive React Frontend
- 🧩 Clean, modular backend architecture (FastAPI)

---

## 🏗️ Tech Stack
| Layer | Technology |
|-------|-------------|
| **Frontend** | React (Vite), JavaScript, CSS |
| **Backend** | FastAPI (Python 3.11) |
| **Database** | MongoDB (AsyncIOMotorClient) |
| **AI Integration** | OpenAI API (gpt-4o-mini) |
| **Auth & Security** | JWT, bcrypt |
| **Deployment** | Railway / Render / Vercel |

---

## ⚙️ Project Structure
finsight-ai/
├── backend/
│ ├── src/
│ │ ├── main.py # FastAPI entry point
│ │ ├── auth.py # Authentication routes
│ │ ├── ai_service.py # OpenAI integration
│ │ ├── database.py # MongoDB connection
│ │ ├── security.py # Hashing & token utilities
│ │ ├── schemas.py # Pydantic models
│ └── .env # Backend environment variables
│
├── frontend/
│ ├── src/
│ │ ├── App.jsx # Root component
│ │ ├── pages/ # Header, Login, Register components
│ │ ├── services/ # API integration (auth & analyze)
│ │ ├── styles/ # CSS files
│ └── .env # Frontend environment variables
│
└── README.md

🔒 Authentication Flow

1. User registers → password is hashed with bcrypt

2. Login returns JWT token

3. Frontend stores token in localStorage

4. Protected endpoints (/analyze, /me) require the token

5. Logout clears the token

🧠 AI Service Flow

1. User submits a financial question or paragraph

2. Backend validates token and forwards the prompt to OpenAI

3. GPT model analyzes and returns structured financial insights

4. Frontend displays results in a clean UI

Example Response:
**Summary**
- Revenue increased 6% YoY, driven by iPhone sales.  
- Services segment grew 12%, led by App Store and iCloud.  
- Supply chain costs impacted gross margins.  
- Expect moderate growth in Q4 due to product launches.

🧩 API Endpoints
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login & receive JWT token
GET	/auth/me	Get current user info
POST	/analyze	Analyze financial prompt (requires token)
GET	/health	Health check

👩‍💻 Author

Pinar Gulum
Full-Stack Developer | AI Applications & Backend Systems

🌱 Future Improvements

. Add conversation history per user

. Export analysis results as PDF

. Add admin role & analytics dashboard

. Multi-language UI

