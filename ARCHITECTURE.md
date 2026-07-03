# Nexora System Architecture

This document describes the architectural layout, core design patterns, and domain contexts utilized inside Nexora.

---

## 🏛️ Layered Architecture Pattern

Nexora utilizes a strict Domain-Driven Design (DDD) layout. Business operations are isolated into distinct domains under `/src/domains/`. Communication between interfaces and layers follows:

```
[ UI Component / Route ]
         ↓
    [ Service ] (Coordinates transactions)
         ↓
  ┌──────┴──────┐
  ↓             ↓
[ Engine ]  [ Repository ] (Reads/Writes to DB)
  (Logic)
```

- **Logic Engines:** Pure mathematical or algorithm calculation functions. Zero database connection dependencies.
- **Repositories:** Handles data fetching, mapping, and database transaction boundaries using Prisma ORM.
- **Services:** Coordinates state checks, triggers engines, and calls repositories to write results.

---

## 📂 Core Domain Directories

All core logic resides inside `/src/domains/`:

- `identity`: User registration context and segment feature flag targeted checks (`FeatureFlagService.ts`).
- `knowledge`: PDF parsing, keyword segmentation, text chunking, and pgvector embeddings.
- `learning`: spaced repetition cards using SM-2 calculations (`Sm2Engine.ts`).
- `academic`: syllabus hierarchies topic checkers (`SyllabusEngine.ts`), strategy pings calculators (`GradingEngine.ts`), and attendance pings buffers (`AttendancePredictor.ts`).
- `analytics`: live system checks (`HealthService.ts`).

---

## 🛡️ Coding Standards

- Avoid putting database queries directly in page controllers or route files.
- Put logic calculations in isolated, testable engines to enable test assertions.
- Maintain generic interfaces on all ORM models to allow schema migration flexibilities.
