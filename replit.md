# Kenyaluk Medical Foundation Website

## Overview

This is a nonprofit medical foundation website for the Kenyaluk Medical Foundation, focused on healthcare advancement, medical aid outreach, and healthcare professional empowerment in Kenya. The application is a full-stack web application with a React frontend and Express backend, featuring donation processing via Stripe, event management, blog/news functionality, volunteer and contact forms, and user authentication via Replit Auth.

The site follows a modern marketing design approach inspired by leading SaaS websites, emphasizing bold typography, generous whitespace, fluid animations, and conversion-optimized CTAs to build trust and drive engagement with donors and volunteers.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state caching and synchronization
- **Styling**: Tailwind CSS with custom design tokens defined in CSS variables
- **Component Library**: shadcn/ui (Radix UI primitives with custom styling)
- **Build Tool**: Vite with React plugin
- **Design System**: Custom warm color palette (medical blue primary, medical green accent) with Inter and Poppins fonts

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ES modules
- **API Pattern**: REST API with JSON request/response
- **Session Management**: Express sessions with PostgreSQL session store (connect-pg-simple)

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: Neon PostgreSQL (serverless)
- **Schema Location**: `shared/schema.ts` - contains all table definitions and Zod validation schemas
- **Key Tables**: users, sessions, events, blogPosts, donations, volunteerSubmissions, contactMessages

### Authentication
- **Method**: Replit OpenID Connect (OIDC) authentication
- **Session Storage**: PostgreSQL-backed sessions
- **User Management**: Automatic user upsert on login with role-based access (user, volunteer, admin, board_member)

### Payment Processing
- **Provider**: Stripe
- **Integration**: Stripe Elements with React Stripe.js
- **Features**: One-time and recurring donations with preset amounts

### Path Aliases
- `@/*` → `./client/src/*` (frontend source)
- `@shared/*` → `./shared/*` (shared types and schemas)
- `@assets` → `./attached_assets` (static assets like images)

### Project Structure
```
├── client/           # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and query client
├── server/           # Express backend
│   ├── index.ts      # Server entry point
│   ├── routes.ts     # API route definitions
│   ├── db.ts         # Database connection
│   └── storage.ts    # Data access layer
├── shared/           # Shared between frontend and backend
│   └── schema.ts     # Drizzle schema and Zod validators
└── migrations/       # Database migrations (Drizzle Kit)
```

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database via `@neondatabase/serverless`
- **Connection**: Requires `DATABASE_URL` environment variable

### Payment Processing
- **Stripe**: Payment processing for donations
- **Required Secrets**: `STRIPE_SECRET_KEY` (server), `VITE_STRIPE_PUBLIC_KEY` (client)

### Authentication
- **Replit OIDC**: OpenID Connect authentication
- **Required Secrets**: `SESSION_SECRET`, `REPL_ID` (auto-provided by Replit)
- **Optional**: `ISSUER_URL` (defaults to Replit's OIDC endpoint)

### Development Tools
- **Drizzle Kit**: Database schema management and migrations (`npm run db:push`)
- **Vite Dev Server**: Hot module replacement during development
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)