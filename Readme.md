# Acadify

## Vision

Acadify aims to modernize academic management by providing a centralized, data-driven platform that improves visibility, efficiency, and communication in schools.

## Overview

Acadify is a digital platform designed to help schools manage and track students’ academic progress through reports, tests, and performance analytics.

Many schools currently rely on manual processes or fragmented tools, making it difficult to monitor student performance efficiently.

## Target Users

- **School Administrators**
- **Teachers**
- **Students**

These users need a system that simplifies academic management, saves time, and provides clear insights into student performance.

## Value Proposition

Acadify centralizes all academic data in one place, enabling:

- Better decision-making
- Clear performance tracking
- Improved communication between schools and students

## Tech Stack & Monorepo Structure

This project is organized as a monorepo using **pnpm workspaces**:

- **Backend (`apps/service`)**: NestJS, Prisma ORM, PostgreSQL, Passport (JWT/Local Auth).
- **Frontend (`apps/dashboard`)**: React, Vite, Tailwind CSS, shadcn/ui.
- **Shared (`packages/dtos`)**: Shared Data Transfer Objects (DTOs) using `class-validator` and `class-transformer`.

```
    acadify/
    ├── apps/
    │   ├── service/    → Backend API
    │   └── dashboard/  → Frontend Web App
    │   └── dtos/       → Shared Types & Validation
    ├── package.json
    └── pnpm-workspace.yaml
```

---

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:

- **Node.js** (v18 or higher recommended)
- **pnpm** (v9.15.0 or higher)
- **PostgreSQL** (Running locally or via Docker)

### 2. Installation

Clone the repository and install all workspace dependencies:
pnpm install

### 3. Environment Setup

You need to set up environment variables for both the frontend and backend.

**Backend (`apps/service/.env`)**
Create a `.env` file in the `service` directory:

```
    DATABASE_URL="postgresql://username:password@localhost:5432/Acadify-db"
    JWT_SECRET="your-jwt-secret"
    JWT_EXPIRATION="1d"
    NODE_ENV="development"
```

**Frontend (`apps/dashboard/.env`)**
Create a `.env` file in the `dashboard` directory:

```
    VITE_API_URL="http://localhost:3000"
```

_(Note: Ensure the port matches your running backend instance)._

### 4. Build Shared Packages

Before running the apps, you must build the shared DTOs so both the frontend and backend can resolve them:
pnpm --filter dtos build

### 5. Database Setup & Seeding

Initialize your PostgreSQL database and populate it with seed data (this will create dummy users, students, grades, and curriculums): # Navigate to the service directory or use the filter
pnpm --filter service run db:reset
_(Note: The `db:reset` script will clear existing data and run the seed script automatically)._

### 6. Running the Application

To run the full stack, it is recommended to open two separate terminal windows:

**Terminal 1: Run the Backend**
pnpm --filter service run start:dev
_(This command automatically runs Prisma migrations in dev mode and starts the NestJS server)._

**Terminal 2: Run the Frontend**
pnpm --filter dashboard run dev

---

## 🧪 Testing

Currently, testing is configured for the backend service using Jest.

Run unit tests:
pnpm --filter service run test

Run end-to-end (e2e) tests:
pnpm --filter service run test:e2e

Run test coverage:
pnpm --filter service run test:cov

---

## 🛠 Available Root Scripts

You can run these commands from the root directory to manage the entire monorepo:

- `pnpm install` — Installs dependencies and enforces pnpm via `preinstall`.
- `pnpm format` — Formats the entire codebase using Prettier.
- `pnpm lint` — Runs ESLint across all packages.
- `pnpm build` — Builds all workspaces.
- `pnpm prepare` — Initializes Git hooks using Husky (runs automatically after install).
