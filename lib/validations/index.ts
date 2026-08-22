import { z } from "zod";

export const profileSchema = z.object({
  full_name: z.string().min(1, "Name is required"),
  professional_title: z.string().min(1, "Title is required"),
  bio: z.string(),
  location: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().optional(),
  github_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  greeting: z.string().optional(),
  hero_description: z.string().optional(),
  cta_projects_label: z.string().optional(),
  cta_resume_label: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const heroTitleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  enabled: z.boolean().default(true),
});

export const skillSchema = z.object({
  name: z.string().min(1, "Skill name is required"),
  enabled: z.boolean().default(true),
});

export const educationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().optional(),
  marks: z.string().optional(),
  description: z.string().optional(),
  enabled: z.boolean().default(true),
});

export const experienceSchema = z.object({
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  location: z.string().optional(),
  currently_working: z.boolean().default(false),
  published: z.boolean().default(true),
});

export const projectSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required"),
  short_description: z.string(),
  full_description: z.string(),
  technologies: z.array(z.string()).default([]),
  github_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  live_url: z.string().url("Invalid URL").optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
});

export type ProjectFormData = z.infer<typeof projectSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
