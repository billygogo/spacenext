# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**space.NEXT** - A Korean-focused meeting room booking web service built with Next.js 15, targeting 90%+ automation rate for meeting room reservations with contactless entry and payment processing.

## Architecture & Tech Stack

**Core Framework:**
- **Next.js 15.1.0** with App Router and Turbopack for development
- **React 19.0.0** with concurrent features and Server Components
- **TypeScript 5** with relaxed settings (strictNullChecks: false, noImplicitAny: false)

**Database & Authentication:**
- **Supabase 2.52.0** - PostgreSQL + Auth + Storage with full CRUD operations
- **@supabase/ssr 0.5.2** for server-side rendering
- **NextAuth 4.24.5** with Google OAuth integration

**UI & Design:**
- **shadcn/ui** component library (18 components implemented)
- **Tailwind CSS 3.4.1** with custom design system and dark/light mode
- **Radix UI** primitives with **Framer Motion 11** for animations
- **Lucide React 0.469.0** for icons

**State Management & Forms:**
- **TanStack Query 5** for server state management
- **React Hook Form 7** with **Zod 3** validation
- **Zustand 4** for client state (configured but not actively used)

**Utilities:**
- **date-fns 4** for date manipulation
- **es-toolkit 1** for utilities
- **axios 1.7.9** for webhook integration
- **ts-pattern 5** for pattern matching

## Development Commands

```bash
# Development (with Turbopack)
npm run dev

# Production build
npm run build

# Production server
npm run start

# Linting
npm run lint
```

## Code Architecture

### Current Structure
- `src/app/` - Next.js App Router with layout.tsx, providers.tsx
  - `/api/auth/` - NextAuth API routes for Google OAuth
  - `/booking/` - Booking pages with dynamic routes
  - `/service/` - Service gallery page with 13 professional images
  - `/reservations/` - Admin booking management with search/filtering
- `src/components/` - Business logic components
  - `/auth/` - Authentication components (sign-in, sign-out)
  - `/ui/` - 18 shadcn/ui components with consistent theming
  - `booking-modal.tsx` - Core 3-step booking system (400+ lines)
  - `time-slot-selector.tsx` - Interactive time selection with availability
  - Landing page sections (hero, features, navigation, footer)
- `src/hooks/` - Custom React hooks (toast notification system)
- `src/lib/` - Utility and integration layer
  - `supabase/` - Client/server Supabase instances with RLS policies
  - `supabase.ts` - Database operations with TypeScript interfaces
  - `auth.ts` - NextAuth configuration with Google provider
  - `utils.ts` - Utility functions with cn() helper

### Provider Architecture
Root layout wraps app with multiple providers:
- **SessionProvider** (NextAuth) for authentication state
- **QueryClientProvider** (TanStack Query) for server state management
- **ThemeProvider** (next-themes) for dark/light mode switching
- **AuthProvider** (custom) for Supabase integration

### Styling System
- CSS variables in globals.css for theming
- Tailwind with custom design tokens
- Container-first responsive design
- Dark mode support built-in

## Important Configuration

### Path Aliases
- `@/*` maps to `./src/*`

### Next.js Config  
- ESLint disabled during builds (for rapid development)
- Universal image remote patterns allowed
- TypeScript errors don't block builds

### Development Standards (from .cursor/rules/)

**Mandatory Practices:**
- **Always use client components** - Add `"use client"` directive to all components
- **Promise-based page params** - Use promises for page.tsx params props
- **NextAuth sessions** - Always use next-auth session for authentication
- **Korean text validation** - Check for UTF-8 encoding issues with Korean text

**Library Requirements:**
- **shadcn/ui** for UI components (18 implemented) - Request installation commands for new components
- **Supabase migrations** - Create migration files in `/supabase/migrations/` for database changes
- **picsum.photos** for placeholder images
- **npm** as package manager

**Code Quality Standards:**
- Functional programming patterns (immutability, pure functions)
- Early returns and descriptive naming
- DRY/KISS/YAGNI principles
- TypeScript with explicit typing
- Minimal AI-generated comments - use clear variable/function names instead

## Business Features Implemented

### Booking System
- **3-Step Booking Process**: Date/time selection → User info → Confirmation
- **Time Slot Management**: Interactive time selection with availability checking
- **Price Calculation**: Hourly rates (₩10,000/hour) with 10% tax
- **Webhook Integration**: Automated notifications to Make.com
- **Korean UX**: Full localization with Korean date/time formats

### Service Pages
- **Gallery Page** (`/service`): Professional image showcase with 13 service images
- **Reservations Page** (`/reservations`): Admin-style booking management with search/filtering
- **Landing Page**: Hero section with call-to-action buttons
- **Navigation**: Theme-aware responsive navigation

### Database Schema
```sql
BookingList Table:
- id (UUID, Primary Key)
- reserver_name (VARCHAR, Required)
- phone_number (VARCHAR, Required)
- email (VARCHAR, Added via migration)
- booking_date (DATE, Required)
- start_time/end_time (TIME, Required)
- total_hours/total_price (INTEGER, Required)
- selected_time_slots (TEXT[], Required)
- status (pending/confirmed/cancelled)
- created_at/updated_at (TIMESTAMP)
```

**Migration Management:**
- All schema changes must be done via migration files in `/supabase/migrations/`
- Use idempotent SQL with `CREATE TABLE IF NOT EXISTS`
- Include RLS (Row Level Security) policies for data access control
- Add proper indexes and constraints for performance and data integrity

### UI/UX Patterns
- **Responsive Grid Layouts**: Masonry-style service gallery
- **Interactive Components**: Hover effects, loading states, status badges
- **Professional Design**: Card-based layouts with gradient overlays
- **Dark/Light Mode**: Complete theme system with CSS variables

## Current Implementation Status

**✅ Fully Implemented:**
- **Complete UI System**: 18 shadcn/ui components with dark/light theming
- **Authentication**: NextAuth with Google OAuth + Supabase integration
- **Database Integration**: Full Supabase CRUD operations with RLS policies
- **Booking System**: 3-step modal process (date/time → user info → confirmation)
- **Business Pages**: Service gallery (13 images), reservations management, landing page
- **Time Management**: Interactive time slot selection with availability checking
- **Webhook Integration**: Make.com automation for booking notifications
- **Korean Localization**: Complete UI in Korean with local date/time formats
- **Responsive Design**: Mobile-first with professional card-based layouts
- **Development Environment**: Turbopack, provider setup, form validation system

**🚧 Partially Implemented:**
- **API Routes**: Skeleton structure exists, minimal implementation
- **Payment System**: Business logic ready, Stripe integration pending
- **Database Migrations**: Basic schema with email field addition

**❌ Not Yet Implemented:**
- **Advanced Admin Features**: Full admin dashboard
- **Payment Processing**: Stripe integration (infrastructure ready)
- **Advanced Booking Features**: Recurring bookings, team management
- **Testing Infrastructure**: No test files currently implemented
- **Deployment Configuration**: No evident CI/CD setup

## Key Dependencies

**Core Framework:**
- React 19.0.0 + Next.js 15.1.0 (latest versions)
- TypeScript 5 with relaxed configuration

**Database & Authentication:**
- Supabase 2.52.0 (PostgreSQL + Auth + Storage)
- @supabase/ssr 0.5.2 for server-side rendering
- NextAuth 4.24.5 with Google OAuth
- server-only 0.0.1 for secure server components

**UI & Design:**
- 18 shadcn/ui components with Radix UI primitives
- Tailwind CSS 3.4.1 + @tailwindcss/typography 0.5.10
- Framer Motion 11 for animations
- Lucide React 0.469.0 for icons
- next-themes 0.4.3 for dark/light mode

**State Management & Forms:**
- TanStack Query 5 for server state management
- React Hook Form 7 + Zod 3 for form validation
- Zustand 4 for client state (configured)

**Utilities:**
- date-fns 4 for date handling
- es-toolkit 1 for utilities
- ts-pattern 5 for pattern matching
- axios 1.7.9 for webhook calls
- class-variance-authority + clsx for styling
- react-use 17 for common React hooks

## Important Files & Setup

### Configuration Files
- `components.json` - shadcn/ui configuration with 18 components
- `tailwind.config.ts` - Custom design system with CSS variables and theming
- `next.config.ts` - Next.js configuration with image patterns and build settings
- `tsconfig.json` - TypeScript with relaxed settings and path aliases
- `.cursor/rules/` - Development guidelines:
  - `global.mdc` - Code standards, library requirements, architectural patterns
  - `auth.mdc` - NextAuth authentication guidelines in Korean
  - `supabase.mdc` - Database migration and RLS security guidelines

### Key Components
- `src/components/booking-modal.tsx` - Core 3-step booking system (400+ lines)
- `src/lib/supabase.ts` - Database operations with TypeScript interfaces
- `src/lib/auth.ts` - NextAuth configuration with Google OAuth
- `src/app/providers.tsx` - Multi-provider setup (Session, Query, Theme, Auth)
- `public/images/service/` - 13 professional service images for gallery

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXTAUTH_URL=your-app-url
NEXTAUTH_SECRET=your-secret-key
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

## Development Notes

- **Korean-market focused**: All UI text in Korean, local date/time formats  
- **Modern React patterns**: React 19 concurrent features, Server Components, SSR-ready
- **Component-driven development**: 18 shadcn/ui components with business logic separation
- **Authentication-first**: NextAuth + Google OAuth + Supabase integration
- **Database-first architecture**: Migration-based schema management with RLS policies
- **Clean code enforcement**: Comprehensive .cursor/rules/ guidelines
- **Production-ready features**: Error handling, loading states, responsive design
- **90% automation goal**: Webhook integration and streamlined booking process

## Working with This Codebase

**Adding New Components:**
- Request shadcn/ui installation commands: `npx shadcn@latest add [component]`
- Always add `"use client"` directive to components
- Follow existing Korean localization patterns

**Database Changes:**
- Create migration files in `/supabase/migrations/`  
- Use idempotent SQL patterns (`CREATE TABLE IF NOT EXISTS`)
- Include RLS policies for security

**Authentication:**
- Use NextAuth session throughout the application
- Integrate with Supabase for user data storage
- Follow Korean authentication UX patterns

**Code Quality:**
- Validate Korean text for UTF-8 encoding issues
- Use functional programming patterns
- Prefer descriptive names over comments
- Follow TypeScript best practices with explicit typing