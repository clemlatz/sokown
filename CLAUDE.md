# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Sokown is a space game where players remote control spaceships traveling through the solar system. It's a TypeScript monorepo with an Ember.js frontend (`/client`) and a NestJS backend (`/server`).

## Common Commands

### Client (Ember.js)
```bash
cd client
npm run start          # Dev server on localhost:4200
npm run build          # Production build
npm test               # Full test suite with linting
npm run test:ember     # Tests only (no linting)
npm run lint           # Run all linters
npm run lint:fix       # Auto-fix lint issues
```

### Server (NestJS)
```bash
cd server
npm run start:dev      # Watch mode dev server
npm run start          # Start server
npm test               # Run Jest tests
npm run test:watch     # Watch mode
npm run test:cov       # With coverage
npm run lint           # Lint and auto-fix
npm run format         # Run Prettier
```

### Running Single Tests
```bash
# Server - run specific test file
cd server && npx jest path/to/file.spec.ts

# Server - run tests matching pattern
cd server && npx jest --testNamePattern="pattern"

# Client - run specific test file
cd client && npx ember test --filter="test name"
```

### Database (Prisma)
```bash
cd server
npx prisma migrate dev    # Run migrations in development
npx prisma generate       # Regenerate Prisma client
npx prisma studio         # Open database GUI
```

## Architecture

### Backend (Clean Architecture)
The server follows clean/hexagonal architecture with clear layers:

- **Controllers** (`/server/src/controllers/`) - HTTP handlers and route definitions
- **Use Cases** (`/server/src/usescases/`) - Business logic (RegisterNewPilotUsecase, MoveShipTowardsDestinationUsecase, etc.)
- **Services** (`/server/src/services/`) - External integrations (OpenIDConnectService, AstronomyService)
- **Models** (`/server/src/models/`) - Domain entities (Ship, User, Location, Position)
- **Value Objects** (`/server/src/values/`) - Type-safe numerics (DistanceInKilometers, SpeedInKilometersPerSecond, OrientationInDegrees)
- **Repositories** (`/server/src/repositories/`) - Data access layer with Prisma

Entry points:
- `/server/app.ts` - Background task orchestration (runs ship movement every second, location updates every minute)
- `/server/src/server.ts` - NestJS application factory
- `/server/src/app.module.ts` - Dependency injection container

### Frontend (Ember.js)
Standard Ember architecture with Ember Data for API communication:

- **Routes** (`/client/app/routes/`) - Nested route structure for Ships/Locations
- **Components** (`/client/app/components/`) - Reusable UI (star-map, navbar, position)
- **Services** (`/client/app/services/`) - Shared state (locations, current-user)
- **Adapters/Serializers** (`/client/app/adapters/`, `/client/app/serializers/`) - JSON:API communication
- **Mirage** (`/client/mirage/`) - Mock API server for development/testing

### Database
MySQL database via Prisma ORM. Schema defined in `/server/prisma/schema.prisma`.

## Code Quality

- **No console.log in client**: ESLint rule `'no-console': 'error'` is enforced
- **Pre-commit hook**: Lints server code and auto-fixes client code
- **Pre-push hook**: Runs full test suites for both client and server
- **API format**: JSON:API compliant

## Key Technical Notes

- Node version: 20 (see `.nvmrc`)
- Authentication: OpenID Connect with cookie sessions
- Server port: 3000 (configurable via PORT env var)
- TypeScript strict mode is enabled in server but `strictNullChecks` and `noImplicitAny` are disabled
