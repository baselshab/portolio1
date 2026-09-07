"use client";

import React, { useState, useEffect, useTransition } from "react";
import Image from "next/image";
import {
  getAdminProjects,
  createAdminProject,
  updateAdminProject,
  deleteAdminProject,
  toggleFeaturedProject,
  uploadProjectImage,
  ProjectFormData,
} from "@/lib/api/admin";
import { ProjectRow } from "@/lib/supabase/types";
import styles from "./ProjectsAdmin.module.scss";

const DEFAULT_FORM: ProjectFormData = {
  title: "",
  slug: "",
  category: "Full-Stack Web App",
  description: "",
  long_description: "",
  image: "",
  image_url: "",
  image_fit: "cover",
  image_position: "center",
  image_scale: 100,
  technologies: [],
  github_url: "",
  live_url: "",
  role: "Lead Engineer",
  year: new Date().getFullYear().toString(),
  is_light: false,
  featured: true,
  sort_order: 0,
};

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM);
  const [techInput, setTechInput] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [, startTransition] = useTransition();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await getAdminProjects();
      setProjects(data);
    } catch (err) {
      console.error("Failed to load projects:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  // Filter projects by search and category
  const filteredProjects = projects.filter((p) => {
    const categoryLower = (p.category || "").toLowerCase();
    const titleLower = (p.title || "").toLowerCase();
    const slugLower = (p.slug || "").toLowerCase();

    const matchesSearch =
      search.trim() === "" ||
      titleLower.includes(search.toLowerCase()) ||
      slugLower.includes(search.toLowerCase()) ||
      categoryLower.includes(search.toLowerCase()) ||
      p.technologies?.some((t) => t.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      categoryFilter === "all" ||
      categoryLower === categoryFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Extract unique categories for filter
  const categories = Array.from(
    new Set(projects.map((p) => p.category).filter(Boolean) as string[])
  );

  // Open modal for Create
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM,
      idx: String(projects.length + 1).padStart(2, "0"),
      year: new Date().getFullYear().toString(),
    });
    setTechInput("");
    setFormError(null);
    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEdit = (project: ProjectRow) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      slug: project.slug,
      idx: project.idx || "01",
      letter: project.letter || project.title.charAt(0).toUpperCase(),
      category: project.category || "Full-Stack Web App",
      description: project.description,
      long_description: project.long_description || "",
      image: project.image || project.image_url || "",
      image_url: project.image_url || project.image || "",
      image_fit: (project.image_fit as "cover" | "contain" | "fill") || "cover",
      image_position: (project.image_position as "center" | "top" | "bottom" | "left" | "right") || "center",
      image_scale:
        typeof project.image_scale === "number"
          ? project.image_scale <= 2
            ? project.image_scale * 100
            : project.image_scale
          : 100,
      technologies: project.technologies || [],
      github_url: project.github_url || "",
      live_url: project.live_url || "",
      role: project.role || "Lead Engineer",
      year: project.year || "2024",
      is_light: !!project.is_light,
      featured: !!project.featured,
      sort_order: project.sort_order || 0,
    });
    setTechInput((project.technologies || []).join(", "));
    setFormError(null);
    setIsModalOpen(true);
  };

  // Handle title change & auto-generate slug for new items
  const handleTitleChange = (val: string) => {
    const updated = { ...formData, title: val };
    if (!editingId && (!formData.slug || formData.slug === slugify(formData.title))) {
      updated.slug = slugify(val);
    }
    setFormData(updated);
  };

  const slugify = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Image Upload handler
  const handleImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setFormError(null);

    const res = await uploadProjectImage(file);
    setUploadingImage(false);

    if (res.success && res.url) {
      setFormData((prev) => ({
        ...prev,
        image: res.url,
        image_url: res.url,
      }));
    } else {
      setFormError(res.error || "Failed to upload image. Please try again.");
    }
  };

  // Handle Submit Form
  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (!formData.slug.trim()) {
      setFormError("Slug is required.");
      return;
    }
    if (!formData.category.trim()) {
      setFormError("Category is required.");
      return;
    }
    if (!formData.description.trim()) {
      setFormError("Short description is required.");
      return;
    }

    setFormSubmitting(true);
    setFormError(null);

    // Parse tech tags from input
    const parsedTech = techInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: ProjectFormData = {
      ...formData,
      technologies: parsedTech.length > 0 ? parsedTech : formData.technologies,
    };

    if (editingId) {
      const res = await updateAdminProject(editingId, payload);
      setFormSubmitting(false);
      if (res.success) {
        setIsModalOpen(false);
        loadProjects();
      } else {
        setFormError(res.error || "Failed to update project.");
      }
    } else {
      const res = await createAdminProject(payload);
      setFormSubmitting(false);
      if (res.success) {
        setIsModalOpen(false);
        loadProjects();
      } else {
        setFormError(res.error || "Failed to create project.");
      }
    }
  };

  // Quick toggle featured status
  const handleToggleFeatured = async (id: string, current: boolean) => {
    // Optimistic update
    setProjects((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !current } : p))
    );
    const ok = await toggleFeaturedProject(id, !current);
    if (!ok) {
      // Revert if failed
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: current } : p))
      );
    }
  };

  // Delete project
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteAdminProject(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setProjects((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      setDeleteTarget(null);
    } else {
      alert(res.error || "Failed to delete project.");
    }
  };

  return (
    <div className={styles.projectsRoot}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div className={styles.titleBlock}>
          <h1>Project Management</h1>
          <p>Create, update, and manage your portfolio projects & case studies</p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className={styles.primaryBtn}
        >
          <span>+</span>
          <span>Add New Project</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search projects by title, slug, stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">All Categories ({projects.length})</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          {loading ? (
            <div className={styles.emptyState}>Loading projects...</div>
          ) : filteredProjects.length === 0 ? (
            <div className={styles.emptyState}>
              {search || categoryFilter !== "all"
                ? "No projects match your search filters."
                : "No projects yet. Click 'Add New Project' to publish your first one."}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Project</th>
                  <th>Category</th>
                  <th>Stack</th>
                  <th>Featured</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.map((project) => {
                  const img = project.image || project.image_url;
                  return (
                    <tr key={project.id}>
                      <td>
                        <div className={styles.projectCell}>
                          <div className={styles.thumbnail}>
                            {img ? (
                              <img src={img} alt={project.title} />
                            ) : (
                              <span>{project.letter || project.title.charAt(0)}</span>
                            )}
                          </div>
                          <div className={styles.meta}>
                            <div className={styles.title}>{project.title}</div>
                            <div className={styles.slug}>/{project.slug}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className={styles.categoryTag}>{project.category}</span>
                      </td>

                      <td>
                        <div className={styles.techPills}>
                          {(project.technologies || []).slice(0, 3).map((tech) => (
                            <span key={tech} className={styles.pill}>
                              {tech}
                            </span>
                          ))}
                          {(project.technologies?.length || 0) > 3 && (
                            <span className={styles.pill}>
                              +{(project.technologies?.length || 0) - 3}
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <button
                          type="button"
                          className={`${styles.toggleSwitch} ${
                            project.featured ? styles.isFeatured : ""
                          }`}
                          onClick={() =>
                            handleToggleFeatured(project.id, !!project.featured)
                          }
                          title="Click to toggle featured state on homepage"
                        >
                          <span>{project.featured ? "★" : "☆"}</span>
                          <span>{project.featured ? "Featured" : "Standard"}</span>
                        </button>
                      </td>

                      <td>
                        <div className={styles.actionButtons}>
                          <a
                            href={`/work/${project.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Preview live case study"
                          >
                            ↗
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(project)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className={styles.deleteBtn}
                            onClick={() => setDeleteTarget(project)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* CREATE / EDIT MODAL DRAWER */}
      {isModalOpen && (
        <div
          className={styles.modalBackdrop}
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsModalOpen(false);
          }}
        >
          <div className={styles.modalCard}>
            <div className={styles.modalHeader}>
              <h2>{editingId ? "Edit Project" : "Create New Project"}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setIsModalOpen(false)}
                aria-label="Close dialog"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className={styles.modalForm}>
              <div className={styles.modalBody}>
                {formError && (
                  <div
                    style={{
                      padding: "12px 16px",
                      background: "rgba(239, 68, 68, 0.08)",
                      border: "1px solid rgba(239, 68, 68, 0.25)",
                      borderRadius: "10px",
                      color: "#dc2626",
                      fontSize: "12.5px",
                      fontFamily: "monospace",
                      lineHeight: "1.4",
                    }}
                  >
                    <strong>⚠ Error: </strong>
                    {formError}
                  </div>
                )}

                {/* Title & Slug */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Project Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sentinela AI"
                      value={formData.title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>URL Slug *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. sentinela-ai"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: slugify(e.target.value) })
                      }
                    />
                    <span className={styles.hint}>
                      Route will be: /work/{formData.slug || "slug"}
                    </span>
                  </div>
                </div>

                {/* Category & Year */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AI / Observability"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Year</label>
                    <input
                      type="text"
                      placeholder="2024"
                      value={formData.year}
                      onChange={(e) =>
                        setFormData({ ...formData, year: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Short Description */}
                <div className={styles.formGroup}>
                  <label>Short Description *</label>
                  <textarea
                    required
                    placeholder="Concise overview displayed on project cards..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                {/* Long Description */}
                <div className={styles.formGroup}>
                  <label>Full Case Study Description</label>
                  <textarea
                    style={{ minHeight: "110px" }}
                    placeholder="Comprehensive case study content shown on the dedicated project detail page..."
                    value={formData.long_description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        long_description: e.target.value,
                      })
                    }
                  />
                </div>

                {/* Technologies */}
                <div className={styles.formGroup}>
                  <label>Technologies / Stack</label>
                  <input
                    type="text"
                    placeholder="React, Next.js, TypeScript, PostgreSQL, Tailwind"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                  />
                  <span className={styles.hint}>
                    Separate tags with commas (e.g. Next.js, Supabase, Tailwind)
                  </span>
                </div>

                {/* Image Upload or URL */}
                <div className={styles.formGroup}>
                  <label>Project Cover Image</label>
                  <div className={styles.imageUploader}>
                    {formData.image_url || formData.image ? (
                      <div className={styles.imagePreview}>
                        <img
                          src={formData.image_url || formData.image}
                          alt="Cover preview"
                        />
                        <button
                          type="button"
                          className={styles.removeImgBtn}
                          onClick={() =>
                            setFormData({ ...formData, image: "", image_url: "" })
                          }
                        >
                          Remove Image
                        </button>
                      </div>
                    ) : (
                      <label className={styles.uploadDropzone}>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFile}
                          disabled={uploadingImage}
                        />
                        <div className={styles.dropzoneText}>
                          {uploadingImage ? (
                            <span>Uploading to Supabase Storage...</span>
                          ) : (
                            <>
                              <span>Click to upload image</span> or drag and drop
                              <br />
                              PNG, JPG, WebP up to 5MB
                            </>
                          )}
                        </div>
                      </label>
                    )}

                    <input
                      type="url"
                      placeholder="Or paste an external image URL directly..."
                      value={formData.image_url || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          image: e.target.value,
                          image_url: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                {/* Image Settings Section / إعدادات عرض الصورة */}
                <div className={styles.imageSettingsSection}>
                  <div className={styles.sectionTitle}>
                    <h4>
                      <span>⚙</span>
                      <span>إعدادات عرض الصورة (Image Display Controls)</span>
                    </h4>
                    <span className={styles.badge}>Live Preview</span>
                  </div>

                  <div className={styles.settingsGrid}>
                    <div className={styles.formGroup}>
                      <label>طريقة الاحتواء (Image Fit)</label>
                      <select
                        value={formData.image_fit || "cover"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_fit: e.target.value as "cover" | "contain" | "fill",
                          })
                        }
                      >
                        <option value="cover">Cover (ملء الإطار مع قص متناسق)</option>
                        <option value="contain">Contain (إظهار الصورة كاملة دون قص)</option>
                        <option value="fill">Fill (تمديد الصورة لتعبئة الإطار)</option>
                      </select>
                      <span className={styles.hint}>
                        يتحكم في تناسب الصورة داخل المساحة المخصصة لها
                      </span>
                    </div>

                    <div className={styles.formGroup}>
                      <label>نقطة المحاذاة (Image Position)</label>
                      <select
                        value={formData.image_position || "center"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_position: e.target.value as "center" | "top" | "bottom" | "left" | "right",
                          })
                        }
                      >
                        <option value="center">Center (في المنتصف)</option>
                        <option value="top">Top (تركيز على الجزء العلوي)</option>
                        <option value="bottom">Bottom (تركيز على الجزء السفلي)</option>
                        <option value="left">Left (تركيز على جهة اليسار)</option>
                        <option value="right">Right (تركيز على جهة اليمين)</option>
                      </select>
                      <span className={styles.hint}>
                        يحدد نقطة الارتكاز عند القص أو الاحتواء
                      </span>
                    </div>
                  </div>

                  {/* Scale Control */}
                  <div className={styles.formGroup}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <label>تكبير / تصغير (Scale): {formData.image_scale ?? 100}%</label>
                      {(formData.image_scale !== 100 && formData.image_scale !== undefined) && (
                        <button
                          type="button"
                          className={styles.resetScaleBtn}
                          onClick={() => setFormData({ ...formData, image_scale: 100 })}
                        >
                          إعادة ضبط (100%)
                        </button>
                      )}
                    </div>
                    <div className={styles.scaleControl}>
                      <input
                        type="range"
                        min="60"
                        max="140"
                        step="5"
                        value={formData.image_scale ?? 100}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            image_scale: Number(e.target.value),
                          })
                        }
                      />
                      <span className={styles.scaleValue}>
                        {formData.image_scale ?? 100}%
                      </span>
                    </div>
                  </div>

                  {/* Live Interactive Preview Box */}
                  <div className={styles.livePreviewBox}>
                    <span className={styles.previewLabel}>معاينة حية لشكل الصورة في الكرت (Live Preview)</span>
                    <div className={styles.previewCanvas}>
                      {formData.image_url || formData.image ? (
                        <>
                          <img
                            src={formData.image_url || formData.image}
                            alt="Live Preview"
                            style={{
                              objectFit: formData.image_fit || "cover",
                              objectPosition: formData.image_position || "center",
                              transform: formData.image_scale && formData.image_scale !== 100
                                ? `scale(${formData.image_scale / 100})`
                                : undefined,
                            }}
                          />
                          <div className={styles.previewWatermark}>
                            Fit: {formData.image_fit || "cover"} | Pos: {formData.image_position || "center"} | {formData.image_scale ?? 100}%
                          </div>
                        </>
                      ) : (
                        <div className={styles.emptyPreview}>
                          أدخل رابط صورة أو ارفع صورة لمشاهدة المعاينة المباشرة هنا
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Links: GitHub & Live URL */}
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Live URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com"
                      value={formData.live_url}
                      onChange={(e) =>
                        setFormData({ ...formData, live_url: e.target.value })
                      }
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>GitHub Repository</label>
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={formData.github_url}
                      onChange={(e) =>
                        setFormData({ ...formData, github_url: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Options: Featured & Light Theme */}
                <div className={styles.checkboxGroup}>
                  <label className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) =>
                        setFormData({ ...formData, featured: e.target.checked })
                      }
                    />
                    <span>Featured on Homepage</span>
                  </label>

                  <label className={styles.checkItem}>
                    <input
                      type="checkbox"
                      checked={formData.is_light}
                      onChange={(e) =>
                        setFormData({ ...formData, is_light: e.target.checked })
                      }
                    />
                    <span>Light Card Theme</span>
                  </label>
                </div>
              </div>

              <div className={styles.modalFooter}>
                {formError ? (
                  <div className={styles.footerError} title={formError}>
                    ⚠ {formError}
                  </div>
                ) : (
                  <div />
                )}

                <div className={styles.footerButtons}>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={formSubmitting || uploadingImage}
                  >
                    {formSubmitting
                      ? "Saving..."
                      : editingId
                      ? "Update Project"
                      : "Create Project"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className={styles.modalBackdrop}>
          <div className={styles.confirmDialog}>
            <h3>Delete Project?</h3>
            <p>
              Are you sure you want to delete <strong>{deleteTarget.title}</strong>?
              This action cannot be undone.
            </p>
            <div className={styles.dialogActions}>
              <button
                type="button"
                className={styles.dialogCancel}
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                className={styles.dialogDelete}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
