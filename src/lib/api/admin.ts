import { supabase } from "../supabase/client";
import { ProjectRow, ContactMessageRow } from "../supabase/types";

export interface ProjectFormData {
  title: string;
  slug: string;
  idx?: string;
  letter?: string;
  category: string;
  description: string;
  long_description?: string;
  image?: string;
  image_url?: string;
  image_fit?: "cover" | "contain" | "fill";
  image_position?: "center" | "top" | "bottom" | "left" | "right";
  image_scale?: number;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  role?: string;
  year?: string;
  is_light: boolean;
  featured: boolean;
  metrics?: { label: string; value: string }[];
  sort_order?: number;
}

export interface AdminStats {
  totalProjects: number;
  featuredProjects: number;
  totalMessages: number;
  unreadMessages: number;
  recentProjects: ProjectRow[];
  recentMessages: ContactMessageRow[];
}

/**
 * Fetch overview statistics for the admin dashboard.
 */
export async function getAdminStats(): Promise<AdminStats> {
  try {
    const [projectsRes, messagesRes] = await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }),
    ]);

    const projects = (projectsRes.data as unknown as ProjectRow[]) || [];
    const messages = (messagesRes.data as unknown as ContactMessageRow[]) || [];

    const featuredProjects = projects.filter((p) => p.featured !== false).length;
    const unreadMessages = messages.filter((m) => !m.is_read).length;

    return {
      totalProjects: projects.length,
      featuredProjects,
      totalMessages: messages.length,
      unreadMessages,
      recentProjects: projects.slice(0, 5),
      recentMessages: messages.slice(0, 5),
    };
  } catch (err) {
    console.error("Error fetching admin stats:", err);
    return {
      totalProjects: 0,
      featuredProjects: 0,
      totalMessages: 0,
      unreadMessages: 0,
      recentProjects: [],
      recentMessages: [],
    };
  }
}

/**
 * Fetch all projects for the admin projects table.
 */
export async function getAdminProjects(): Promise<ProjectRow[]> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as unknown as ProjectRow[]) || [];
  } catch (err) {
    console.error("Error in getAdminProjects:", err);
    return [];
  }
}

/**
 * Check if a project slug already exists (excluding the current project ID when editing).
 */
export async function checkSlugAvailable(slug: string, excludeId?: string): Promise<boolean> {
  try {
    let query = supabase.from("projects").select("id").eq("slug", slug);
    if (excludeId) {
      query = query.neq("id", excludeId);
    }
    const { data } = await query;
    return !data || data.length === 0;
  } catch {
    return true;
  }
}

/**
 * Create a new project.
 */
export async function createAdminProject(
  formData: ProjectFormData
): Promise<{ success: boolean; error?: string; data?: ProjectRow }> {
  try {
    const isAvailable = await checkSlugAvailable(formData.slug);
    if (!isAvailable) {
      return { success: false, error: "This slug is already in use. Please choose a unique slug." };
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const insertPayload: Record<string, any> = {
      title: formData.title.trim(),
      slug: formData.slug.trim().toLowerCase(),
      idx: formData.idx || "01",
      letter: formData.letter || formData.title.trim().charAt(0).toUpperCase(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      long_description: formData.long_description?.trim() || null,
      image: formData.image || formData.image_url || null,
      image_url: formData.image_url || formData.image || null,
      image_fit: formData.image_fit || "cover",
      image_position: formData.image_position || "center",
      image_scale: typeof formData.image_scale === "number" ? formData.image_scale : 100,
      technologies: formData.technologies,
      github_url: formData.github_url?.trim() || null,
      live_url: formData.live_url?.trim() || null,
      link: formData.live_url?.trim() || null,
      repo_url: formData.github_url?.trim() || null,
      role: formData.role?.trim() || "Lead Engineer",
      year: formData.year?.trim() || "2024",
      is_light: formData.is_light,
      featured: formData.featured,
      metrics: formData.metrics || [],
      sort_order: formData.sort_order || 0,
    };

    if (user?.id) {
      insertPayload.user_id = user.id;
    }

    const { data, error } = await supabase
      .from("projects")
      .insert([insertPayload])
      .select()
      .single();

    if (error) {
      if (error.code === "42501" || error.message?.toLowerCase().includes("policy")) {
        return {
          success: false,
          error: "Permission denied (RLS). Please ensure you are logged in with an authenticated admin account.",
        };
      }
      throw error;
    }

    return { success: true, data: data as unknown as ProjectRow };
  } catch (err: any) {
    console.error("Error creating project:", err);
    return { success: false, error: err.message || "Failed to create project." };
  }
}

/**
 * Update an existing project.
 */
export async function updateAdminProject(
  id: string,
  formData: Partial<ProjectFormData>
): Promise<{ success: boolean; error?: string }> {
  try {
    if (formData.slug) {
      const isAvailable = await checkSlugAvailable(formData.slug, id);
      if (!isAvailable) {
        return { success: false, error: "This slug is already in use by another project." };
      }
    }

    const updatePayload: Record<string, any> = {
      updated_at: new Date().toISOString(),
    };

    if (formData.title !== undefined) updatePayload.title = formData.title.trim();
    if (formData.slug !== undefined) updatePayload.slug = formData.slug.trim().toLowerCase();
    if (formData.idx !== undefined) updatePayload.idx = formData.idx;
    if (formData.letter !== undefined) updatePayload.letter = formData.letter;
    if (formData.category !== undefined) updatePayload.category = formData.category.trim();
    if (formData.description !== undefined) updatePayload.description = formData.description.trim();
    if (formData.long_description !== undefined) updatePayload.long_description = formData.long_description?.trim() || null;
    if (formData.image !== undefined) updatePayload.image = formData.image;
    if (formData.image_url !== undefined) updatePayload.image_url = formData.image_url;
    if (formData.image_fit !== undefined) updatePayload.image_fit = formData.image_fit;
    if (formData.image_position !== undefined) updatePayload.image_position = formData.image_position;
    if (formData.image_scale !== undefined) updatePayload.image_scale = formData.image_scale;
    if (formData.technologies !== undefined) updatePayload.technologies = formData.technologies;
    if (formData.github_url !== undefined) {
      updatePayload.github_url = formData.github_url?.trim() || null;
      updatePayload.repo_url = formData.github_url?.trim() || null;
    }
    if (formData.live_url !== undefined) {
      updatePayload.live_url = formData.live_url?.trim() || null;
      updatePayload.link = formData.live_url?.trim() || null;
    }
    if (formData.role !== undefined) updatePayload.role = formData.role?.trim() || null;
    if (formData.year !== undefined) updatePayload.year = formData.year?.trim() || null;
    if (formData.is_light !== undefined) updatePayload.is_light = formData.is_light;
    if (formData.featured !== undefined) updatePayload.featured = formData.featured;
    if (formData.metrics !== undefined) updatePayload.metrics = formData.metrics;
    if (formData.sort_order !== undefined) updatePayload.sort_order = formData.sort_order;

    const { error } = await supabase.from("projects").update(updatePayload).eq("id", id);
    if (error) {
      if (error.code === "42501" || error.message?.toLowerCase().includes("policy")) {
        return {
          success: false,
          error: "Permission denied (RLS). Please ensure you are logged in with an authenticated admin account.",
        };
      }
      throw error;
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error updating project:", err);
    return { success: false, error: err.message || "Failed to update project." };
  }
}

/**
 * Delete a project.
 */
export async function deleteAdminProject(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting project:", err);
    return { success: false, error: err.message || "Failed to delete project." };
  }
}

/**
 * Toggle featured status of a project.
 */
export async function toggleFeaturedProject(id: string, featured: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("projects")
      .update({ featured, updated_at: new Date().toISOString() })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Upload an image file to Supabase Storage 'project-images' bucket.
 */
export async function uploadProjectImage(file: File): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Please select an image file (PNG, JPG, WebP, etc.)." };
    }

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return { success: false, error: "Image size must be less than 5MB." };
    }

    const fileExt = file.name.split(".").pop() || "jpg";
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `uploads/${fileName}`;

    let { error: uploadError } = await supabase.storage
      .from("project-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: true,
      });

    // If bucket is not found, attempt to create it
    if (uploadError && uploadError.message?.toLowerCase().includes("bucket not found")) {
      try {
        await supabase.storage.createBucket("project-images", { public: true });
        const retry = await supabase.storage
          .from("project-images")
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: true,
          });
        uploadError = retry.error;
      } catch (createErr) {
        console.warn("Could not auto-create storage bucket:", createErr);
      }
    }

    if (uploadError) {
      if (uploadError.message?.toLowerCase().includes("bucket not found")) {
        return {
          success: false,
          error: "Storage bucket 'project-images' not found in Supabase. You can paste an image URL directly below.",
        };
      }
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-images").getPublicUrl(filePath);

    return { success: true, url: publicUrl };
  } catch (err: any) {
    console.error("Storage upload error:", err);
    return { success: false, error: err.message || "Failed to upload image. You can paste an image URL directly." };
  }
}

/**
 * Fetch all contact messages for admin.
 */
export async function getAdminMessages(): Promise<ContactMessageRow[]> {
  try {
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return (data as unknown as ContactMessageRow[]) || [];
  } catch (err) {
    console.error("Error in getAdminMessages:", err);
    return [];
  }
}

/**
 * Mark a message as read or unread.
 */
export async function toggleMessageRead(id: string, is_read: boolean): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read })
      .eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Delete a contact message.
 */
export async function deleteAdminMessage(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error("Error deleting message:", err);
    return { success: false, error: err.message || "Failed to delete message." };
  }
}
