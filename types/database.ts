export interface Profile {
  id: string;
  full_name: string;
  professional_title: string;
  bio: string;
  location: string | null;
  email: string | null;
  phone: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  profile_image_url: string | null;
  greeting: string | null;
  hero_description: string | null;
  cta_projects_label: string | null;
  cta_resume_label: string | null;
  created_at: string;
  updated_at: string;
}

export interface HeroTitle {
  id: string;
  title: string;
  display_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  display_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  year: string | null;
  marks: string | null;
  description: string | null;
  display_order: number;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  technologies: string[];
  location: string | null;
  currently_working: boolean;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  full_description: string;
  technologies: string[];
  github_url: string | null;
  live_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string | null;
  display_order: number;
  created_at: string;
}

export interface ProjectWithImages extends Project {
  project_images: ProjectImage[];
}

export interface Resume {
  id: string;
  file_url: string;
  file_name: string;
  published: boolean;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  projectCount: number;
  featuredCount: number;
  skillsCount: number;
  resumePublished: boolean;
  profileCompletion: number;
}
