# PROJECT_AUDIT.md — Complete Technical Audit

**Project Name:** Abhishek Saha Portfolio & Content Management System (Portfolio CMS)  
**Corpus / Repository Root:** `/Users/abhisheksaha/Desktop/portfolio-cms`  
**Primary Stack:** Next.js 16.3.0 (App Router), React 19.2.8, TypeScript 5, Tailwind CSS v4, Motion 13.1.0, Supabase (`@supabase/ssr` & `@supabase/supabase-js`), Zod 3.25.76, React Hook Form 7.85.0.

---

## 1. Project Overview

### 1.1 Purpose & Functionality
This application is a **full-stack personal developer portfolio site paired with a secure, real-time Content Management System (CMS) Admin Dashboard**.

- **Public Portfolio Site (`/`, `/about`, `/projects`, `/projects/[slug]`, `/resume`, `/contact`)**:
  - Dynamically displays developer background, hero dynamic titles, curated skill sets, structured education history, work experience timeline, featured and categorized projects, downloadable PDF resume, and interactive contact channels.
  - Features real-time dark/light theme toggle, custom SVG icons, responsive cards with link overlays, and accessible Motion scroll animations.
- **Secure Admin Dashboard (`/admin/*`)**:
  - Protected behind Supabase Cookie-based Session Authentication & Server-Side Middleware (`middleware.ts`).
  - Provides CRUD management interfaces for Profile data, Hero titles, Skills, Education, Experience timeline, Projects (including cover image and multi-screenshot gallery uploads to Supabase Storage), PDF Resume publishing, and Admin account password updates.

### 1.2 Entry Point & Execution Flow
1. **HTTP Request Arrival**: Request reaches Next.js App Router server instance.
2. **Middleware Evaluation (`middleware.ts` -> `lib/supabase/middleware.ts`)**:
   - `updateSession()` initializes a Supabase Server Client using cookies.
   - Refreshes auth token if expired.
   - Intercepts requests matching `/admin/*` (excluding `/admin/login`). If unauthenticated (`!user`), redirects immediately to `/admin/login`.
3. **Route Handling & Data Fetching**:
   - **Public Pages (`app/page.tsx`, etc.)**: Async React Server Components call data fetchers in `lib/data/*.ts`.
   - Data fetchers initialize `createServerClient()` in `lib/supabase/server.ts`, query Supabase PostgreSQL tables (`profiles`, `hero_titles`, `skills`, `education`, `experience`, `projects`, `resume`), and return typed records.
4. **React Component Tree Rendering**:
   - Server renders layout (`app/layout.tsx`) and page components.
   - Client interactive islands (e.g. `AnimatedTitles`, `ThemeToggle`, `ProjectCard` motion wrapper) hydrate on the browser using clientJS bundles.

---

## 2. Complete Technology Stack Audit

| Technology | Version | Where Used | Why Used | Importance | Classification |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Next.js** | `16.3.0` | `app/`, `next.config.ts`, `middleware.ts` | App Router framework for SSR, Server Components, Server Actions & Routing | **Critical** | Actually Used |
| **React** | `19.2.8` | Entire application | UI Component library runtime | **Critical** | Actually Used |
| **TypeScript** | `^5` | Entire codebase (`tsconfig.json`, `types/`) | Static type checking and safety | **High** | Actually Used |
| **Tailwind CSS** | `^4` | `app/globals.css`, `postcss.config.mjs` | Utility-first styling engine with native CSS variables | **Critical** | Actually Used |
| **Supabase SSR** | `^0.12.4` | `lib/supabase/server.ts`, `middleware.ts` | SSR Cookie-based authentication & database client creation | **Critical** | Actually Used |
| **Supabase JS** | `^2.112.3` | `lib/supabase/client.ts`, Admin client components | Client-side database queries & Storage file uploads | **Critical** | Actually Used |
| **Motion** | `^13.1.0` | `components/ui/motion-wrapper.tsx`, `hero.tsx`, `project-card.tsx` | Declarative UI animations & scroll reveals | **Medium** | Actually Used |
| **Lucide React** | `^1.31.0` | `components/` UI icons | Modern SVG icons | **Medium** | Actually Used |
| **React Hook Form** | `^7.85.0` | `components/admin/*` form components | Uncontrolled form state & submit handling | **High** | Actually Used |
| **Zod** | `^3.25.76` | `lib/validations/index.ts` | Schema validation for forms and inputs | **High** | Actually Used |
| **@hookform/resolvers**| `^5.7.1` | `components/admin/*` forms | Connects Zod schemas to React Hook Form | **High** | Actually Used |
| **Babel Plugin React Compiler** | `1.0.0` | `package.json` | Next.js build compilation pipeline | **Low** | Dev Dependency |
| **ESLint** | `^9` | `eslint.config.mjs` | Code linting | **Low** | Dev Dependency |

*Note: No Redux, Zustand, Axios, TanStack Query, GSAP, MUI, or NextAuth were found in the codebase. State is managed purely with React Server Components, React `useState`, and native browser storage.*

---

## 3. Package.json Audit

```json
{
  "dependencies": {
    "@hookform/resolvers": "^5.7.1",      // Used in components/admin/* with zodResolver
    "@supabase/ssr": "^0.12.4",           // Used in lib/supabase/server.ts & middleware.ts
    "@supabase/supabase-js": "^2.112.3",  // Used in lib/supabase/client.ts & admin managers
    "lucide-react": "^1.31.0",            // Used across public & admin icons
    "motion": "^13.1.0",                  // Used in motion-wrapper.tsx, hero.tsx, theme-toggle.tsx
    "next": "16.3.0",                     // Core framework
    "react": "19.2.8",                    // Core React runtime
    "react-dom": "19.2.8",                // DOM renderer
    "react-hook-form": "^7.85.0",         // Form validation engine in admin area
    "zod": "^3.25.76"                     // Schema validation in lib/validations/index.ts
  }
}
```

---

## 4. Folder and File Structure Audit

```
portfolio-cms/
├── app/                        # Next.js App Router routes & pages
│   ├── about/                  # /about public route
│   ├── admin/                  # Protected CMS admin dashboard routes
│   │   ├── education/          # Education CRUD page
│   │   ├── experience/         # Experience CRUD page
│   │   ├── hero/               # Hero titles CRUD page
│   │   ├── login/              # Admin login page (unprotected visually)
│   │   ├── profile/            # Profile edit & image upload page
│   │   ├── projects/           # Projects table & [id] edit pages
│   │   ├── resume/             # PDF Resume upload & publish page
│   │   ├── settings/           # Account password update page
│   │   └── skills/             # Skills CRUD page
│   ├── api/auth/callback/      # OAuth/Auth redirect API route
│   ├── contact/                # /contact public route
│   ├── projects/               # /projects and /projects/[slug] routes
│   ├── resume/                 # /resume public route
│   ├── globals.css             # Tailwind v4 import & CSS custom properties
│   ├── layout.tsx              # Root HTML/Body layout with font imports
│   └── page.tsx                # Public homepage orchestrator (SSR)
├── components/                 # React components
│   ├── admin/                  # CMS Admin UI forms and management tables
│   ├── public/                 # Public portfolio view components
│   └── ui/                     # Reusable design system primitives (Button, Card, Badge, etc.)
├── lib/                        # Core backend & application logic
│   ├── actions/revalidate.ts   # On-demand revalidation Server Actions
│   ├── auth/actions.ts         # Sign in & Sign out Server Actions
│   ├── data/                   # Data fetching modules (Supabase PostgREST queries)
│   ├── storage/actions.ts      # Storage upload & deletion helper utilities
│   ├── supabase/               # Browser, Server, and Middleware Supabase clients
│   └── validations/index.ts    # Zod validation schemas
├── supabase/
│   └── migrations/             # SQL schema migrations (001_initial_schema.sql)
├── types/
│   └── database.ts             # TypeScript definitions matching Supabase SQL schema
└── utils/
    ├── cn.ts                   # Classname utility (`clsx` + `twMerge` lightweight pattern)
    └── slug.ts                 # String slugification helper for project URLs
```

---

## 5. Component Architecture & Data Flow

```
RootLayout (app/layout.tsx)
 ├── Navbar (components/public/navbar.tsx) [Client: ThemeToggle]
 ├── HomePage (app/page.tsx) [Server Component]
 │    ├── Hero (components/public/hero.tsx) [Client: AnimatedTitles]
 │    ├── AboutSection (components/public/about-section.tsx)
 │    ├── SkillsSection (components/public/skills-section.tsx)
 │    ├── EducationSection (components/public/education-section.tsx)
 │    ├── ExperienceSection (components/public/experience-section.tsx)
 │    ├── FeaturedProjects (components/public/featured-projects.tsx)
 │    │    └── ProjectCard (components/public/project-card.tsx)
 │    ├── ResumeCTA (components/public/resume-cta.tsx)
 │    └── ContactSection (components/public/contact-section.tsx)
 └── Footer (components/public/footer.tsx)
```

---

## 6. Database Schema & RLS Policies

Defined in [`supabase/migrations/001_initial_schema.sql`](file:///Users/abhisheksaha/Desktop/portfolio-cms/supabase/migrations/001_initial_schema.sql):

- **Tables**: `profiles`, `hero_titles`, `skills`, `education`, `experience`, `projects`, `project_images`, `resume`.
- **Row Level Security (RLS)**:
  - `SELECT`: Open to `anon` and `authenticated` roles for published/enabled items.
  - `INSERT`, `UPDATE`, `DELETE`: Restricted strictly to `authenticated` admin role (`TO authenticated USING (true) WITH CHECK (true)`).
- **Storage Buckets**: `profile-images` (public), `project-images` (public), `resumes` (public).

---

## 7. Performance & Security Audit

- **Hydration & Stretched-Link Pattern**: `ProjectCard` title uses `after:absolute after:inset-0` stretched links to prevent invalid HTML `<a>` inside `<a>` DOM nesting errors.
- **Image Optimization**: `next/image` with `sizes="(max-width: 768px) 100vw, ..."` and `remotePatterns: [{ protocol: "https", hostname: "*.supabase.co" }]`.
- **Security**: No secrets committed. `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Supabase Service Role Keys are never used on the client.
