# Surakshify

## Overview
Surakshify is a comprehensive travel safety application designed to provide users with essential tools and information during their journeys. It offers an AI-powered chatbot assistant, real-time location services, weather updates with severe alerts, and robust emergency support features. The app is built with a sleek, intuitive interface and supports multiple Indian languages to ensure accessibility for a wider audience.

## Features
- **🤖 AI Assistant**: A Gemini-powered chatbot to answer your safety and travel-related queries.
- **📍 My Location**: View your current location on a map, share your live location, and get directions.
- **🏥 Nearby Services**: Quickly find essential services like Hospitals, Police Stations, Pharmacies, ATMs, and more within a 20km radius.
- **⛅ Weather Updates & Alerts**: Get real-time weather conditions, hourly forecasts, and severe weather warnings (e.g., heavy monsoon rains).
- **🗺️ Travel Routes**: Discover nearby major travel hubs (Train and Bus stations) and view plausible travel paths.
- **🛡️ Secure Zones**: Locate nearby secure zones such as Community Shelters and Emergency Bunkers during natural disasters.
- **📞 Emergency Contacts**: Quick access to nationwide emergency numbers in India (Police, Fire, Ambulance, Disaster Management, etc.) with tap-to-call functionality.
- **🧑‍🏫 Local Guides**: Find local experts for tours and assistance, complete with contact information and specialties.
- **🚨 Emergency SOS**: A dedicated SOS feature that broadcasts a distress signal and identifies nearby emergency services.
- **📖 Disaster Preparedness**: Comprehensive guides on what to do before and during common natural disasters (Earthquakes, Floods, Fires, Storms, Tsunamis, Landslides, Volcanoes).
- **🌐 Multilingual Support**: Available in English, Hindi, Marathi, Tamil, Telugu, Malayalam, Urdu, and Sanskrit.
- **🎨 Modern UI/UX**: Features a responsive design with Dark/Light mode support, custom cursor effects, and interactive ripple animations.

## Tech Stack
- **Frontend Framework**: React 19
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd surakshify
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Configuration
1. Create a `.env.local` file in the root directory.
2. Add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

### Running the App
Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`.

## Project Structure
- `components/`: Reusable UI components (Header, CustomCursor, RippleEffect, etc.)
- `screens/`: Individual application screens (Home, Chat, Map, Weather, SOS, etc.)
- `services/`: API integration and business logic (Gemini API service)
- `types.ts`: TypeScript interfaces and enums
- `translations.ts`: Multilingual translation strings
- `LanguageContext.tsx`: Context provider for language management
- `App.tsx`: Main application component and routing logic

## License
This project is licensed under the MIT License.
