-- ==============================================================================
-- Supabase Database Schema, Migrations, RLS Policies & Storage
-- For Basel Abushab Portfolio & Admin Dashboard
-- Run this script in the Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all required columns exist
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS idx TEXT DEFAULT '01';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS letter TEXT DEFAULT 'P';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Infrastructure / Systems';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS technologies TEXT[] DEFAULT '{}';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS github_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS repo_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS live_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS link TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Lead Systems Architect';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS year TEXT DEFAULT '2024';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_light BOOLEAN DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT true;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_fit TEXT DEFAULT 'cover';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_position TEXT DEFAULT 'center';
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_scale NUMERIC DEFAULT 100;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS metrics JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON public.projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

-- 3. Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  items TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_skills_sort ON public.skills(sort_order);

-- 4. Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  yr TEXT NOT NULL,
  role TEXT NOT NULL,
  org TEXT NOT NULL,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_experience_sort ON public.experience(sort_order);

-- 5. Contact Messages Table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  ip_address TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.contact_messages ADD COLUMN IF NOT EXISTS is_read BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_contact_created ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_read ON public.contact_messages(is_read);

-- ==============================================================================
-- Row Level Security (RLS) Configuration
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Reset policies to avoid naming conflicts on re-run
DROP POLICY IF EXISTS "Allow public read access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow authenticated admin full access on projects" ON public.projects;
DROP POLICY IF EXISTS "Allow public read access on skills" ON public.skills;
DROP POLICY IF EXISTS "Allow authenticated admin full access on skills" ON public.skills;
DROP POLICY IF EXISTS "Allow public read access on experience" ON public.experience;
DROP POLICY IF EXISTS "Allow authenticated admin full access on experience" ON public.experience;
DROP POLICY IF EXISTS "Allow public insert on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin read on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin update on contact_messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Allow authenticated admin delete on contact_messages" ON public.contact_messages;

-- Projects Policies
CREATE POLICY "Allow public read access on projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated admin full access on projects"
  ON public.projects FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Skills Policies
CREATE POLICY "Allow public read access on skills"
  ON public.skills FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated admin full access on skills"
  ON public.skills FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Experience Policies
CREATE POLICY "Allow public read access on experience"
  ON public.experience FOR SELECT
  USING (true);

CREATE POLICY "Allow authenticated admin full access on experience"
  ON public.experience FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact Messages Policies
-- 1. Anyone (public/anonymous) can submit a message
CREATE POLICY "Allow public insert on contact_messages"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(trim(name)) > 0 AND
    length(trim(email)) > 3 AND
    length(trim(message)) > 0
  );

-- 2. Only authenticated admin can view, update (e.g. mark read), and delete messages
CREATE POLICY "Allow authenticated admin read on contact_messages"
  ON public.contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated admin update on contact_messages"
  ON public.contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated admin delete on contact_messages"
  ON public.contact_messages FOR DELETE
  TO authenticated
  USING (true);

-- ==============================================================================
-- Supabase Storage Configuration for Project Images
-- ==============================================================================

-- Create 'project-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Storage RLS Policies
DROP POLICY IF EXISTS "Allow public read on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin upload on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin update on project-images" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated admin delete on project-images" ON storage.objects;

-- Public can read images in project-images bucket
CREATE POLICY "Allow public read on project-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

-- Authenticated admin can upload, modify, and delete images
CREATE POLICY "Allow authenticated admin upload on project-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated admin update on project-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project-images')
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow authenticated admin delete on project-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project-images');

-- ==============================================================================
-- Initial Seed Data: Portfolio Projects & Background
-- ==============================================================================

INSERT INTO public.projects (
  slug, idx, letter, category, title, description, long_description,
  technologies, is_light, role, year, live_url, github_url, metrics, sort_order, featured
) VALUES
(
  'pulse',
  '01',
  'P',
  'Infrastructure / Systems',
  'Pulse',
  'A real-time monitoring dashboard tracking the health of 40+ servers, with instant alerts the moment something breaks.',
  'Pulse was engineered to solve high latency monitoring bottlenecks. Built with Go and Redis for blazing-fast event-driven architecture, it processes telemetry data from over 40 production servers simultaneously with sub-second incident alerts.',
  ARRAY['Go', 'React', 'Redis', 'WebSocket'],
  true,
  'Lead Systems Architect',
  '2024',
  'https://example.com/pulse',
  'https://github.com/example/pulse',
  '[{"label": "Servers Monitored", "value": "40+"}, {"label": "Alert Latency", "value": "< 250ms"}, {"label": "Uptime", "value": "99.99%"}]'::jsonb,
  1,
  true
),
(
  'masar',
  '02',
  'M',
  'Mobile / Consumer App',
  'Masar',
  'A fitness and nutrition tracker that logs meals and workouts through image recognition — no tedious manual entry.',
  'Masar simplifies holistic wellness tracking by replacing manual macro counting with intelligent visual recognition models. It delivers a fluid mobile experience used daily by health enthusiasts across the region.',
  ARRAY['React Native', 'Node.js', 'MongoDB'],
  false,
  'Full-Stack Mobile Engineer',
  '2023',
  'https://example.com/masar',
  'https://github.com/example/masar',
  '[{"label": "Active Users", "value": "15,000+"}, {"label": "App Store Rating", "value": "4.8 / 5"}, {"label": "Food Log Accuracy", "value": "94%"}]'::jsonb,
  2,
  true
),
(
  'qcli',
  '03',
  'Q',
  'Developer Tools / Open Source',
  'qcli',
  'An open-source command-line tool for managing background job queues with a minimal memory footprint.',
  'qcli is a zero-dependency, ultra-lightweight CLI utility built in Rust to inspect, flush, and retry background jobs across distributed worker pools without loading heavy web consoles.',
  ARRAY['Rust'],
  true,
  'Creator & Maintainer',
  '2023',
  'https://example.com/qcli',
  'https://github.com/example/qcli',
  '[{"label": "GitHub Stars", "value": "1,200+"}, {"label": "Binary Size", "value": "1.4 MB"}, {"label": "Execution Time", "value": "< 12ms"}]'::jsonb,
  3,
  true
),
(
  'dars',
  '04',
  'D',
  'EdTech / Platform',
  'Dars',
  'A learning platform teaching programming concepts in simplified Arabic, with 3,000+ learners enrolled.',
  'Dars delivers interactive coding education tailored for Arabic speakers. Featuring real-time in-browser code execution, structured curricula, and seamless payment integration with Stripe.',
  ARRAY['Next.js', 'PostgreSQL', 'Stripe'],
  false,
  'Founder & Full-Stack Developer',
  '2022',
  'https://example.com/dars',
  'https://github.com/example/dars',
  '[{"label": "Enrolled Learners", "value": "3,000+"}, {"label": "Completion Rate", "value": "78%"}, {"label": "Interactive Lessons", "value": "120+"}]'::jsonb,
  4,
  true
)
ON CONFLICT (slug) DO UPDATE SET
  idx = EXCLUDED.idx,
  letter = EXCLUDED.letter,
  category = EXCLUDED.category,
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  long_description = EXCLUDED.long_description,
  technologies = EXCLUDED.technologies,
  metrics = EXCLUDED.metrics,
  featured = EXCLUDED.featured,
  sort_order = EXCLUDED.sort_order;

-- Seed Skills
INSERT INTO public.skills (category, items, sort_order) VALUES
  ('Languages', 'TypeScript / Python / Go / Rust', 1),
  ('Frameworks', 'React / Next.js / Node.js / Django', 2),
  ('Infrastructure', 'Docker / AWS / PostgreSQL / Redis', 3),
  ('Daily Tools', 'Git / Linux / Figma / CI/CD', 4)
ON CONFLICT DO NOTHING;

-- Seed Experience
INSERT INTO public.experience (yr, role, org, sort_order) VALUES
  ('2024 — Present', 'Senior Software Engineer', 'Nabras Technologies', 1),
  ('2022 — 2024', 'Full-Stack Engineer', 'Early-stage startup', 2),
  ('2020 — 2022', 'Freelance Software Engineer', 'Independent', 3),
  ('2019', 'BSc, Software Engineering', 'Graduated with Honors', 4)
ON CONFLICT DO NOTHING;
