# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**space.NEXT** - A single meeting room booking web service built with Next.js 15, targeting 90%+ automation rate for meeting room reservations with contactless entry and payment processing.

## Architecture & Tech Stack

- **Next.js 15.1.0** with App Router and Turbopack for development
- **React 19.0.0** with concurrent features
- **TypeScript** with relaxed settings (strictNullChecks: false, noImplicitAny: false)
- **shadcn/ui** component library (17 components ready)
- **Tailwind CSS** with custom design system and dark/light mode
- **Zustand** for client state management
- **TanStack Query 5** for server state management
- **React Hook Form + Zod** for form validation
- **Supabase** (implemented) for PostgreSQL + Auth + Storage with full CRUD operations
- **Axios** for webhook integration and external API calls
- **Stripe** (planned) for payment processing

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
  - `/service` - Service gallery page with image showcase
  - `/reservations` - Booking management with search/filtering
  - `/booking` - Main booking page
  - `/api/booking/availability/` - API routes (skeleton)
- `src/components/` - Business logic components
  - `booking-modal.tsx` - Full 3-step booking process (400+ lines)
  - `time-slot-selector.tsx` - Interactive time selection
  - Landing page sections (hero, features, pricing, testimonials, footer)
- `src/components/ui/` - shadcn/ui component library (17+ components)
- `src/hooks/` - Custom React hooks (toast system ready)
- `src/lib/` - Utility and integration layer
  - `supabase/` - Complete Supabase client/server integration
  - `utils.ts` - Utility functions with cn() helper

### Provider Setup
Root layout includes providers for:
- React Query client configuration
- Theme provider for dark/light mode
- Toast notification system

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

**Architecture Requirements:**
- Domain-driven organization planned
- Performance target: <2s response times
- Supabase + Stripe integration architecture
- Security-first approach for payment/user data

**Code Quality:**
- Functions max 20 lines, 3 parameters
- SOLID principles enforcement
- >80% test coverage target
- DRY/KISS/YAGNI principles

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
- booking_date (DATE, Required)
- start_time/end_time (TIME, Required)
- total_hours/total_price (INTEGER, Required)
- selected_time_slots (TEXT[], Required)
- status (pending/confirmed/cancelled)
- created_at/updated_at (TIMESTAMP)
```

### UI/UX Patterns
- **Responsive Grid Layouts**: Masonry-style service gallery
- **Interactive Components**: Hover effects, loading states, status badges
- **Professional Design**: Card-based layouts with gradient overlays
- **Dark/Light Mode**: Complete theme system with CSS variables

## Current Implementation Status

**✅ Fully Implemented:**
- Complete UI component library (20+ shadcn/ui components)
- Theme system with dark/light mode
- Development environment with Turbopack
- Provider setup for state management (React Query + Theme)
- Form validation system (React Hook Form + Zod)
- **Supabase integration** - Complete database setup with CRUD operations
- **Booking system** - Full 3-step modal with time selection, user input, confirmation
- **Business pages** - Service gallery, reservations management, landing page
- **Database schema** - BookingList table with RLS policies
- **Webhook integration** - Make.com automation for booking events
- **Korean localization** - Full UI in Korean language
- **Responsive design** - Mobile-first with professional layouts

**🚧 Partially Implemented:**
- API routes (skeleton structure exists)
- Payment calculation (logic ready, Stripe integration pending)

**❌ Not Implemented:**
- Stripe payment processing (infrastructure ready)
- Authentication system
- Admin dashboard
- Advanced booking features (recurring, team management)

## Key Dependencies

**Core Framework:**
- React 19 + Next.js 15.1 (latest versions)
- TypeScript 5 with relaxed configuration

**Database & Backend:**
- Supabase 2.52.0 (PostgreSQL + Auth + Storage)
- @supabase/ssr for server-side rendering
- server-only for secure server components

**UI & Design:**  
- Radix UI primitives (20+ components implemented)
- Tailwind CSS + tailwindcss-animate
- Lucide React icons
- next-themes for dark/light mode

**State & Forms:**
- TanStack Query 5 for server state
- React Hook Form + Zod validation
- Zustand for client state (ready)

**Utilities:**
- date-fns for date handling
- es-toolkit for utilities
- ts-pattern for pattern matching
- axios for webhook calls
- class-variance-authority + clsx for styling

## Important Files & Setup

### Configuration Files
- `SUPABASE_SETUP.md` - Complete Supabase setup guide with SQL schema
- `components.json` - shadcn/ui configuration
- `tailwind.config.ts` - Custom design system with CSS variables
- `.cursor/rules/supabase.mdc` - Cursor-specific rules for Supabase

### Key Components
- `src/components/booking-modal.tsx` - Core booking logic (400+ lines)
- `src/lib/supabase.ts` - Database operations and TypeScript interfaces
- `src/app/providers.tsx` - React Query + Theme providers setup
- `public/images/service/` - 13 professional service images

### Environment Variables Required
```env
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Development Notes

- **Korean-market focused**: All UI text in Korean, local date/time formats
- **Enterprise-grade planning**: Comprehensive architecture docs in .cursor/rules/
- **Modern React patterns**: Concurrent features, Server Components, SSR-ready
- **Component-driven development**: Reusable UI library with business logic separation
- **Clean code standards**: Enforced through Cursor rules and TypeScript
- **Production-ready features**: Error handling, loading states, responsive design
- **90% automation goal**: Webhook integration and streamlined booking process


<project_prd>
@vooster\vooster__architecture.mdc
@vooster\vooster__clean-code.mdc
@vooster\vooster__prd.mdc
</project_prd>