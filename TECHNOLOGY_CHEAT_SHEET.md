# TECHNOLOGY_CHEAT_SHEET.md — Technology → Why → Where → How

This cheat sheet provides a quick-reference mapping of every major technology in the codebase.

---

### 1. Next.js 16 (App Router)
- **WHY**: Modern SSR & SSG framework providing Server Components, App Router file-system routing, and built-in image & font optimization.
- **WHERE**: [`app/`](file:///Users/abhisheksaha/Desktop/portfolio-cms/app), [`next.config.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/next.config.ts), [`middleware.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/middleware.ts).
- **HOW**: `app/page.tsx` executes as an async Server Component, calling data fetchers in parallel using `Promise.all()`.
- **INTERVIEW ANSWER**: "I used Next.js 16 App Router to get automatic server-side rendering for my public portfolio, combined with Server Actions and Middleware for admin security."

---

### 2. Supabase SSR (`@supabase/ssr` & `@supabase/supabase-js`)
- **WHY**: Managed PostgreSQL database, authentication, and object storage bucket integration with full SSR cookie support.
- **WHERE**: [`lib/supabase/server.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/supabase/server.ts), [`lib/supabase/client.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/supabase/client.ts), [`lib/supabase/middleware.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/supabase/middleware.ts).
- **HOW**: Server client reads/writes cookies via `next/headers`, browser client executes client mutations, RLS policies guard table operations.
- **INTERVIEW ANSWER**: "Supabase provides my PostgreSQL backend and Storage buckets for profile images and resumes. `@supabase/ssr` bridges Supabase auth with Next.js cookie handling."

---

### 3. Tailwind CSS v4
- **WHY**: Utility-first CSS styling engine integrated natively with CSS variables for seamless dark/light theme switching.
- **WHERE**: [`app/globals.css`](file:///Users/abhisheksaha/Desktop/portfolio-cms/app/globals.css), component `className` attributes.
- **HOW**: `globals.css` defines `:root` (dark theme default) and `.light` theme CSS variable overrides (`--background`, `--card`, `--foreground`).
- **INTERVIEW ANSWER**: "Tailwind CSS v4 allows me to define custom CSS property tokens in `globals.css`, giving me instant theme toggling and responsive grid utilities."

---

### 4. Motion (Framer Motion v13)
- **WHY**: Declarative UI animations, scroll reveals, and micro-interactions with accessibility support.
- **WHERE**: [`components/ui/motion-wrapper.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/ui/motion-wrapper.tsx), [`components/public/hero.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/public/hero.tsx), [`components/public/project-card.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/public/project-card.tsx).
- **HOW**: `motion.div` components wrap sections with `whileInView`, `initial`, `animate`, and `useReducedMotion()` to respect user accessibility settings.
- **INTERVIEW ANSWER**: "Motion powers smooth scroll reveals and button interactions while honoring `prefers-reduced-motion` for users who prefer static presentation."

---

### 5. React Hook Form & Zod
- **WHY**: Lightweight uncontrolled form management paired with strict schema validation.
- **WHERE**: [`lib/validations/index.ts`](file:///Users/abhisheksaha/Desktop/portfolio-cms/lib/validations/index.ts), [`components/admin/*-form.tsx`](file:///Users/abhisheksaha/Desktop/portfolio-cms/components/admin).
- **HOW**: Zod defines validation rules (`projectSchema`, `profileSchema`), connected to React Hook Form via `@hookform/resolvers/zod`.
- **INTERVIEW ANSWER**: "I used React Hook Form with Zod schema validation across the CMS admin panel to provide instant inline validation errors without unnecessary component re-renders."
