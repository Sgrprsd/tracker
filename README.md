# 📋 JobTracker — Job Application Tracker

**Job Application Tracker** built with **Next.js 16** (App Router) and **MongoDB Atlas**. Track your entire job search journey with a visual Kanban board, analytics dashboard, smart follow-up reminders, and more.

---

## ✨ Features

### 🎯 Kanban Board

- **6-column layout**: Wishlist → Applied → Interview → Offer → Rejected → Accepted
- **Native drag & drop**: Move applications between stages with real-time status updates
- **Application cards**: Company, position, priority badges, dates, and quick actions
- **Search & filter**: Find applications by company or position

### 📊 Dashboard Analytics

- **Stat cards**: Total applications, interviews, offers, response rate
- **Charts**: Status distribution (donut) and applications by status (bar) via Recharts
- **Recent activity**: Latest applications with status badges

### 🔔 Smart Follow-ups

- **Urgency groups**: Overdue, Today, This Week, Later
- **Quick actions**: Snooze (3 days) or mark as Done
- **Color-coded badges**: Visual urgency indicators

### 🔐 Authentication

- **JWT-based auth** with HTTP-only cookies
- **Bcrypt password hashing** (12 salt rounds)
- **Protected routes** via middleware
- **Auto-redirect**: Login/register → dashboard

### 🎨 Premium UI

- **Dark theme** with glassmorphic elements and gradient accents
- **Toast notifications** for all CRUD operations
- **Loading skeletons** with shimmer animation
- **Error boundary** with styled fallback
- **Micro-animations**: Hover effects, transitions, and smooth interactions
- **Responsive design**: Mobile hamburger menu, adaptive layouts

---

## 🏗️ Development Phases

This project was built systematically in **8 structured phases**:

| Phase | Focus                           | Key Deliverables                                               |
| ----- | ------------------------------- | -------------------------------------------------------------- |
| **1** | Architecture & Folder Structure | Scalable project layout, route planning                        |
| **2** | Database Schema Design          | MongoDB models for Users & Applications with indexes           |
| **3** | Authentication                  | JWT auth, bcrypt, login/register pages, middleware             |
| **4** | CRUD APIs                       | RESTful endpoints for applications with filtering & sorting    |
| **5** | Kanban UI                       | 6-column board, drag-and-drop, application cards & form modal  |
| **6** | Dashboard Analytics             | Stat cards, Recharts pie/bar charts, recent activity           |
| **7** | Smart Follow-ups                | Urgency grouping, snooze/done actions, follow-up reminders     |
| **8** | UI Polish & Performance         | Toasts, skeletons, error boundary, responsive pass, animations |

---

## 🛠️ Tech Stack

| Layer          | Technology                          |
| -------------- | ----------------------------------- |
| **Framework**  | Next.js 16 (App Router, Turbopack)  |
| **Database**   | MongoDB Atlas (native driver)       |
| **Auth**       | JWT + bcrypt + HTTP-only cookies    |
| **Validation** | Zod                                 |
| **Charts**     | Recharts                            |
| **Styling**    | CSS Modules + CSS custom properties |
| **Fonts**      | Geist Sans & Geist Mono             |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js                    # Root layout (ErrorBoundary, AuthProvider, Toast)
│   ├── page.js                      # Root redirect (auth check)
│   ├── globals.css                  # Design tokens & reset
│   ├── (auth)/                      # Login & Register pages
│   ├── (dashboard)/                 # Dashboard layout with Sidebar
│   │   ├── applications/            # Kanban board page
│   │   ├── dashboard/               # Analytics dashboard page
│   │   ├── follow-ups/              # Follow-up reminders page
│   │   └── settings/                # Settings page
│   └── api/
│       ├── auth/                    # login, register, logout, me
│       ├── applications/            # CRUD + status update
│       ├── dashboard/stats/         # Aggregated analytics
│       └── follow-ups/              # Upcoming reminders
├── components/
│   ├── ui/                          # Toast, Skeleton, ErrorBoundary
│   ├── layout/                      # Sidebar, TopBar
│   ├── applications/                # KanbanBoard, ApplicationCard, ApplicationForm
│   ├── dashboard/                   # DashboardContent
│   └── follow-ups/                  # FollowUpsContent
├── context/                         # AuthContext
├── hooks/                           # useAuth, useApplications, useDashboard
├── lib/                             # db, auth, validators
├── models/                          # User, Application
└── utils/                           # constants, formatters, api wrapper
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+
- **MongoDB Atlas** account (or local MongoDB)

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/Sgrprsd/job-tracker.git
cd job-tracker

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and JWT secret

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — register an account and start tracking!

### Environment Variables

| Variable               | Description                                             |
| ---------------------- | ------------------------------------------------------- |
| `MONGODB_URI`          | MongoDB Atlas connection string                         |
| `MONGODB_DB`           | Database name (default: `job_tracker`)                  |
| `JWT_SECRET`           | Secret for signing JWTs — use `openssl rand -base64 32` |
| `NEXT_PUBLIC_BASE_URL` | App URL (e.g. `http://localhost:3000`)                  |

---

## 🌐 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Connect repo in [Vercel Dashboard](https://vercel.com/new)
3. Add environment variables in **Settings → Environment Variables**
4. Whitelist all IPs in MongoDB Atlas: **Network Access → Add `0.0.0.0/0`**
5. Deploy — Vercel auto-detects Next.js

---

## 📄 API Reference

| Method   | Endpoint                        | Description                 |
| -------- | ------------------------------- | --------------------------- |
| `POST`   | `/api/auth/register`            | Create account              |
| `POST`   | `/api/auth/login`               | Sign in                     |
| `POST`   | `/api/auth/logout`              | Sign out                    |
| `GET`    | `/api/auth/me`                  | Current user                |
| `GET`    | `/api/applications`             | List (with filters)         |
| `POST`   | `/api/applications`             | Create application          |
| `GET`    | `/api/applications/[id]`        | Get by ID                   |
| `PUT`    | `/api/applications/[id]`        | Update application          |
| `DELETE` | `/api/applications/[id]`        | Delete application          |
| `PATCH`  | `/api/applications/[id]/status` | Update status (drag & drop) |
| `GET`    | `/api/dashboard/stats`          | Dashboard analytics         |
| `GET`    | `/api/follow-ups`               | Upcoming follow-ups         |

---

## 📝 License

MIT © Sagar Prasad
