# Investigation Nexus (2026 Frontend Challenge)

Investigation Nexus is a responsive, modern web application built for the 2026 Frontend Challenge. It acts as a central hub to aggregate, normalize, and display critical intelligence gathered from multiple Jotform field operative forms (Check-ins, Messages, Sightings, Notes, and Tips).

## Features

- **Data Normalization**: Seamlessly merges disparate Jotform submission structures into a unified `InvestigationRecord` model.
- **Resilient API Layer**: Concurrently fetches from multiple Jotform endpoints using `Promise.all` with built-in fallbacks. If Jotform's API rate limits are hit (`429 Too Many Requests`), the app automatically displays high-fidelity mock data to ensure continuous usability.
- **Smart Filtering**: Real-time search across suspect names, locations, clue content, and record types.
- **"Suspicion" Factor**: Visual indicators distinguish different levels of intel. For instance, anonymous tips are flagged with distinct red badges and borders to highlight potential suspicion.
- **Premium Dark Mode Aesthetics**: Features a sleek, custom-designed dark interface using pure Vanilla CSS. Includes glassmorphism effects, fluid micro-animations, and custom scrollbars without relying on utility frameworks like Tailwind CSS.

## Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18 or higher recommended) and `npm` installed on your machine.

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 2026-frontend-challenge-ankara
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Ensure your `.env` file is present in the root directory with the necessary Jotform API keys and Form IDs:
   ```env
   VITE_JOTFORM_API_KEY=your_api_key_here
   VITE_FORM_CHECKINS=your_checkins_form_id
   VITE_FORM_MESSAGES=your_messages_form_id
   VITE_FORM_SIGHTINGS=your_sightings_form_id
   VITE_FORM_NOTES=your_notes_form_id
   VITE_FORM_TIPS=your_tips_form_id
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   This will start the local Vite development server. Open the provided URL (typically `http://localhost:5173`) in your browser to view the application.

5. **Build for Production (Optional):**
   ```bash
   npm run build
   ```
   This command compiles TypeScript and bundles the React application for production deployment into the `dist` folder.

## Technologies Used

- **React 19**
- **TypeScript**
- **Vite**
- **Vanilla CSS**
- **Axios**
