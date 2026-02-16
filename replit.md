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

### Image Hosting (Cloudinary)
- **Provider**: Cloudinary SDK (`cloudinary` npm package)
- **Required Secrets**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- **API Endpoints**: `/api/images`, `/api/images/folders`, `/api/images/folder/:folder`
- **Frontend Hook**: `useCloudinaryImages({ folder, limit, tag })` in `client/src/hooks/useCloudinaryImages.ts`
- **Folder Convention**: Upload images to Cloudinary folders that match site sections (using dashes, not slashes):
  - `hero/` - homepage carousel images
  - `mission/` - mission section image
  - `programs-health-advancement/` - Health Advancement program images
  - `programs-medical-aid-outreach/` - Medical Aid Outreach program images
  - `programs-healthcare-professional-empowerment/` - Healthcare Professional Empowerment images
- **Fallback**: All sections fall back to AI-generated placeholder images when Cloudinary folders are empty
- **Image Optimization**: Automatic via Cloudinary transforms (heroUrl for 1920w, optimizedUrl for 800w, thumbnailUrl for 400x400 fill)
- **Gallery Page**: `/gallery` with folder navigation, lightbox viewer, and responsive grid
- **Admin Image Manager**: `/admin/images` - in-site admin page for uploading/deleting images per section
  - Protected by auth + admin/board_member role check
  - Admin API: `POST /api/admin/images/upload`, `DELETE /api/admin/images/:publicId`, `POST /api/admin/images/folder`
  - Accessible from Portal Dashboard "Admin Tools" section

### Admin Panel
- **Full Admin Backend**: `/admin` - comprehensive admin panel with sidebar navigation
  - Protected by auth + admin/board_member role check
  - Accessible from Portal Dashboard "Admin Tools" section
  - **Dashboard**: Stats overview (events, blog posts, donations, volunteers, messages, users)
  - **Events Management**: Full CRUD - create, edit, delete events
  - **Blog/News Management**: Full CRUD - create, edit, publish/unpublish, delete posts
  - **Donations Viewer**: Read-only table of all donations with status badges
  - **Volunteer Submissions**: View and update status (new → contacted → confirmed)
  - **Contact Messages**: View and update status (new → read → responded)
  - **User Management**: View users, change roles (user, volunteer, admin, board_member)
  - **Image Manager**: Link to `/admin/images` for site photo management
- Admin API endpoints: `/api/admin/stats`, `/api/admin/events/:id`, `/api/admin/blog/:id`, `/api/admin/users`, `/api/admin/users/:id/role`, `/api/admin/volunteer-submissions/:id/status`, `/api/admin/contact-messages/:id/status`
- Content creation endpoints (POST /api/events, POST /api/blog) are secured with admin auth

### Development Tools
- **Drizzle Kit**: Database schema management and migrations (`npm run db:push`)
- **Vite Dev Server**: Hot module replacement during development
- **Replit Plugins**: Runtime error overlay, cartographer, dev banner (development only)