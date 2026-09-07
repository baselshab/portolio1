export interface ProjectRow {
  id: string;
  title: string;
  slug: string;
  idx?: string;
  letter?: string;
  category?: string;
  description: string;
  long_description?: string | null;
  image?: string | null;
  image_url?: string | null;
  image_fit?: "cover" | "contain" | "fill" | null;
  image_position?: "center" | "top" | "bottom" | "left" | "right" | null;
  image_scale?: number | null;
  technologies?: string[];
  github_url?: string | null;
  repo_url?: string | null;
  live_url?: string | null;
  link?: string | null;
  role?: string | null;
  year?: string | null;
  is_light?: boolean;
  featured?: boolean;
  metrics?: { label: string; value: string }[] | null;
  sort_order?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SkillRow {
  id: string;
  category: string;
  items: string;
  sort_order: number;
  created_at: string;
}

export interface ExperienceRow {
  id: string;
  yr: string;
  role: string;
  org: string;
  sort_order: number;
  created_at: string;
}

export interface ContactMessageRow {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  ip_address?: string | null;
  created_at: string;
}
