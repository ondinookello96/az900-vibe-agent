# 🎧 AfriCloud AZ-900: Cognitive Readiness & Learning Journey Tracker
> **Hackathon Track:** 📊 **Progress: Readiness Tracker**  
> **Theme:** *"Building Smarter Exam Prep Tools from Our Own Learning Journey"*  
> **Initiative:** #1MillionDevs Movement Vibe Coding Hackathon (October 2026)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Hackathon Track](https://img.shields.io/badge/Track-Progress%3A%20Readiness%20Tracker-purple.svg)](#)
[![GitHub Repo](https://img.shields.io/badge/GitHub-ondinookello96%2Faz900--vibe--agent-blue.svg)](https://github.com/ondinookello96/az900-vibe-agent)
[![AZ-900](https://img.shields.io/badge/Certification-AZ--900%20Azure%20Fundamentals-0078D4.svg)](https://learn.microsoft.com/en-us/credentials/certifications/azure-fundamentals/)
[![Community](https://img.shields.io/badge/Community-%231MillionDevs-amber.svg)](https://1milliondevs.org)
[![Status](https://img.shields.io/badge/Status-Unofficial%20Community%20Tool-emerald.svg)](#)

---

## 🎯 The Challenge: "Progress: Readiness Tracker"

* **The Problem:** Many learners study aimlessly and often don't know if they are truly ready to sit the AZ-900 exam, leading to wasted \$99 exam vouchers or crippling test anxiety. Traditional tools only give a blunt, unweighted test score without diagnosing root causes.
* **Our Solution:** **AfriCloud AZ-900** is an **Agentic Cognitive Readiness Tracker**. It models the learner's knowledge state using multi-signal tracking (baseline self-assessment, active recall, practice quizzes), applies official Microsoft syllabus weights (27.5% / 37.5% / 35%), and provides a closed-loop prescriptive dashboard that tells the learner **exactly what their weak areas are, why they are weak, and how to revise them using their personal learning style (VARK)**.

---

## 🚀 Key Features

### 1. 🧠 Cognitive Journey & Readiness Tracker
- Evaluates real-time understanding across all 3 official AZ-900 domains:
  - **Describe Cloud Concepts** (25–30%)
  - **Describe Azure Architecture and Services** (35–40%)
  - **Describe Azure Management and Governance** (30–35%)
- Visual circular readiness gauge (0–100%) that indicates when you are truly **"Exam Ready 🚀"**.
- Automatically diagnoses **High-Priority Weak Areas** where mastery is below 70%.

### 2. 📝 Smart Quiz Builder with "Why It's Wrong" Deep Dives
- Original pedagogical questions mapped strictly to the public Microsoft Learn outline.
- Instant feedback breaking down **why the correct answer is right** and **why every single distractor is inaccurate**.
- Confetti celebration, audio feedback, and streak tracking.

### 3. 🎨 Adaptive Learning Styles Engine (VARK Framework)
The agent personalizes revision depending on how your brain absorbs cloud concepts:
- **👁️ Visual Explorer:** Architecture maps, responsibility boundaries, hierarchy trees, and color-coded comparison matrices.
- **🎧 Auditory & Storyteller:** Culturally resonant African analogies (M-Pesa kiosks for Availability Zones; grain granaries for Storage tiers; matatus for IaaS/PaaS/SaaS).
- **🛠️ Kinesthetic Builder:** Hands-on Azure CLI command sandboxes (`az group create`, `az role assignment create`) and portal click-through exercises.
- **📖 Reading & Synthesis:** High-yield summary tables, Cornell notes, and memory mnemonics (e.g. *S.H.E.A.D*, *R.A.D*, *B.F.D*).

### 4. 📅 Smart Study Planner & Browser Reminders
- Dynamic study sprint generator calculated from your target exam date and daily available hours.
- Web Notifications API integration: sends daily revision reminders and spaced-repetition nudges for your weak topics.

### 5. 🤖 "Rafiki" AI Study Buddy
- Conversational cloud mentor with built-in localized dialect support:
  - **English (Global)**
  - **Kiswahili / Sheng (East Africa)**
  - **Nigerian Pidgin (West Africa)**
  - **Français (Francophone Africa)**
- Works 100% offline with a pre-computed knowledge base, or connects live to Google Gemini API via custom API key.

### 6. ♿ Universal Accessibility & Disability Accommodations
Targeting **WCAG 2.1 AAA** compliance, ensuring nobody is left behind:
- **Blind & Low-Vision Learners:** Native Text-to-Speech (TTS) audio read-aloud for all questions and explanations; semantic ARIA live regions (`aria-live="polite"`); High-Contrast AAA mode (solid `#000000` with 7:1 ratio).
- **Dyslexic Learners:** Dyslexia-friendly letter and word spacing mode; multimodal audio read-aloud options; plain-language summaries.
- **Motor & Mobility Impaired Learners:** 100% keyboard navigable without a mouse (keys `1–4` to pick options, `Enter` to submit, `N` for next question, `Space` to flip flashcards).
- **Deaf & Hard-of-Hearing Learners:** All audio chimes are paired with visual flash banners; zero audio-only dependencies.
- **Neurodivergent Learners (ADHD / Autism / Vestibular Disorders):** Reduced motion toggle to disable confetti and pulsing effects; bite-sized micro-learning chunks.

---

## 🛠️ Tech Stack & Rapid Architecture

- **Frontend & UI:** React 19 + Vite 8 + Tailwind CSS v4 + Lucide Icons + Canvas-Confetti
- **State & Retention:** Client-side `localStorage` persistence (zero backend setup required)
- **Audio Feedback:** Web Audio API synthesizer chimes (zero external audio file dependencies)
- **Notifications:** W3C Web Notifications API
- **AI Layer:** Google Gemini API (with seamless offline fallback)

---

## ⚡ Quickstart Guide

### Prerequisites
- Node.js 18+ (tested on Node v20/v26)
- npm or pnpm

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/az900-vibe-agent.git
cd az900-vibe-agent

# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Build for Production
```bash
npm run build
```
The optimized static bundle is generated in `dist/` and can be deployed instantly to Vercel, Netlify, GitHub Pages, or Firebase Hosting.

---

## 🎤 Hackathon Pitch & Presentation Guide (5-Slide Structure)

| Slide | Criterion (100% Total) | Pitch Talking Points |
| :---: | :--- | :--- |
| **1. Hook & Problem** | **Problem Understanding (20%)** | *"Every day, thousands of African devs study for AZ-900, but abstract foreign jargon and dry dumps cause exam failure and voucher waste. We built the adaptive tool we wished we had."* |
| **2. Product Demo** | **Solution & Product (25%)** | Live demo: Show the circular readiness meter, answer a practice question to reveal the "Why It's Wrong" breakdown, toggle to Auditory/African analogy mode, and trigger a study reminder. |
| **3. Community Fit** | **Target Users (15%)** | Built specifically for the #1MillionDevs Movement: career transitioners, university students, and junior developers across Kenya, Nigeria, South Africa, Rwanda, Ghana, and beyond. |
| **4. Growth & Scale** | **Impact & Scalability (20%)** | The adaptive cognitive engine is modular: easily expand to AWS Cloud Practitioner, Google Cloud Associate Cloud Engineer, and advanced Azure exams (AZ-104 / AZ-204). Offline support ensures accessibility in low-bandwidth zones. |
| **5. The Vibe** | **Clarity & Delivery (20%)** | Summarize the team's vibe coding journey: rapid execution in under 48 hours using Vite, Tailwind, and Gemini. Invite the judges to try a 1-minute vibe quiz. |

---

## ⚠️ Unofficial Community Tool Disclaimer
*This project is an independent educational tool created for the #1MillionDevs Vibe Coding Hackathon. It is not affiliated with, sponsored by, or endorsed by Microsoft Corporation. Content is based on the publicly available Microsoft Learn AZ-900 skills outline.*
