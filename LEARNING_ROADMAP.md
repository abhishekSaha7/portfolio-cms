# LEARNING_ROADMAP.md — Step-by-Step Mastery & Interview Learning Path

This learning roadmap provides a prioritized guide to mastering every concept in this codebase for frontend developer interviews.

---

## 1. High Priority (Must Master First)

### Priority 1: Next.js App Router Architecture & Data Fetching
- **Key Files**: [`app/page.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/app/page.tsx), [`lib/data/profile.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/data/profile.ts), [`lib/data/projects.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/data/projects.ts).
- **Core Concepts**:
  - Server Components vs Client Components.
  - Async server data fetching with `Promise.all`.
  - On-demand revalidation via `revalidatePath`.
- **Practice Question**: *"How does `app/page.tsx` fetch portfolio data without exposing secret API keys or rendering client loading states?"*

### Priority 2: Authentication & Route Protection Middleware
- **Key Files**: [`middleware.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/middleware.ts), [`lib/supabase/middleware.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/supabase/middleware.ts), [`lib/auth/actions.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/auth/actions.ts).
- **Core Concepts**:
  - Middleware execution pipeline.
  - Cookie-based session tokens with `@supabase/ssr`.
  - Server Actions for `signInWithPassword` and `signOut`.
- **Practice Question**: *"How does the application prevent unauthenticated users from viewing `/admin/profile`?"*

### Priority 3: Hydration Mismatch Solutions & DOM Spec Compliance
- **Key Files**: [`components/ui/theme-toggle.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/ui/theme-toggle.tsx), [`components/public/project-card.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/public/project-card.tsx).
- **Core Concepts**:
  - `useSyncExternalStore` for SSR-safe client state initialization.
  - Stretched-link CSS pattern (`after:absolute after:inset-0`) to avoid invalid nested `<a>` elements.
- **Practice Question**: *"What causes React hydration mismatches and how did you resolve them in `ProjectCard` and `ThemeToggle`?"*

---

## 2. Medium Priority (Master Second)

### Priority 4: Database Schema & Row Level Security (RLS)
- **Key Files**: [`supabase/migrations/001_initial_schema.sql`](file:///Users/abhisheksaha/Desktop/portfolio-cms/supabase/migrations/001_initial_schema.sql), [`types/database.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/types/database.ts).
- **Core Concepts**:
  - PostgreSQL table design and foreign key relationships.
  - Row Level Security policies (`TO anon` vs `TO authenticated`).
  - Storage bucket public read vs authenticated upload policies.

### Priority 5: Form Handling with React Hook Form & Zod
- **Key Files**: [`lib/validations/index.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/validations/index.ts), [`components/admin/project-edit-form.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/admin/project-edit-form.tsx).
- **Core Concepts**:
  - Schema definition using Zod (`z.object()`, `z.string().url()`).
  - Form validation integration using `@hookform/resolvers/zod`.
  - Handling file input uploads with Supabase Storage.

---

## 3. Low Priority (Review Before Interviews)

### Priority 6: Tailwind CSS v4 & Motion Animations
- **Key Files**: [`app/globals.css`](file:///Users/abhisheksaha/Desktop/portfolio-cms/app/globals.css), [`components/ui/motion-wrapper.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/ui/motion-wrapper.tsx).
- **Core Concepts**:
  - CSS custom properties (`:root` vs `.light` variables).
  - Declarative animations with `motion.div` and `useReducedMotion()`.

---

## 4. Final Knowledge Checklist

- [x] Can explain Next.js App Router Server Components vs Client Components.
- [x] Can explain Supabase SSR Cookie authentication and Middleware security.
- [x] Can explain how to prevent React hydration errors.
- [x] Can trace a full CRUD operation from admin UI to PostgreSQL database.
- [x] Can explain Zod schema validation with React Hook Form.
- [x] Can deliver the 2-minute elevator pitch for frontend developer interviews.
