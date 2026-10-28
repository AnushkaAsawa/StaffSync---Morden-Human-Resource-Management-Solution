# StaffSync - Modern Human Resource Management Solution

StaffSync is an enterprise-grade Human Resource Management System (HRMS) built on the MERN stack (MongoDB, Express.js, React.js, Node.js) with Tailwind CSS v4, role-based workflows for **HR**, **Managers**, and **Employees**, real-time **Indian Standard Time (IST UTC+5:30)** attendance clocking, and **Indian Rupees (INR ₹)** payroll formatting.

---

## 🏛️ Project Directory Architecture

```text
/
├── client/                     # Frontend Vite + React application
│   ├── package.json
│   └── src/
├── server/                     # Backend Node.js + Express REST API (MVC Pattern)
│   ├── .env.example
│   ├── package.json
│   ├── server.js               # Express entry point & middleware mounts
│   ├── config/
│   │   └── db.js               # MongoDB Mongoose connection config
│   ├── models/                 # Mongoose Data Schemas
│   │   ├── User.js             # User credentials & role enum (HR, Manager, Employee)
│   │   ├── Employee.js         # Employee directory, +91 phone, INR ₹ salary
│   │   ├── Leave.js            # Leave applications & approval workflows
│   │   ├── Attendance.js       # IST punch records & compound unique index
│   │   ├── Announcement.js     # Company bulletins with audience targeting
│   │   └── Training.js         # Upskilling cohorts & assigned employee refs
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT authentication & checkRole RBAC
│   ├── controllers/            # Controller business logic
│   │   ├── authController.js
│   │   ├── employeeController.js
│   │   ├── leaveController.js
│   │   ├── attendanceController.js
│   │   ├── announcementController.js
│   │   └── trainingController.js
│   ├── routes/                 # Express API routes
│   │   ├── authRoutes.js
│   │   ├── employeeRoutes.js
│   │   ├── leaveRoutes.js
│   │   ├── attendanceRoutes.js
│   │   ├── announcementRoutes.js
│   │   └── trainingRoutes.js
│   └── seed.js                 # Database seeder for demo accounts & logs
├── src/                        # Root SPA application running in AI Studio
│   ├── components/
│   │   ├── Navbar.tsx          # Top bar, live IST clock & 1-click Demo Switcher
│   │   ├── DashboardOverview.tsx
│   │   ├── EmployeeCRUD.tsx    # HR Employee Directory CRUD operations
│   │   ├── AttendanceTracker.tsx # Daily punch-in/out with IST timestamps
│   │   ├── AttendanceSummary.tsx # Departmental attendance metrics
│   │   ├── LeaveApply.tsx      # Employee leave submission & balance tracking
│   │   ├── LeaveApplications.tsx # Manager/HR leave approval console
│   │   ├── AnnouncementsBoard.tsx # Targeted announcements
│   │   └── TrainingManagement.tsx # Program scheduling & trainee assignment
│   ├── services/
│   │   └── storage.ts          # Storage service & state manager
│   ├── utils/
│   │   └── formatters.ts       # INR currency (₹) & IST (UTC+5:30) formatters
│   ├── types/
│   │   └── index.ts            # TypeScript interfaces
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── README.md
└── package.json
```

---

## 🔑 Pre-Seeded Demo Accounts (1-Click Switcher)

StaffSync comes pre-configured with 3 role accounts accessible via the top navigation bar or manual login:

| Role | Email | Password | Permissions & Scope |
| :--- | :--- | :--- | :--- |
| **HR** | `hr@staffsync.com` | `password123` | Full Employee CRUD, Organization-wide Leave approvals, Post announcements, Attendance analytics |
| **Manager** | `manager@staffsync.com` | `password123` | Review and sanction team leave applications, schedule training cohorts, track team punches |
| **Employee** | `employee@staffsync.com` | `password123` | IST daily punch-in/out, Apply for leaves, View assigned training, Read company bulletins |

---

## 🚀 Local Setup & Installation

### 1. Backend (`/server`)
```bash
cd server
npm install
cp .env.example .env
# Start MongoDB locally (e.g. brew services start mongodb/brew/mongodb-community or mongod)
npm run seed       # Seeds users, employees, leaves, attendance, and trainings
npm run dev        # Starts server on http://localhost:5000 via nodemon
```

### 2. Frontend (`/client` or root)
```bash
npm install
npm run dev        # Starts Vite dev server on http://localhost:3000
```

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register`: Register new account with role (`HR`, `Manager`, `Employee`).
- `POST /api/auth/login`: Authenticate and receive JWT Bearer token.
- `GET /api/auth/me`: Retrieve current authenticated profile (`Bearer <token>`).

### Employee Directory (`/api/employees`)
- `GET /api/employees`: List employees with search (`?search=`) and department filter (`?department=`).
- `POST /api/employees`: Onboard new employee with INR salary and +91 phone (**HR only**).
- `GET /api/employees/:id`: Retrieve single employee record.
- `PUT /api/employees/:id`: Update employee details (**HR only**).
- `DELETE /api/employees/:id`: Remove employee record (**HR only**).

### Attendance (`/api/attendance`)
- `GET /api/attendance`: Retrieve attendance logs (Employee views own; HR/Manager view all).
- `POST /api/attendance/check-in`: Record clock-in with Indian Standard Time (IST) timestamp.
- `POST /api/attendance/check-out`: Record clock-out with duration and auto Half-Day status calculation.
- `GET /api/attendance/summary`: Get departmental attendance statistics (**HR, Manager**).

### Leaves (`/api/leaves`)
- `GET /api/leaves`: Retrieve leaves (Employee views own; HR/Manager view applications).
- `POST /api/leaves`: Submit new leave application (`Casual`, `Sick`, `Privilege`).
- `PUT /api/leaves/:id/status`: Approve or reject leave with remarks (**HR, Manager**).

### Announcements (`/api/announcements`)
- `GET /api/announcements`: Retrieve announcements filtered by role target audience.
- `POST /api/announcements`: Post new bulletin with priority level (**HR, Manager**).
- `DELETE /api/announcements/:id`: Remove announcement (**HR only**).

### Trainings (`/api/trainings`)
- `GET /api/trainings`: Retrieve scheduled workshops and training programs.
- `POST /api/trainings`: Schedule new program with trainee assignment (**Manager, HR**).
- `PUT /api/trainings/:id`: Update phase (`Scheduled`, `In Progress`, `Completed`) (**Manager, HR**).
- `DELETE /api/trainings/:id`: Delete training session (**Manager, HR**).

---

## 🐙 Git Version Control & Repository Setup Commands

To initialize the clean local repository and sync with your newly created GitHub repository (`<YOUR-GITHUB-USERNAME>/StaffSync-HRM`), run the following terminal sequence:

### Step 1: Initial Repository Setup (Main Branch)
```bash
# 1. Initialize local Git repository
git init

# 2. Add remote origin (Replace with your actual GitHub username and repository)
git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/StaffSync-HRM.git

# 3. Create and switch to the main branch
git branch -M main

# 4. Stage project initialization files
git add .gitignore README.md package.json index.html metadata.json vite.config.ts tsconfig.json server/ .env.example

# 5. Initial Conventional Commit
git commit -m "feat(init): project architecture and environment initialization for StaffSync HRM"

# 6. Push to GitHub main branch
git push -u origin main
```

### Step 2: Database Schemas & Seed Script (Feature Branch)
```bash
git checkout -b feature/backend-core
git add server/config/ server/models/ server/seed.js
git commit -m "feat(backend): implement Mongoose schemas, bcrypt hooks, and seed script"
git checkout main
git merge feature/backend-core
git push origin main
```

### Step 3: Controller & Route Modules (Feature Branch)
```bash
git checkout -b feature/api-routes
git add server/middleware/ server/controllers/ server/routes/ server/server.js
git commit -m "feat(api): implement JWT auth middleware, RBAC, controllers, and REST routes"
git checkout main
git merge feature/api-routes
git push origin main
```

### Step 4: Frontend UI Development (Feature Branch)
```bash
git checkout -b feature/frontend-ui
git add src/ client/
git commit -m "feat(frontend): build role-based portals, demo switcher, IST clock, and dark UI"
git checkout main
git merge feature/frontend-ui
git push origin main
```

### Step 5: Final Review & Production Sync
```bash
git add .
git commit -m "chore(release): complete enterprise StaffSync HRM v1.0.0 release"
git push origin main
```
