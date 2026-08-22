-- Abhishek Saha Developer Portfolio CMS - Initial Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL DEFAULT 'Abhisek Saha',
  professional_title TEXT NOT NULL DEFAULT 'Front End Developer',
  bio TEXT NOT NULL DEFAULT '',
  location TEXT DEFAULT 'Kolkata',
  email TEXT DEFAULT 'abhiseksunny60@gmail.com',
  phone TEXT DEFAULT '9874814925',
  github_url TEXT DEFAULT 'https://github.com/abhishekSaha7',
  linkedin_url TEXT DEFAULT 'https://www.linkedin.com/in/abhisek-saha-898575179',
  profile_image_url TEXT,
  greeting TEXT DEFAULT 'Hello, I''m',
  hero_description TEXT DEFAULT '',
  cta_projects_label TEXT DEFAULT 'View Projects',
  cta_resume_label TEXT DEFAULT 'Download Resume',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- HERO TITLES
-- ============================================
CREATE TABLE hero_titles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- SKILLS
-- ============================================
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EDUCATION
-- ============================================
CREATE TABLE education (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  degree TEXT NOT NULL,
  institution TEXT NOT NULL,
  year TEXT,
  marks TEXT,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- EXPERIENCE
-- ============================================
CREATE TABLE experience (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT,
  technologies TEXT[] DEFAULT '{}',
  location TEXT,
  currently_working BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECTS
-- ============================================
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  short_description TEXT NOT NULL DEFAULT '',
  full_description TEXT NOT NULL DEFAULT '',
  technologies TEXT[] DEFAULT '{}',
  github_url TEXT,
  live_url TEXT,
  thumbnail_url TEXT,
  featured BOOLEAN NOT NULL DEFAULT FALSE,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- PROJECT IMAGES
-- ============================================
CREATE TABLE project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RESUME
-- ============================================
CREATE TABLE resume (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  published BOOLEAN NOT NULL DEFAULT FALSE,
  uploaded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- UPDATED_AT TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hero_titles_updated_at BEFORE UPDATE ON hero_titles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_skills_updated_at BEFORE UPDATE ON skills
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_education_updated_at BEFORE UPDATE ON education
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experience_updated_at BEFORE UPDATE ON experience
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_resume_updated_at BEFORE UPDATE ON resume
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_titles ENABLE ROW LEVEL SECURITY;
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE education ENABLE ROW LEVEL SECURITY;
ALTER TABLE experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon can read published/public content)
CREATE POLICY "Public can read profiles" ON profiles FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Public can read enabled hero titles" ON hero_titles FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Public can read enabled skills" ON skills FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Public can read enabled education" ON education FOR SELECT TO anon, authenticated USING (enabled = true);
CREATE POLICY "Public can read published experience" ON experience FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public can read published projects" ON projects FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "Public can read project images of published projects" ON project_images FOR SELECT TO anon, authenticated
  USING (EXISTS (SELECT 1 FROM projects WHERE projects.id = project_images.project_id AND projects.published = true));
CREATE POLICY "Public can read published resume" ON resume FOR SELECT TO anon, authenticated USING (published = true);

-- Admin read all (authenticated users)
CREATE POLICY "Admin can read all hero titles" ON hero_titles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all skills" ON skills FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all education" ON education FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all experience" ON experience FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all projects" ON projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all project images" ON project_images FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin can read all resumes" ON resume FOR SELECT TO authenticated USING (true);

-- Admin write policies (authenticated users only)
CREATE POLICY "Admin can update profiles" ON profiles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can insert hero titles" ON hero_titles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update hero titles" ON hero_titles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete hero titles" ON hero_titles FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert skills" ON skills FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update skills" ON skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete skills" ON skills FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert education" ON education FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update education" ON education FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete education" ON education FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert experience" ON experience FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update experience" ON experience FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete experience" ON experience FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert projects" ON projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update projects" ON projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete projects" ON projects FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert project images" ON project_images FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update project images" ON project_images FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete project images" ON project_images FOR DELETE TO authenticated USING (true);
CREATE POLICY "Admin can insert resume" ON resume FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Admin can update resume" ON resume FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Admin can delete resume" ON resume FOR DELETE TO authenticated USING (true);

-- ============================================
-- STORAGE BUCKETS
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('project-images', 'project-images', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Storage policies
CREATE POLICY "Public can view profile images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'profile-images');
CREATE POLICY "Public can view project images" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "Authenticated can view resumes" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes');
CREATE POLICY "Public can download published resumes" ON storage.objects FOR SELECT TO anon
  USING (bucket_id = 'resumes');

CREATE POLICY "Admin can upload profile images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'profile-images');
CREATE POLICY "Admin can update profile images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'profile-images');
CREATE POLICY "Admin can delete profile images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'profile-images');

CREATE POLICY "Admin can upload project images" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-images');
CREATE POLICY "Admin can update project images" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'project-images');
CREATE POLICY "Admin can delete project images" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'project-images');

CREATE POLICY "Admin can upload resumes" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes');
CREATE POLICY "Admin can update resumes" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes');
CREATE POLICY "Admin can delete resumes" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes');

-- ============================================
-- SEED DATA
-- ============================================
INSERT INTO profiles (bio, hero_description) VALUES (
  'I''m a frontend developer focused on building modern, responsive and user-friendly web applications. I work with technologies such as React, Next.js, TypeScript and Redux Toolkit, with a strong interest in creating clean interfaces, reusable components and practical solutions to real-world problems. I''m continuously expanding my skills and building projects that demonstrate my ability to turn ideas into polished web experiences.',
  'Building modern, responsive web experiences with React and Next.js.'
);

INSERT INTO hero_titles (title, display_order, enabled) VALUES
  ('I am a Frontend Developer', 0, true),
  ('I am a React.js Developer', 1, true),
  ('I am a Next.js Developer', 2, true),
  ('I build modern web applications', 3, true);

INSERT INTO skills (name, display_order, enabled) VALUES
  ('React', 0, true),
  ('Next.js', 1, true),
  ('JavaScript', 2, true),
  ('TypeScript', 3, true),
  ('Redux Toolkit', 4, true),
  ('HTML', 5, true),
  ('CSS', 6, true),
  ('Tailwind', 7, true),
  ('MUI', 8, true),
  ('Git', 9, true);

INSERT INTO education (degree, institution, year, marks, display_order, enabled) VALUES
  ('10th', 'South Point High School', '2012', '80%', 0, true),
  ('12th', 'South Point High School', '2014', '68%', 1, true),
  ('College', 'Institute of Engineering and Management (IEM), Kolkata', NULL, 'CGPA: 6.43', 2, true);
