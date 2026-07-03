# Nexora — The Academic Operating System

Nexora is a premium, state-of-the-art Education Operating System that completely outclasses traditional notes platforms. It acts as the student's daily academic companion, organizing study logs, schedules, and learning profiles.

---

## 🚀 Core Pillars

- **Knowledge Vault:** RAG-indexed study material with document segment search.
- **AI Mentor:** Contextual chat assistant resolving syllabus checkpoints.
- **Memory Forge:** Spaced repetition flashcards utilizing SM-2 algorithms.
- **Assessment Intelligence:** Adaptive difficulty exams and tab blur lockdown simulations.
- **Academic Intelligence:** Attendance predictions, skips buffers, and study priorities.
- **AI Trust Engine:** Hallucination checking via source grounding filters.

---

## 🛠️ Tech Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Database:** PostgreSQL (with `pgvector` index)
- **ORM:** Prisma 7
- **Styling:** Tailwind CSS v4 & Glassmorphism
- **Animations:** Framer Motion
- **AI Models:** OpenAI `gpt-4o-mini`

---

## 📦 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/theshadowquant/nexora.git
   cd nexora
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file matching the template keys inside `.env.example`.

4. **Initialize Database Schema:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## ⚙️ Core Scripts

- `npm run dev`: Starts the local Turbopack development server.
- `npm run build`: Compiles optimized production builds.
- `npm run start`: Starts compiled Next.js servers in production mode.
- `npm run lint`: Audits types and syntax audits.
