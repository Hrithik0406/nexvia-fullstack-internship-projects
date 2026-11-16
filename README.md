# Nexvia Technologies Virtual Internship — Capstones & Industry Projects

**Candidate:** Hrithik Sarkar  
**Student ID:** `NEX-INT-2026-1493`  
**Specialization Track:** Full-Stack Development  
**Batch Start Date:** 20 October 2026  
**Project Deadline:** 20 November 2026  
**Submission Status:** Complete & Verified Deliverables  

---

## 📌 Repository Overview

This public repository houses the complete production source code, architecture specifications, database schemas, and documentation for both allotted capstone projects under the **Nexvia Technologies Full-Stack Development Internship**:

1. **`FS-01-Multi-Vendor-Ecommerce/`** — **Multi-Vendor E-Commerce Marketplace**
   * *Summary:* Amazon/Etsy-style marketplace with multi-vendor storefronts, combined cart checkout, automated commission split logic, merchant dashboard, and super admin platform console.
   * *Tech Stack:* React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, Tailwind CSS, Docker.
2. **`FS-03-Learning-Management-System/`** — **Learning Management System with Live Classes**
   * *Summary:* Comprehensive online academy with self-paced video curriculum, interactive live classes room with chat and hand-raising, dynamic quiz engine with automated certificate generation, and instructor analytics powered by Chart.js.
   * *Tech Stack:* React, TypeScript, Node.js, Express, PostgreSQL, Prisma ORM, Chart.js, Tailwind CSS, Docker.

---

## 📂 Project Structure

```
.
├── README.md                                # Root Master Documentation (This file)
│
├── FS-01-Multi-Vendor-Ecommerce/           # Project #1 of 2 (Tag: FS-01)
│   ├── README.md                           # Detailed Architecture, Schema & API Specs
│   ├── docker-compose.yml                  # Postgres + Backend + Frontend Orchestration
│   ├── backend/
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── prisma/
│   │   │   ├── schema.prisma               # Multi-vendor & Payment Split schema
│   │   │   └── seed.ts                     # Pre-seeded vendors, products & orders
│   │   └── src/
│   │       ├── server.ts
│   │       ├── controllers/
│   │       ├── routes/
│   │       └── middleware/
│   └── frontend/
│       ├── Dockerfile
│       ├── package.json
│       ├── vite.config.ts
│       └── src/
│           ├── components/                 # Storefront, Vendor Hub, Admin Console, Cart
│           └── App.tsx
│
└── FS-03-Learning-Management-System/       # Project #2 of 2 (Tag: FS-03)
    ├── README.md                           # Detailed Architecture, Schema & API Specs
    ├── docker-compose.yml                  # Postgres + Backend + Frontend Orchestration
    ├── backend/
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── tsconfig.json
    │   ├── prisma/
    │   │   ├── schema.prisma               # Courses, Modules, Quizzes, Certificates schema
    │   │   └── seed.ts                     # Pre-seeded courses, lessons & quizzes
    │   └── src/
    │       ├── server.ts
    │       ├── controllers/
    │       └── routes/
    └── frontend/
        ├── Dockerfile
        ├── package.json
        ├── vite.config.ts
        └── src/
            ├── components/                 # Course Player, Live Room, Quiz, Chart.js Hub
            └── App.tsx
```

---

## 🚀 Quick Execution Guide

Both projects are engineered with pre-configured seed scripts and dual database support (zero-config SQLite for immediate local inspection + full PostgreSQL with Docker Compose).

### 1. Running Project FS-01 (Multi-Vendor Marketplace)
```bash
# Terminal 1: Backend API
cd FS-01-Multi-Vendor-Ecommerce/backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev

# Terminal 2: Frontend App
cd FS-01-Multi-Vendor-Ecommerce/frontend
npm install
npm run dev
```
* **Storefront URL:** `http://localhost:5173`
* **Backend API URL:** `http://localhost:5000`

### 2. Running Project FS-03 (LMS with Live Classes)
```bash
# Terminal 1: Backend API
cd FS-03-Learning-Management-System/backend
npm install
npx prisma db push
npx tsx prisma/seed.ts
npm run dev

# Terminal 2: Frontend App
cd FS-03-Learning-Management-System/frontend
npm install
npm run dev
```
* **Academy Portal URL:** `http://localhost:5174`
* **Backend API URL:** `http://localhost:5001`

---

## 🔑 Pre-Configured Evaluator Test Accounts

Both applications include an **Evaluator Quick Switcher** banner at the top of the interface allowing instant one-click switching between user roles.

### For FS-01 (Marketplace):
* **Customer:** `customer@test.com` | `password123`
* **Vendor (Apex Tech):** `sales@apexelectronics.com` | `password123`
* **Platform Super Admin:** `admin@nexvia.com` | `password123`

### For FS-03 (LMS):
* **Student:** `student@test.com` | `password123`
* **Instructor (Dr. Aryan):** `instructor@nexvia.com` | `password123`
* **Academic Admin:** `admin@nexvia.com` | `password123`

---

## 🐳 Docker Deployment

To launch all services across containers:
```bash
# Launch FS-01:
cd FS-01-Multi-Vendor-Ecommerce
docker-compose up --build

# Launch FS-03:
cd FS-03-Learning-Management-System
docker-compose up --build
```

---

## 📄 Evaluation Submission Note

This submission satisfies all mandatory criteria outlined in the Nexvia Student Portal:
- [x] Public Git repository with commit history
- [x] Clear subfolder structure (`FS-01` and `FS-03`)
- [x] Complete TypeScript source code, type definitions, and passing builds
- [x] Production Dockerfiles and Docker Compose manifests
- [x] Comprehensive Markdown documentation and ERD/architecture diagrams
- [x] Multi-vendor payment split & Chart.js visualization implementations
