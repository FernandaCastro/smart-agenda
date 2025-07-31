# Smart Agenda  🗓️💬

Smart Agenda is a cross-platform task management application built with **React Native (Expo)** on the frontend and **Node.js (Express)** on the backend, using **TypeScript** across both. 
It is a **personal project** developed to practice and improve programming skill, using a modern and well-structured full-stack architecture, while integrating to AI providers.

The app is designed to support natural language input, transforming user messages into structured tasks using AI.

## ✨ Features

- ✅ Create, update, delete, and retrieve tasks
- 💬 Chat-style UI for intuitive task interaction
- 🧠 Natural language understanding powered by OpenAI (other sources planned)
- 📱 Web and Mobile experience (Android, iOS via Expo)
- 🌐 Backend API with structured request/response handling
- 🔐 Token-based authentication (under development)
- 🗂️ Organized architecture with clear separation of concerns

---

## 🔮 Prompt Design
The app sends user input to OpenAI's API using a structured system prompt that extracts the user's intention (create, update, delete, retrieve) and transforms it into a normalized task JSON.

---

## 🧪 Tech Stack

### Frontend
- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [TypeScript](https://www.typescriptlang.org/)

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://platform.openai.com/docs/)

---

## 📁 Folder Structure (WIP)

```
smart-agenda/ 
├── backend/   
├── frontend/
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- Expo CLI
- npm or yarn
- AndroidStudio (optional)

### Installation

```bash
git clone https://github.com/FernandaCastro/smart-agenda.git
cd smart-agenda
```

### Backend
```bash
cd backend
cp .env.example .env # Add your OpenAI key and other config
npm install
npm run dev
```

### Frontend
```bash
cd frontend
cp .env.example .env # Add your your IP to it
npm install
npx expo start
//or npx expo run:android
```

### ⚙️ Environment Variables
Create a .env file in both frontend/ and backend/ folders as needed.

Example for backend:
OPENAI_API_KEY=your_openai_api_key
PORT=3000

---

📈 Roadmap
 - [X] Integrate to OpenAI
      
 - [X] Store tasks in a database

 - [X] Implement user authentication

 - [ ] Add notification/reminder support

 - [ ] Improve prompt context handling

---

## ℹ️ About This Project
This is a personal and non-commercial project created with the goal of practicing modern programming techniques and improving full-stack development skills. It also explores the integration of AI for natural language processing and interaction.

---

## 🪪 License
MIT License.
