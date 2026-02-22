# 🌾 Krishi-Setu

**An AI-powered agricultural platform for Indian farmers** — connecting them with government schemes, live market prices, real-time weather & soil data, and financial tools in one unified dashboard.

---

## ✨ Features

### 🤖 AI Scheme Matcher
- 121 Central + State government agricultural schemes loaded in Supabase
- Gemini AI matches schemes to the farmer's profile (crop, land size, income)
- Each matched scheme shows full eligibility criteria, required documents, and links directly to the official government portal for application

### 🌦️ Advisory & Field Intelligence
- **Real-time weather** via GPS + Open-Meteo API (temperature, humidity, wind, UV, pressure)
- **Real soil moisture** from Open-Meteo hourly soil data (m³/m³)
- **Real soil pH & nitrogen** from SoilGrids ISRIC API (no key required)
- **Historical 6-month rainfall** from Open-Meteo Archive API — actual precipitation for the farmer's exact location
- Weather-derived pest risk assessment + harvest window estimation
- Auto-refreshes every 10 minutes

### 📈 Live Market Intelligence
- Real-time price simulation for major crops
- Live price charts with trend indicators
- AI-generated market insights

### 💳 Financial Dashboard
- Farm credit score gauge with profile-based estimation
- NCDEX & Agri Forex market rates tracker
- Transaction history

### 🔐 Authentication
- Username + password login (Supabase Auth)
- Protected routes — all pages require login
- User profile: name, location, land size, crops, income

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Database & Auth** | Supabase (PostgreSQL + Auth) |
| **AI** | Google Gemini API (scheme matching) |
| **Weather** | Open-Meteo API (free, no key) |
| **Soil Data** | SoilGrids ISRIC REST API v2 (free, no key) |
| **Geocoding** | Nominatim / OpenStreetMap (free, no key) |
| **Icons** | Material Icons Round |
| **Fonts** | Space Grotesk, Inter |

---

## 📁 Project Structure

```
krishi-setu/
├── app/
│   ├── advisory/       # Weather, soil & field intelligence
│   ├── financial/      # Credit score & market rates  
│   ├── market/         # Live crop price tracker
│   ├── schemes/        # AI scheme matcher
│   ├── profile/        # User profile management
│   ├── login/          # Auth page
│   └── api/
│       └── match-schemes/  # Gemini AI route handler
├── components/
│   ├── Header.tsx
│   └── ProtectedRoute.tsx
├── context/
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
└── utils/
    └── supabase/
```

---

## 🌐 APIs Used (All Free)

| API | Purpose | Key Required |
|---|---|---|
| [Open-Meteo](https://open-meteo.com) | Current weather + soil moisture + historical rainfall | ❌ No |
| [SoilGrids ISRIC](https://soilgrids.org) | Soil pH and nitrogen by coordinates | ❌ No |
| [Nominatim](https://nominatim.org) | Reverse geocoding (GPS → city name) | ❌ No |
| [Google Gemini](https://ai.google.dev) | AI scheme matching | ✅ Yes |
| [Supabase](https://supabase.com) | Database, Auth, Storage | ✅ Yes |

---

## 📜 License

MIT — free to use, modify, and distribute.

---

## 🌍 Live Demo

👉 **[krishi-setu-nine.vercel.app](https://krishi-setu-nine.vercel.app)**

---

## 📜 License

MIT — free to use, modify, and distribute.

---

⭐ **Star this repo if you find it helpful for your Agri-Tech projects!**

Built with ❤️ by [Vaibhav](https://github.com/vaibhavs-h)
