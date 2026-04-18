# Investigation Nexus - Jotform Frontend Hackathon

Investigation Nexus is a responsive, modern React application built for the 2026 Jotform Frontend Hackathon. It acts as a central hub to track, merge, and search across multiple data sources (Check-ins, Messages, Sightings, Notes, and Tips) submitted by field operatives and informants.

## Features
- **Data Normalization**: Seamlessly merges multiple distinct Jotform structures into a unified, chronologically sorted timeline.
- **Resilient Fetching**: Uses a concurrent fetching strategy (`Promise.all`) with robust mock data fallbacks to gracefully handle API rate limits (HTTP 429).
- **Advanced Filtering**: A real-time search algorithm allowing investigators to instantly filter records by suspect name, location, content, or record type.
- **Product Thinking & Suspicion Factor**: Distinctly visualizes data types. "Anonymous Tips" are flagged with high-visibility red markers, check-ins with emerald, and standard intel with blue accents.
- **Premium Design**: Built using pure vanilla CSS avoiding generic frameworks like Tailwind. It utilizes glassmorphism, subtle micro-animations, and a sleek dark mode dashboard.

## Tech Stack
- **React 18** + **TypeScript** (Bootstrapped with Vite)
- **Vanilla CSS** (Custom properties, Flexbox, Animations)
- **Axios** (Data fetching)

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd 2026-frontend-challenge-ankara
   ```

2. **Install dependencies**:
   Make sure you have Node.js installed, then run:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory (if not already present) with your Jotform API configuration:
   ```env
   VITE_JOTFORM_API_KEY=your_api_key_here
   VITE_FORM_CHECKINS=form_id
   VITE_FORM_MESSAGES=form_id
   VITE_FORM_SIGHTINGS=form_id
   VITE_FORM_NOTES=form_id
   VITE_FORM_TIPS=form_id
   ```

4. **Run the Development Server**:
   ```bash
   npm run dev
   ```
   Navigate to `http://localhost:5173` in your browser to view the application.

5. **Build for Production** (Optional):
   ```bash
   npm run build
   npm run preview
   ```

## Development Decisions
- **Why Vanilla CSS?** To maintain granular control over animations (like `slideIn`) and advanced visual filters (glassmorphism) without relying on heavy utility classes, demonstrating core styling competencies.
- **Why Fallback Data?** To ensure the application remains evaluable and functional even when shared API keys hit their rate limits during the hackathon evaluation phase.
- **Data Model**: Normalizing 5 disparate forms into a single `InvestigationRecord` type simplifies the UI layer significantly, allowing for scalable filtering and rendering loops.
