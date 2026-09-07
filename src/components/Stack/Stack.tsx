import React from "react";
import styles from "./Stack.module.scss";

interface ToolCategory {
  category: string;
  badge: string;
  description: string;
  items: string[];
}

const stackCategories: ToolCategory[] = [
  {
    category: "Languages",
    badge: "Core",
    description: "Type-safe, compiled, and scripting languages for production systems.",
    items: ["TypeScript", "JavaScript", "Python", "Go", "SQL"],
  },
  {
    category: "Frameworks",
    badge: "Web & API",
    description: "Modern full-stack and server-side application frameworks.",
    items: ["Next.js", "React", "Node.js", "Django", "FastAPI"],
  },
  {
    category: "Infrastructure",
    badge: "Cloud & Data",
    description: "Containerization, cloud deployment, and relational databases.",
    items: ["Docker", "PostgreSQL", "Supabase", "Redis", "AWS"],
  },
  {
    category: "Architecture & Tools",
    badge: "DevOps",
    description: "Continuous integration, protocol standards, and systems engineering.",
    items: ["REST & GraphQL", "CI/CD Actions", "Linux", "Git", "System Design"],
  },
];

export default function Stack() {
  return (
    <section className={styles.stackSection} id="stack" aria-label="Technical Stack">
      <div className="wrap">
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Stack & Technologies
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.heading}>
              Engineered with modern, <em>battle-tested</em> tools.
            </h2>
            <p className={styles.subtext}>
              Carefully chosen technologies prioritizing end-to-end type safety, high concurrent throughput, and long-term architectural maintainability.
            </p>
          </div>
        </header>

        {/* Unified Responsive Cards Grid: 4-col desktop, 2-col tablet, 1-col mobile */}
        <div className={styles.grid}>
          {stackCategories.map((cat, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.headerLeft}>
                  <span className={styles.catDot} />
                  <h3 className={styles.catTitle}>{cat.category}</h3>
                </div>
                <span className={styles.badge}>{cat.badge}</span>
              </div>
              <p className={styles.cardDesc}>{cat.description}</p>
              <div className={styles.pillsWrap}>
                {cat.items.map((item, iIdx) => (
                  <span key={iIdx} className={styles.pill}>
                    <span className={styles.pillDot} />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
