# Smart Career Navigator

Welcome to **Smart Career Navigator**, a full-stack, enterprise-grade guidance portal tailored specifically for students, fresh graduates, and aspiring software engineers. It helps navigate first-career decisions, identify professional skills gaps, test technical competencies, scan/optimize resumes for Applicant Tracking Systems (ATS), and synchronize opportunities.

---

## Features Breakdown

### 1. Interactive Career Assessment
- Answer targeted queries covering interests, strengths, skills, leadership traits, and analytical options.
- The advisor analyzes responses and maps matching career alignments (UI/UX, Frontend Experience, Backend Architect, Data Platforms, ML Architect, Enterprise Java, etc.) along with fit percentages and qualitative reasoning.

###  2. Career Advisor Chat Deck
- Conversational chat assistant delivering professional career guidance.
- Structured guides such as deep Java development tracks, backend roadmap reviews, and resume bullet formatting assistance.

###  3. ATS Resume Scanner
- Scan full plain-text resumes on-demand.
- Estimates an overall ATS match score and extracts formatting vulnerabilities, high-impact key terms, missing certifications, and actionable layout advice (e.g. implementing active action verbs).

###  4. Professional Skill Gap Charting
- Compares a user's current skillset against desired job titles.
- Generates a bespoke educational syllabus containing step-by-step phased tracks, recommended resources list, and completion timelines.

###  5. Live Internship Search & Bookmarking
- Query an interactive opportunities board.
- Securely bookmark high-demand job listings, stored in your personal cloud profile using Firebase Firestore.

###  6. Interactive Developer Practice Lab
- A sandbox to test and compile real-world developer scripts:
  - **Java Engineering Playground**: Code array algorithms or helper constructs and compile them against dynamic assertion frameworks.
  - **Express API Architect Lab**: Visually trigger Express.js routing controller queues to understand middleware sequences and query validations.

---

## Architecture & Tech Stack

- **Client Presentation**: Single-Page React (v18+) compiled using **Vite** and styled with fluid, responsive **Tailwind CSS**. Includes micro-interactive element triggers, customized theme accents, and dynamic dark backgrounds.
- **Server Services**: **Node.js** backend powered by **Express**, serving API routers and lazy-initializing secure dynamic services (preventing key leakage).
- **Persistent Storage**: **Google Cloud Firestore** databases coupled with **Firebase Authentication** ensuring private multi-user bookmarks profiles support.
- **Micro-Animations**: Clean structural layouts transitions driven by standard React utility classes.

---

##  Local Development & Operations

###  Prerequisite Context
- Ensure your environment variables are configured within `.env` prior to launch:
```env
# Server Secrets (Server-side ONLY, never sent to browser)
GEMINI_API_KEY=your_gemini_api_key_here
```

###  Running the Application

1. **Install Base Packages**:
   ```bash
   npm install
   ```

2. **Boot Developer Container**: Starts both the Vite compiler watch and the proxy Express backend concurrently.
   ```bash
   npm run dev
   ```

3. **Verify Linter Status**:
   ```bash
   npm run lint
   ```

4. **Production Build Compilation**: Packs production assets into static folders and bundles the backend.
   ```bash
   npm run build
   ```

---


