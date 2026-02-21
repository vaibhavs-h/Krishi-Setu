# Krishi Setu

**Krishi Setu** is a premium, deep-tech agricultural platform designed to bridge the gap between complex data and farmers. Built with a "bio-digital" aesthetic, it combines immersive storytelling with actionable intelligence, visualizing the journey of a crop while providing real-time market data, financial tools, and climate advisory.

🔗 **Live Application**: [https://krishi-setu-nine.vercel.app/](https://krishi-setu-nine.vercel.app/)

---

## ✨ Key Features

### 🌱 Immersive Scrollytelling (Home)
An organic, 120-frame image sequence linked to scroll progress, narrating the growth cycle of a crop from seed to harvest with precision.
*   **Sticky Canvas**: High-performance rendering for smooth 60fps animations.
*   **Cinematic Vignette**: Dynamic overlays that focus attention on the crop's development.

### 📈 Market Price Intelligence (`/market`)
A real-time trading dashboard for farmers to track crop prices and market trends.
*   **AI Neural Insights**: Predictive algorithms offering "Buy" or "Hold" signals based on global data.
*   **Live Ticker**: Real-time price updates for major commodities like Wheat, Rice, and Corn.
*   **Deep-Tech UI**: Dark-mode optimized with neon accents and glassmorphic panels.

### 🏛️ Scheme Matcher (`/schemes`)
An advanced algorithmic engine that connects farmers with government subsidies.
*   **Smart Profiling**: Matches schemes based on land holding, state, and income.
*   **Direct Access**: One-click "Apply Now" links to official government portals.
*   **Doodle Aesthetics**: Friendly, hand-drawn icons to make complex forms approachable.

### 💳 Smart Financial Hub (`/financial`)
A comprehensive financial command center for the modern farmer.
*   **Credit Line Tracker**: Visual progress bars for KCC loans and equipment finance.
*   **Readiness Score**: A credit-health gauge to help farmers access better interest rates.
*   **Transaction Logs**: Clear, categorized history of farm expenses and income.

### 🌦️ Weather & Climate Advisory (`/advisory`)
Hyperlocal climate intelligence for precise farm management.
*   **Sowing Recommendations**: AI-driven dates for optimal planting based on moisture and temp.
*   **Live Sensor Data**: Real-time readings from deployed IoT field sensors.
*   **Dynamic Forecasts**: 7-day weather predictions tailored for specific crops.

### 🔐 Robust Authentication & Security
A fully integrated, secure user session management system ensuring data isolation and privacy.
*   **Session-Only Cookies**: Ephemeral authentication that automatically logs users out when the browser window is closed.
*   **Tab-Level Isolation**: Advanced security preventing unauthorized session bleeding between browser tabs.
*   **Dynamic Route Protection**: Intelligent middleware that seamlessly redirects unauthenticated users away from sensitive dashboards.

### 👤 Profile Management
A central hub for users to manage their agricultural identity and farm details.
*   **Persistent Data Storage**: Seamlessly edit and save details like land area, location, and crop types.
*   **Intuitive UI**: Smooth slide-in/fade-out page transitions and graceful "Germinating..." loading states.
*   **Interactive Confirmation Modals**: Custom-designed, thematic dialogs for critical actions like Sign Out and Profile Deletion, replacing native browser alerts.

---

## 🛠️ Tech Stack

*   **Frontend**: Next.js 14 (App Router)
*   **Backend & Database**: Supabase (PostgreSQL, Authentication)
*   **Animation**: Framer Motion & HTML5 Canvas
*   **Styling**: Tailwind CSS (Custom neon & emerald palette)
*   **Icons**: Material Symbols, Lucide React & Custom Doodles
*   **State Management**: React Hooks (Context API)
*   **Deployment**: Vercel

---

## 🏗️ Project Structure

```text
/
├── app/                
│   ├── market/         # Market Intelligence Dashboard
│   ├── schemes/        # Scheme Matcher Page
│   ├── financial/      # Smart Financial Hub
│   ├── advisory/       # Weather & Climate Advisory
│   ├── login/          # Secure Authentication Gateway
│   ├── profile/        # User Profile Management
│   └── page.tsx        # Scrollytelling Growth Engine (Home)
├── components/         # Premium UI Components (Canvas, Modals, Overlays)
├── context/            # Global State (AuthContext, ThemeContext)
├── utils/              # Helper functions and Supabase clients
├── public/             
│   ├── growth-sequence/ # 120-frame JPEG sequence
│   └── icons/           # Custom assets and doodles
├── styles/             # Global CSS and Tailwind directives
└── tailwind.config.ts  # Custom Design Tokens
```

---


⭐ **Star this repo if you find it helpful for your Agri-Tech projects!**

Built with ❤️ by [Vaibhav](https://github.com/vaibhavs-h)
