import { createPublicServerClient, isServerSupabaseConfigured } from "../supabase/server";
import { projects as fallbackProjects, Project } from "@/data/projects";

/**
 * Fetch all featured projects from Supabase with automatic fallback to static showcase data.
 */
export async function getProjects(): Promise<Project[]> {
  if (!isServerSupabaseConfigured) {
    return fallbackProjects;
  }

  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase.from("projects").select("*");

    if (error || !data || data.length === 0) {
      return fallbackProjects;
    }

    const rawData = data as unknown as Record<string, any>[];

    // Filter to valid published projects with title and description
    const validProjects = rawData.filter(
      (item) => item.title && item.slug && item.description
    );

    // If Supabase does not have the complete showcase projects yet, ensure fallback is returned
    if (validProjects.length < 2) {
      return fallbackProjects;
    }

    // Sort by sort_order or created_at
    validProjects.sort((a, b) => {
      const orderA = typeof a.sort_order === "number" ? a.sort_order : 999;
      const orderB = typeof b.sort_order === "number" ? b.sort_order : 999;
      return orderA - orderB;
    });

    // Map database fields to Project interface
    return validProjects.map((item, index) => ({
      slug: item.slug,
      idx: item.idx || `0${index + 1}`,
      letter: item.letter || item.title.charAt(0).toUpperCase(),
      category: item.category || "Software Engineering",
      title: item.title,
      desc: item.description,
      image: item.image || item.image_url || undefined,
      imageUrl: item.image_url || item.image || undefined,
      imageFit: ["cover", "contain", "fill"].includes(item.image_fit)
        ? item.image_fit
        : "cover",
      imagePosition: ["center", "top", "bottom", "left", "right"].includes(item.image_position)
        ? item.image_position
        : "center",
      imageScale:
        typeof item.image_scale === "number"
          ? item.image_scale > 2
            ? item.image_scale
            : item.image_scale * 100
          : 100,
      stack: Array.isArray(item.technologies)
        ? item.technologies
        : Array.isArray(item.stack)
        ? item.stack
        : [],
      isLight: Boolean(item.is_light),
      longDescription: item.long_description || undefined,
      role: item.role || undefined,
      year: item.year || undefined,
      liveUrl: item.live_url || item.link || undefined,
      githubUrl: item.github_url || item.repo_url || undefined,
      metrics: Array.isArray(item.metrics) ? item.metrics : undefined,
    }));
  } catch (err) {
    console.warn("Error fetching projects from Supabase (using fallback):", err);
    return fallbackProjects;
  }
}

/**
 * Fetch a single project by its slug from Supabase or fallback projects.
 */
export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const fallback = fallbackProjects.find((p) => p.slug === slug) || null;

  if (!isServerSupabaseConfigured) {
    return fallback;
  }

  try {
    const supabase = createPublicServerClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error || !data || !data.description) {
      return fallback;
    }

    const item = data as unknown as Record<string, any>;

    return {
      slug: item.slug,
      idx: item.idx || "01",
      letter: item.letter || item.title.charAt(0).toUpperCase(),
      category: item.category || "Software Engineering",
      title: item.title,
      desc: item.description,
      image: item.image || item.image_url || undefined,
      imageUrl: item.image_url || item.image || undefined,
      imageFit: ["cover", "contain", "fill"].includes(item.image_fit)
        ? item.image_fit
        : "cover",
      imagePosition: ["center", "top", "bottom", "left", "right"].includes(item.image_position)
        ? item.image_position
        : "center",
      imageScale:
        typeof item.image_scale === "number"
          ? item.image_scale > 2
            ? item.image_scale
            : item.image_scale * 100
          : 100,
      stack: Array.isArray(item.technologies)
        ? item.technologies
        : Array.isArray(item.stack)
        ? item.stack
        : [],
      isLight: Boolean(item.is_light),
      longDescription: item.long_description || undefined,
      role: item.role || undefined,
      year: item.year || undefined,
      liveUrl: item.live_url || item.link || undefined,
      githubUrl: item.github_url || item.repo_url || undefined,
      metrics: Array.isArray(item.metrics) ? item.metrics : undefined,
    };
  } catch (err) {
    console.warn(`Error fetching project "${slug}" from Supabase:`, err);
    return fallback;
  }
}
