# Acadify

## Vision

Acadify aims to modernize academic management by providing a centralized, data-driven platform that improves visibility, efficiency, and communication in schools.

## Overview

Acadify is a digital platform designed to help schools manage and track students’ academic progress through reports, tests, and performance analytics.

Many schools currently rely on manual processes or fragmented tools, making it difficult to monitor student performance efficiently.

## Target Users

- School administrators
- Teachers
- Students

These users need a system that simplifies academic management, saves time, and provides clear insights into student performance.

## Value Proposition

Acadify centralizes all academic data in one place, enabling:

- Better decision-making
- Clear performance tracking
- Improved communication between schools and students

## Monorepo Structure

This project is organized as a monorepo using **pnpm workspaces**:

```
apps/
  backend/   → API (NestJS)
  frontend/  → Web app (React)

```

## Technologies Used

- Backend: NestJS
- Frontend: React
- Package Manager: pnpm
- Monorepo: pnpm workspaces

## Getting Started

Install dependencies:

```bash
pnpm install
```

Run the backend with the frontend in development mode:

```bash
pnpm run start:dev
```

Run backend:

```bash
pnpm --filter backend start:dev
```

Run frontend:

```bash
pnpm --filter frontend start:dev
```

---
