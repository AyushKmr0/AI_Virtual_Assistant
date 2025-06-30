# 🧠 AI Virtual Assistant

A voice-based virtual assistant built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It allows users to speak commands naturally and receive voice responses using the browser's built-in speech synthesis.

![Screenshot 2025-06-30 145238](https://github.com/user-attachments/assets/acd4342c-bf5d-4d02-8512-282406c8b886)

---

## 🚀 Current Features

- 🎤 Voice input via Web Speech API (SpeechRecognition)
- 🔊 Voice output using browser's `SpeechSynthesisUtterance` (not Google TTS yet)
- 🌐 Smart command support: open websites, search Google, etc.
- 🖼️ Assistant image customization:
  - Predefined images
  - Option to upload custom images
- 🔐 Sign in / Sign up with Google and GitHub (OAuth)
- 🧠 Basic AI command response logic using Gemini handler
- 🧾 History memory system (assistant remembers recent conversation context using MongoDB, up to last 100 commands) 

---

## 📁 Folder Structure

```lua
Virtual_Assistant/
├── backend/          # Node.js + Express + MongoDB
├── frontend/         # React.js UI with voice integration
├── .gitignore
├── README.md

```
---

## 🛠️ Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Auth**: Google OAuth, GitHub OAuth
- **Voice Input**: Web Speech API
- **Voice Output**: `SpeechSynthesisUtterance` (browser-based)

---

## 🧪 Features Coming Soon

- 📬 OTP-based email verification during sign-up
- 💬 Real-time assistant chat interface
- 🗣️ Google Cloud Text-to-Speech (WaveNet) for natural voice
- 👥 Voice selection (male/female/custom)

---

## 🧰 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/AyushKmr0/AI_Virtual_Assistant.git
cd AI_Virtual_Assistant

```

## 2. Install Dependencies

#Backend:

```bash
cd .\backend\
npm install

```

#Frontend:

```bash
cd ..\frontend\
npm install

```

## 3. Environment Variables

Create .env file inside the backend/ folder.

```env

PORT=8000
MONGODB_URL=your_mongodb_url
JWT_SECRET=your_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

SESSION_SECRET=your_session_secret

GOOGLE_CLIENT_ID=your_google_id
GOOGLE_CLIENT_SECRET=your_google_secret

GITHUB_CLIENT_ID=your_github_id
GITHUB_CLIENT_SECRET=your_github_secret

```

## 4. Run the App

# Backend:

```bash
npm run dev

# Frontend:

```bash
npm run dev

```

## 👨‍💻 Author

Made with ❤️ by Ayush
