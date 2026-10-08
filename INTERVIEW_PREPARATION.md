# INTERVIEW_PREPARATION.md — Technical Questions & Answers

This document provides project-specific technical interview preparation categorized by difficulty level (Beginner, Intermediate, Advanced, and Project-Specific).

---

## 1. Beginner Level Questions

### Q1: Why did you choose Next.js App Router for this portfolio CMS project?
- **Project Context**: `app/page.tsx` uses async React Server Components to execute Supabase database queries directly on the server during request time.
- **Answer**: 
  > "I chose Next.js 16 with the App Router because it allows me to combine static/server-rendered performance for the public portfolio with server-side authentication for the CMS admin dashboard. By fetching data on the server in `app/page.tsx`, the client receives pre-rendered HTML containing complete portfolio content, eliminating client-side loading spinners and providing optimal SEO."

### Q2: What is the difference between a Server Component and a Client Component in your codebase?
- **Project Context**: `app/page.tsx` is a Server Component, whereas `components/public/hero.tsx` and `components/ui/theme-toggle.tsx` have `"use client"` at the top.
- **Answer**:
  > "Server Components run exclusively on the Node.js server during render. They do not ship JavaScript bytes to the client browser and can securely access backend resources like database credentials. Client Components, marked with `"use client"`, run on both the server (for initial HTML) and the client browser, allowing interactive state (`useState`), side effects (`useEffect`), event handlers (`onClick`), and DOM APIs (`localStorage`)."

---

## 2. Intermediate Level Questions

### Q3: How do you prevent hydration errors when integrating client-side state like dark/light theme toggle?
- **Project Context**: [`components/ui/theme-toggle.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/ui/theme-toggle.tsx) uses React 19's `useSyncExternalStore`.
- **Answer**:
  > "A hydration mismatch occurs when the server-rendered HTML differs from the client's initial render tree. Theme toggles often trigger this because `localStorage` is unavailable on the server. I solved this cleanly using React 19's `useSyncExternalStore` with a server snapshot returning `false` and client snapshot returning `true`. This ensures the server renders a neutral fallback frame while client mounting hydrates the theme state seamlessly."

### Q4: How does invalid HTML nesting affect React hydration in Next.js?
- **Project Context**: In [`ProjectCard`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/public/project-card.tsx), nested `<a>` links inside an outer `<a>` wrapping `<Card>` violated HTML5 specs.
- **Answer**:
  > "HTML5 forbids nesting `<a>` tags inside another `<a>` tag. When a browser parses server HTML containing nested anchors, its parser forcibly closes the outer `<a>` tag early, mutating the DOM structure before React client JavaScript mounts. When React attempts to hydrate, the browser DOM tree doesn't match React's Virtual DOM tree, causing a hydration error. I fixed this by using the CSS stretched-link pattern (`after:absolute after:inset-0`) on the title link, giving full-card clickability while keeping external action buttons as clean DOM siblings with `relative z-10`."

---

## 3. Advanced Level Questions

### Q5: How is authentication and route protection implemented in your Next.js + Supabase application?
- **Project Context**: `middleware.ts` -> `lib/supabase/middleware.ts` (`updateSession`) & `lib/supabase/server.ts`.
- **Answer**:
  > "Authentication relies on Supabase SSR cookie management (`@supabase/ssr`). When an HTTP request hits the server, Next.js `middleware.ts` runs `updateSession()`. It initializes a server Supabase client using cookie stores, refreshes JWT tokens automatically, and checks `supabase.auth.getUser()`. If a user attempts to access any `/admin/*` route (except `/admin/login`) without an active session, the middleware immediately issues an HTTP 307 redirect to `/admin/login` before page components execute."

### Q6: How does Row Level Security (RLS) in PostgreSQL protect your data mutations?
- **Project Context**: `supabase/migrations/001_initial_schema.sql`.
- **Answer**:
  > "Database security is enforced at the database layer via PostgreSQL Row Level Security (RLS) policies. Even if someone inspects client JavaScript or attempts direct API calls using the public `anon` key, RLS restricts `INSERT`, `UPDATE`, and `DELETE` operations strictly to `authenticated` users (`TO authenticated USING (true)`). Public `anon` users are granted `SELECT` permissions only on published/enabled records."

---

## 4. Project-Specific Machine Test Scenario

### Q7: If asked to add a new section (e.g. "Certifications") during a machine coding test, how would you structure it?
- **Answer**:
  1. **Schema & Types**: Add `certifications` table to Supabase migration SQL and type interface to `types/database.ts`.
  2. **Data Fetcher**: Create `getCertifications()` in `lib/data/certifications.ts` using `createClient()` with `try...catch` fallback.
  3. **UI Component**: Build `CertificationsSection` in `components/public/certifications-section.tsx`.
  4. **Page Integration**: Fetch `getCertifications()` in `app/page.tsx` via `Promise.all` and pass to component.
  5. **Admin Manager**: Build `CertificationsManager` in `components/admin/certifications-manager.tsx` with Zod schema validation for admin management.
