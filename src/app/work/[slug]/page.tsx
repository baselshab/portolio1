import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjects, getProjectBySlug } from "@/lib/api/projects";
import { projects as fallbackProjects } from "@/data/projects";
import Navbar from "@/components/Navbar/Navbar";
import Contact from "@/components/Contact/Contact";
import styles from "./ProjectDetail.module.scss";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const dbProjects = await getProjects();
  const allSlugs = new Set([
    ...fallbackProjects.map((p) => p.slug),
    ...dbProjects.map((p) => p.slug),
  ]);

  return Array.from(allSlugs).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project Not Found" };

  return {
    title: `${project.title} — Basel Abushab`,
    description: project.desc,
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const allProjects = await getProjects();
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const projectIndex = allProjects.findIndex((p) => p.slug === slug);
  const nextProject =
    projectIndex !== -1
      ? allProjects[(projectIndex + 1) % allProjects.length]
      : allProjects[0];

  return (
    <>
      <Navbar />
      <main className={styles.detailPage}>
        <div className="wrap">
          <Link href="/#work" className={styles.backLink}>
            ← Back to all work
          </Link>

          <header className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.idx}>{project.idx}</span>
              <span>{project.category}</span>
            </div>
            <h1 className={styles.title}>{project.title}</h1>
            <p className={styles.tagline}>{project.desc}</p>

            {project.metrics && (
              <div className={styles.metricsGrid}>
                {project.metrics.map((m, i) => (
                  <div key={i} className={styles.metricCard}>
                    <div className={styles.val}>{m.value}</div>
                    <div className={styles.lbl}>{m.label}</div>
                  </div>
                ))}
              </div>
            )}
          </header>

          {(project.image || project.imageUrl) && (
            <div className={styles.coverWrapper}>
              <img
                src={project.image || project.imageUrl}
                alt={project.title}
                className={styles.coverImage}
                style={{
                  objectFit: project.imageFit || "cover",
                  objectPosition: project.imagePosition || "center",
                }}
              />
            </div>
          )}

          <div className={styles.contentGrid}>
            <div className={styles.mainCol}>
              <h3>Architecture & Engineering</h3>
              <p>
                {project.longDescription ||
                  "Engineered with high standards of maintainability, performance, and fault tolerance."}
              </p>
              <p>
                Every layer was designed to ensure low latency, deterministic
                behavior under peak traffic, and a seamless developer
                experience.
              </p>
            </div>

            <aside className={styles.sidebar}>
              <div className={styles.sideBlock}>
                <h5>Role</h5>
                <p>{project.role || "Lead Engineer"}</p>
              </div>

              <div className={styles.sideBlock}>
                <h5>Year</h5>
                <p>{project.year || "2024"}</p>
              </div>

              <div className={styles.sideBlock}>
                <h5>Technologies</h5>
                <div className={styles.stackTags}>
                  {project.stack.map((t, idx) => (
                    <span key={idx}>{t}</span>
                  ))}
                </div>
              </div>

              <div className={styles.actionBtns}>
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.primary}
                  >
                    Live Demo ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.secondary}
                  >
                    Source Code ↗
                  </a>
                )}
              </div>
            </aside>
          </div>

          <div className={styles.footerNav}>
            <Link href="/#work" className={styles.backLink}>
              ← All Projects
            </Link>

            {nextProject && nextProject.slug !== project.slug && (
              <Link
                href={`/work/${nextProject.slug}`}
                className={styles.nextLink}
              >
                <span>Next Project →</span>
                <strong>{nextProject.title}</strong>
              </Link>
            )}
          </div>
        </div>
      </main>
      <Contact />
    </>
  );
}
