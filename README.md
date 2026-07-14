
# 🇲🇦 Smart Tourist Guide Morocco

### AI-Powered Tourism Platform — Discover, Book, and Explore Morocco

[![Laravel](https://img.shields.io/badge/Laravel-11-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](#-license)
[![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)](#-roadmap)

</div>

---

## 📖 Project Description

**Smart Tourist Guide Morocco** is a full-stack tourism platform that helps travelers discover Moroccan cities, attractions, and hotels, book accommodations and private transport, and get **AI-generated personalized itineraries**. Hotel owners and drivers get dedicated dashboards to manage listings, vehicles, and bookings, while admins moderate the entire catalog.

The platform is built as a decoupled **Laravel 11 REST API** + **React 18 / TypeScript SPA**, with an integrated **AI layer powered by the Anthropic Claude API** for itinerary generation, smart recommendations, and a multilingual travel assistant.

---

## ✨ Features

| Category | Features |
|---|---|
| 🔐 **Auth & Roles** | Register/login, role-based access (Admin, Tourist, Hotel Owner, Driver), profile management |
| 🏙️ **Discovery** | Browse cities, search/filter attractions and hotels, geolocation-based results |
| 🏨 **Hotel Booking** | Room browsing, availability checks, checkout flow, booking status tracking |
| 🚗 **Transport Booking** | Driver/vehicle browsing, fare estimation by distance, trip status tracking |
| ⭐ **Reviews & Ratings** | Post-completion reviews for hotels, attractions, and drivers, with cached average ratings |
| ❤️ **Favorites** | Save attractions and hotels to a personal wishlist |
| 🤖 **AI Itinerary Generator** | Multi-day personalized itineraries based on interests and budget |
| 🌍 **Multilingual** | English / French / Arabic content support |
| 📊 **Dashboards** | Dedicated dashboards for Hotel Owners, Drivers, and Admins |

---

## 🛠️ Technology Stack

<div align="center">

| Layer | Technology |
|---|---|
| **Backend** | ![Laravel](https://img.shields.io/badge/Laravel_11-FF2D20?style=flat-square&logo=laravel&logoColor=white) PHP 8.3 |
| **Frontend** | ![React](https://img.shields.io/badge/React_18-61DAFB?style=flat-square&logo=react&logoColor=black) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white) |
| **Styling** | ![Tailwind](https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Database** | ![MySQL](https://img.shields.io/badge/MySQL_8-4479A1?style=flat-square&logo=mysql&logoColor=white) |
| **Cache/Queue** | ![Redis](https://img.shields.io/badge/Redis-DC382D?style=flat-square&logo=redis&logoColor=white) |
| **Auth** | Laravel Sanctum (SPA token auth) |
| **AI** | Anthropic Claude API |
| **Storage** | S3-compatible object storage |
| **Containerization** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) |

</div>

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph Client["🖥️ Client Layer"]
        WEB[React SPA]
    end
    subgraph Backend["⚙️ Laravel 11 API"]
        API[REST Controllers]
        SERVICES[Domain Services]
        AI[AI Service Layer]
    end
    subgraph Data["🗄️ Data Layer"]
        MYSQL[(MySQL 8.0)]
        REDIS[(Redis)]
        S3[(Object Storage)]
    end
    subgraph External["🔌 External"]
        CLAUDE[Anthropic Claude API]
    end

    WEB -->|REST / JSON| API
    API --> SERVICES
    SERVICES --> MYSQL
    SERVICES --> REDIS
    SERVICES --> S3
    SERVICES --> AI
    AI --> CLAUDE
```

> 📌 Full architecture, sequence, and deployment diagrams live in [`docs/architecture.md`](docs/architecture.md).

---

## 🧩 Project Modules

| Module | Description |
|---|---|
| **Identity** | Roles, Users, Authentication |
| **Catalog** | Cities, Attractions, Hotels, Rooms, Drivers, Vehicles |
| **Bookings** | Hotel Bookings, Transport Bookings |
| **Engagement** | Reviews, Favorites |
| **AI** | Itinerary generation, recommendations, chat assistant |

---

## ⚙️ Installation

### Prerequisites
- PHP >= 8.3, Composer 2.x
- Node.js >= 20, npm/pnpm
- MySQL >= 8.0
- Redis >= 7.0

### Backend Installation

```bash
# Clone the repository
git clone https://github.com/your-org/smart-tourist-guide.git
cd smart-tourist-guide/backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env
php artisan key:generate

# Run migrations and seeders
php artisan migrate --seed

# Serve the API
php artisan serve
```

### Frontend Installation

```bash
cd smart-tourist-guide/frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start the dev server
npm run dev
```

### Environment Configuration

**`backend/.env`**
```env
APP_NAME="Smart Tourist Guide Morocco"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=smart_tourist_guide
DB_USERNAME=root
DB_PASSWORD=

REDIS_HOST=127.0.0.1
REDIS_PORT=6379

SANCTUM_STATEFUL_DOMAINS=localhost:3000
FRONTEND_URL=http://localhost:3000

ANTHROPIC_API_KEY=your_anthropic_api_key
```

**`frontend/.env`**
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

---

## ▶️ Running the Project

```bash
# Terminal 1 — Backend
cd backend && php artisan serve

# Terminal 2 — Queue worker (for notifications/emails)
cd backend && php artisan queue:work

# Terminal 3 — Frontend
cd frontend && npm run dev
```

Visit **http://localhost:3000** 🎉

Or, using Docker:
```bash
docker-compose up -d --build
docker-compose exec app php artisan migrate --seed
```

---

## 📡 API Documentation

Full endpoint reference: [`docs/api.md`](docs/api.md)

**Quick example — search hotels:**
```bash
curl -X GET "http://localhost:8000/api/v1/hotels?city=marrakech&stars=4" \
  -H "Accept: application/json"
```

**Quick example — create a hotel booking:**
```bash
curl -X POST "http://localhost:8000/api/v1/hotel-bookings" \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
        "hotel_id": 4,
        "room_id": 11,
        "check_in": "2026-03-10",
        "check_out": "2026-03-14",
        "guests": 2
      }'
```

---

## 🗄️ Database Design Overview

12 core tables spanning Identity, Catalog, Bookings, and Engagement domains. Full column-level documentation, business rules, validation, and Laravel relationships for every table: [`docs/database.md`](docs/database.md).

| Table | Relationship | Target |
|---|---|---|
| users | belongsTo | roles |
| hotels | belongsTo | users, cities |
| rooms | belongsTo | hotels |
| attractions | belongsTo | cities |
| drivers | belongsTo | users, cities |
| vehicles | belongsTo | drivers |
| hotel_bookings | belongsTo | users, hotels, rooms |
| transport_bookings | belongsTo | users, drivers, vehicles |
| reviews | morphTo | attractions, hotels, drivers |
| favorites | morphTo | attractions, hotels |

```mermaid
erDiagram
    ROLES ||--o{ USERS : has
    USERS ||--o| DRIVERS : has
    USERS ||--o| HOTELS : owns
    CITIES ||--o{ ATTRACTIONS : contains
    CITIES ||--o{ HOTELS : contains
    HOTELS ||--o{ ROOMS : has
    HOTELS ||--o{ HOTEL_BOOKINGS : receives
    ROOMS ||--o{ HOTEL_BOOKINGS : booked
    DRIVERS ||--o{ VEHICLES : owns
    DRIVERS ||--o{ TRANSPORT_BOOKINGS : fulfills
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ FAVORITES : saves
```

---

## 🤖 AI Features

Powered by the **Anthropic Claude API**, integrated via a dedicated `AiItineraryService`:

- **Smart Itinerary Generator** — generates day-by-day plans based on city, trip length, interests, and budget.
- **Personalized Recommendations** — suggests attractions/hotels based on browsing and booking history.
- **Multilingual Travel Assistant** — conversational chat endpoint supporting English, French, and Arabic.

See the [AI Feature Flow diagram](docs/architecture.md#ai-feature-flow-smart-itinerary-generation) and [AI endpoint docs](docs/api.md#ai-endpoints).

---

## 📁 Folder Structure

```
smart-tourist-guide/
├── backend/            # Laravel 11 REST API
│   ├── app/
│   ├── routes/
│   ├── database/
│   └── config/
├── frontend/            # React + Vite + TypeScript SPA
│   ├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── services/
├── docs/                # Full project documentation
│   ├── architecture.md
│   ├── database.md
│   ├── api.md
│   ├── scrum.md
│   ├── git-workflow.md
│   ├── deployment.md
│   ├── coding-standards.md
│   └── project-structure.md
├── AGENT.md
├── README.md
├── docker-compose.yml (future)
└── .gitignore
```

Full breakdown with responsibility matrix: [`docs/project-structure.md`](docs/project-structure.md).

---

## 🌿 Git Workflow

**Branching Strategy:** `main` (production) ← `release/*` ← `develop` ← `feature/*` / `bugfix/*` / `hotfix/*`

```mermaid
graph LR
    F[feature/*] --> D[develop]
    B[bugfix/*] --> D
    D --> R[release/*]
    R --> M[main]
    H[hotfix/*] --> M
    M --> D
```

Commit convention: **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`).
Full workflow, PR checklist, and release process: [`docs/git-workflow.md`](docs/git-workflow.md).

---

## 📸 Project Screenshots

> _Screenshots to be added as UI development progresses._

| Home Page | Hotel Detail | AI Itinerary |
|---|---|---|
| ![placeholder](https://via.placeholder.com/300x180?text=Home+Page) | ![placeholder](https://via.placeholder.com/300x180?text=Hotel+Detail) | ![placeholder](https://via.placeholder.com/300x180?text=AI+Itinerary) |

| Booking Checkout | Driver Dashboard | Reviews |
|---|---|---|
| ![placeholder](https://via.placeholder.com/300x180?text=Checkout) | ![placeholder](https://via.placeholder.com/300x180?text=Driver+Dashboard) | ![placeholder](https://via.placeholder.com/300x180?text=Reviews) |

---

## 🗺️ Roadmap

- [x] Core database design (12 tables)
- [x] Authentication & role-based access
- [ ] Hotel & transport booking engines
- [ ] AI itinerary generator (Claude API integration)
- [ ] Multilingual UI (EN/FR/AR)
- [ ] Reviews & ratings system
- [ ] Admin moderation dashboard
- [ ] Payment gateway integration
- [ ] Native mobile app (Phase 2)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`feature/your-feature`)
3. Follow [`docs/coding-standards.md`](docs/coding-standards.md)
4. Commit using Conventional Commits
5. Open a Pull Request against `develop` (see [`docs/git-workflow.md`](docs/git-workflow.md))

All contributions — code, docs, design, and bug reports — are welcome!

---

## 📄 License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---

## 👤 Author

**Smart Tourist Guide Morocco Team**
Built with ❤️ to showcase the beauty of Morocco to the world.

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/your-org)