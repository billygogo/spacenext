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
- **Supabase** (planned) for PostgreSQL + Auth + Storage
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
- `src/components/ui/` - shadcn/ui component library (fully set up)
- `src/hooks/` - Custom React hooks (toast system ready)
- `src/lib/utils.ts` - Utility functions with cn() helper

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

## Current Implementation Status

**✅ Ready:**
- Complete UI component library
- Theme system with dark/light mode
- Development environment with Turbopack
- Provider setup for state management
- Form validation system (React Hook Form + Zod)

**❌ Not Implemented:**
- Supabase integration (auth, database, storage)
- Stripe payment processing
- Booking calendar UI
- Admin dashboard
- API routes for business logic
- Authentication system

## Key Dependencies

- React 19 + Next.js 15.1 (latest versions)
- Radix UI primitives for accessibility
- Framer Motion for animations
- date-fns for date handling
- es-toolkit for utilities
- ts-pattern for pattern matching

## Development Notes

- This is a Korean-market focused project
- Enterprise-grade planning with comprehensive architecture docs
- Uses modern React concurrent features
- Component-driven development approach
- Clean code standards enforced through Cursor rules
- TypeScript configured with relaxed settings for rapid development


<project_prd>
@vooster\vooster__architecture.mdc
@vooster\vooster__clean-code.mdc
@vooster\vooster__prd.mdc
</project_prd>