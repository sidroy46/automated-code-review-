# SmartReview AI - AI-Powered Code Review SaaS App

SmartReview AI is a professional full-stack web application designed to automatically review code files and snippets, identify critical vulnerabilities and efficiency bugs, offer step-by-step line explanations, suggest optimized versions, and chat interactively with developer code contexts.

---

## 📂 Folder Structure

```
SmartReviewAI/
├── backend/
│   ├── controllers/
│   │   ├── chatController.js
│   │   └── reviewController.js
│   ├── middleware/
│   │   └── uploadMiddleware.js
│   ├── routes/
│   │   ├── chatRoutes.js
│   │   └── reviewRoutes.js
│   ├── services/
│   │   └── groqService.js
│   ├── uploads/               # Temporary uploads directory
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── LeftPanel.jsx
│   │   │   └── RightPanel.jsx
│   │   ├── pages/
│   │   │   └── Dashboard.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the backend:
   ```bash
   cd backend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file from the example template:
   ```bash
   copy .env.example .env
   ```
4. Update the `.env` variables, adding your **Groq API Key**:
   ```env
   PORT=5000
   GROQ_API_KEY=gsk_your_groq_api_key_here
   ```

### 2. Frontend Setup
1. Open a terminal and navigate to the frontend:
   ```bash
   cd ../frontend
   ```
2. Install packages:
   ```bash
   npm install
   ```
3. Create a `.env` file:
   ```bash
   echo VITE_API_URL=http://localhost:5000/api > .env
   ```

---

## 🚀 Running the App Locally

### 1. Start Backend Server
Inside `/backend` run:
```bash
npm run dev
```
*(Server will start on `http://localhost:5000`)*

### 2. Start Frontend Server
Inside `/frontend` run:
```bash
npm run dev
```
*(Vite App will start on `http://localhost:3000`)*

---

## 🤖 Deployment Steps

### 1. Backend Deployment (e.g. Render, Heroku)
1. Add environment variables `PORT` and `GROQ_API_KEY` in the hosting dashboard.
2. The start script is configured as `npm start`.

### 2. Frontend Deployment (e.g. Vercel, Netlify)
1. Build the production build locally or configure build command:
   ```bash
   npm run build
   ```
2. Output directory is `dist/`.
3. Set the environment variable: `VITE_API_URL=https://your-backend-domain.com/api`
