import React from "react";
import styles from "./Services.module.scss";

interface ServiceItem {
  idx: string;
  title: string;
  desc: string;
  tags: string[];
  icon: React.ReactNode;
}

const servicesList: ServiceItem[] = [
  {
    idx: "01",
    title: "Full-Stack Web Architecture",
    desc: "End-to-end web applications built with Next.js and TypeScript, prioritizing maintainability, fluid micro-interactions, and fast load times.",
    tags: ["Next.js", "React", "TypeScript", "SCSS"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    idx: "02",
    title: "High-Performance APIs",
    desc: "Resilient backend services, secure authentication, data validation, and distributed API layers designed for high concurrent throughput.",
    tags: ["Node.js", "Python", "Go", "REST & GraphQL"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </svg>
    ),
  },
  {
    idx: "03",
    title: "Cloud & DevOps Pipelines",
    desc: "Automated continuous delivery, Docker containerization, cloud infrastructure setups, and edge monitoring for zero-downtime releases.",
    tags: ["Docker", "AWS", "CI/CD", "Linux"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"/>
      </svg>
    ),
  },
  {
    idx: "04",
    title: "Database & Schema Design",
    desc: "Optimal relational data modeling, query indexing, Supabase/PostgreSQL integration, and Redis caching layers built for data integrity.",
    tags: ["PostgreSQL", "Supabase", "Redis", "Schema Design"],
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3"/>
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section className={styles.servicesSection} id="services" aria-label="Engineering Services">
      <div className="wrap">
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Specialized Services
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.heading}>
              Engineering solutions built to <em>scale</em> with confidence.
            </h2>
            <p className={styles.subtitle}>
              From early-stage MVPs to distributed high-availability platforms,
              every system is architected for clean maintenance and peak performance.
            </p>
          </div>
        </header>

        {/* Services Grid (Responsive: 4-col desktop, 2-col tablet, clean 1-col mobile cards) */}
        <div className={styles.grid}>
          {servicesList.map((service) => (
            <article key={service.idx} className={styles.card}>
              <div className={styles.cardTop}>
                <div className={styles.iconBox}>{service.icon}</div>
                <span className={styles.idx}>{service.idx}</span>
              </div>
              <h3 className={styles.cardTitle}>{service.title}</h3>
              <p className={styles.cardDesc}>{service.desc}</p>
              <div className={styles.tags}>
                {service.tags.map((tag, tIdx) => (
                  <span key={tIdx} className={styles.tag}>
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
