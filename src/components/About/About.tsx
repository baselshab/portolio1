import React from "react";
import Image from "next/image";
import styles from "./About.module.scss";

export default function About() {
  const experiences = [
    {
      yr: "2024 — Present",
      role: "Senior Software Engineer",
      org: "Nabras Technologies",
      desc: "Leading core software architecture, scalable APIs, and mission-critical web applications.",
    },
    {
      yr: "2022 — 2024",
      role: "Full-Stack Engineer",
      org: "Early-stage startup",
      desc: "Built performant Next.js applications and resilient backend microservices from scratch.",
    },
    {
      yr: "2020 — 2022",
      role: "Freelance Software Engineer",
      org: "Independent",
      desc: "Delivered bespoke enterprise portals, dashboards, and automated operational workflows.",
    },
    {
      yr: "2019",
      role: "BSc, Software Engineering",
      org: "Graduated with Honors",
      desc: "Specialized in software architecture, algorithm design, and modern database systems.",
    },
  ];

  return (
    <section className={styles.about} id="about">
      <div className={`wrap ${styles.grid}`}>
        {/* Visual Photos Container */}
        <div className={styles.photos}>
          <div className={styles.ph1}>
            <Image
              src="/images/about-portrait.jpg"
              alt="Basel Abushab portrait"
              width={400}
              height={500}
              sizes="(max-width: 900px) 90vw, 30vw"
            />
          </div>
          <div className={styles.ph2}>
            <Image
              src="/images/about-collab.jpg"
              alt="Basel Abushab presenting a dashboard"
              width={350}
              height={300}
              sizes="(max-width: 900px) 50vw, 25vw"
            />
          </div>
        </div>

        {/* Narrative & Statistics */}
        <div className={styles.copy}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>About & Philosophy</span>
            <p className={styles.quote}>
              Good code is <span>read</span> far more often than it&apos;s written.
            </p>
          </div>

          <div className={styles.bioText}>
            <p>
              Basel started by writing small scripts to automate tedious
              university tasks — and the curiosity never stopped. Today he builds
              systems relied on by thousands of users every day, from live server
              dashboards to full enterprise platforms.
            </p>
            <p>
              He favors simple solutions over clever, complicated ones, and
              measures a project&apos;s success by how easy it is to maintain a
              year after launch — not by how many features it ships with.
            </p>
          </div>
        </div>

        {/* Section 7: Experience / Timeline */}
        <div className={styles.index}>
          <h4>Experience & Career</h4>

          {/* Desktop Tabular View */}
          <div className={styles.desktopRows}>
            {experiences.map((exp, idx) => (
              <div className={styles.row} key={idx}>
                <div className={styles.yr}>{exp.yr}</div>
                <div className={styles.role}>{exp.role}</div>
                <div className={styles.org}>{exp.org}</div>
              </div>
            ))}
          </div>

          {/* Dedicated Mobile Vertical Timeline */}
          <div className={styles.mobileTimeline}>
            {experiences.map((exp, idx) => (
              <div className={styles.timelineItem} key={`timeline-${idx}`}>
                <div className={styles.timelineMarker}>
                  <div className={styles.timelineDot} />
                  {idx < experiences.length - 1 && (
                    <div className={styles.timelineLine} />
                  )}
                </div>
                <div className={styles.timelineCard}>
                  <span className={styles.timelineYear}>{exp.yr}</span>
                  <h5 className={styles.timelineRole}>{exp.role}</h5>
                  <div className={styles.timelineOrg}>{exp.org}</div>
                  <p className={styles.timelineDesc}>{exp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
