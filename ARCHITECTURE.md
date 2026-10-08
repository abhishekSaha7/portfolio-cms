# ARCHITECTURE.md — Portfolio CMS System Architecture & Data Flow

This document details the system architecture, file directory roles, security boundaries, and data flow pipelines.

---

## 1. High-Level Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              CLIENT BROWSER                             |
+-------------------------------------------------------------------------+
       |                                                    |
 [HTTP Request]                                       [Admin Action / Upload]
       |                                                    |
       v                                                    v
+-----------------------------+                     +---------------------+
| NEXT.JS MIDDLEWARE          |                     | CLIENT COMPONENTS   |
| (middleware.ts)             |                     | (components/admin/*)|
| - Session Token Check       |                     | - createBrowserClient|
| - /admin/* Route Guard      |                     +---------------------+
+-----------------------------+                                |
       |                                                       |
       v                                                       v
+-----------------------------+                     +---------------------+
| SERVER COMPONENTS           |                     | SUPABASE CLIENT     |
| (app/page.tsx, etc.)        |                     | - Storage API       |
| - createServerClient()      |                     | - PostgREST API     |
+-----------------------------+                     +---------------------+
       |                                                       |
       v                                                       |
+--------------------------------------------------------------+----------+
|                     SUPABASE BACKEND CLOUD                              |
|                                                                         |
|  +-------------------+   +--------------------+   +-------------------+ |
|  | PostgreSQL DB     |   | Auth (Cookie JWT)  |   | Storage Buckets   | |
|  | (Profiles,        |   | - Admin Role       |   | - profile-images  | |
|  |  Projects, etc.)  |   |                    |   | - project-images  | |
|  |  [RLS Enabled]    |   |                    |   | - resumes         | |
|  +-------------------+   +--------------------+   +-------------------+ |
+-------------------------------------------------------------------------+
```

---

## 2. Public Data Flow Pipeline (Server-Side Rendering)

```
User visits http://localhost:3000/
       │
       ▼
app/page.tsx (Async Server Component)
       │
       ├──► Promise.all([
       │       getProfile(),
       │       getHeroTitles(),
       │       getSkills(),
       │       getEducation(),
       │       getExperience(),
       │       getProjects({ featured: true }),
       │       getPublishedResume()
       │    ])
       │
       ▼
lib/data/*.ts (Data Fetchers)
       │
       ├──► createClient() in lib/supabase/server.ts
       │       └── Reads NEXT_PUBLIC_SUPABASE_URL & ANON_KEY
       │       └── Configures Cookie Store from next/headers
       │
       ▼
Supabase PostgreSQL DB (SELECT queries with RLS)
       │
       ▼
Pre-rendered HTML returned to Browser
       │
       ▼
Client Hydration (Interactive elements: ThemeToggle, Motion animations)
```

---

## 3. Admin Data Mutation Flow (CMS Management)

```
Admin submits form at /admin/projects/[id]
       │
       ▼
components/admin/project-edit-form.tsx (Client Component)
       │
       ├──► Zod Schema Validation (lib/validations/index.ts)
       │
       ├──► (Optional) File Upload to Supabase Storage
       │       └── supabase.storage.from("project-images").upload(...)
       │       └── Returns Public CDN Image URL
       │
       ├──► Supabase Table Mutation
       │       └── supabase.from("projects").update(...)
       │
       ▼
lib/actions/revalidate.ts (Server Action)
       │
       └──► revalidatePath("/", "layout")
               └── Evicts Next.js Data Cache & updates Public Site immediately!
```

---

## 4. Security Boundary Matrix

| Resource / Route | Access Role Required | Enforced By |
| :--- | :--- | :--- |
| **Public Portfolio Pages (`/`, `/projects`, `/resume`)** | Anonymous / Public | Open RLS (`SELECT`) |
| **Admin Login (`/admin/login`)** | Anonymous / Public | Form Action & Supabase Auth |
| **Admin Routes (`/admin/*`)** | Authenticated Admin | Next.js Middleware (`middleware.ts`) |
| **Database `UPDATE`/`INSERT`/`DELETE`** | Authenticated Admin | PostgreSQL Row Level Security (RLS) |
| **Storage Bucket Uploads** | Authenticated Admin | Supabase Storage RLS Policies |
