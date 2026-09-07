"use client";

import React, { useState } from "react";
import styles from "./FAQ.module.scss";

interface FAQItem {
  id: string;
  q: string;
  a: string;
}

const faqList: FAQItem[] = [
  {
    id: "faq-1",
    q: "What types of engineering projects do you take on?",
    a: "I specialize in end-to-end full-stack web applications, mission-critical API services, real-time monitoring dashboards, and legacy codebase refactoring into modern, maintainable architectures.",
  },
  {
    id: "faq-2",
    q: "What is your primary technology stack?",
    a: "My daily core is Next.js, React, and TypeScript on the frontend, with Node.js, Python, or Go alongside PostgreSQL, Supabase, and Redis on the backend. I adapt seamlessly to whichever stack best fits the product's long-term needs.",
  },
  {
    id: "faq-3",
    q: "Are you available for contract engagements or full-time roles?",
    a: "Yes. I am currently available for select high-impact contract consulting, systems architecture engagements, as well as full-time senior engineering opportunities with ambitious product teams.",
  },
  {
    id: "faq-4",
    q: "How do you ensure maintainability and long-term code quality?",
    a: "Through disciplined architecture: strict type safety, modular separation of concerns, comprehensive automated test suites, and thorough documentation. I measure success by how effortlessly the codebase can be evolved 12 months after shipment.",
  },
];

export default function FAQ() {
  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className={styles.faqSection} id="faq" aria-label="Frequently Asked Questions">
      <div className="wrap">
        <div className={styles.grid}>
          {/* Header Column */}
          <div className={styles.infoCol}>
            <span className={styles.eyebrow}>
              <span className={styles.dot} />
              Frequently Asked
            </span>
            <h2 className={styles.heading}>
              Clear answers to <em>common questions</em>.
            </h2>
            <p className={styles.subtext}>
              Have an unconventional inquiry or a project requiring custom architecture?
              Feel free to reach out directly through the contact section.
            </p>
          </div>

          {/* Accordion List Column */}
          <div className={styles.accordionCol}>
            {faqList.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`${styles.accordionItem} ${
                    isOpen ? styles.open : ""
                  }`}
                >
                  <button
                    type="button"
                    className={styles.triggerBtn}
                    onClick={() => toggleItem(item.id)}
                    aria-expanded={isOpen}
                    aria-controls={`answer-${item.id}`}
                  >
                    <span className={styles.questionText}>{item.q}</span>
                    <span className={styles.iconCircle} aria-hidden="true">
                      <span className={styles.iconLineH} />
                      <span className={styles.iconLineV} />
                    </span>
                  </button>
                  <div
                    id={`answer-${item.id}`}
                    className={styles.contentWrap}
                    aria-hidden={!isOpen}
                  >
                    <div className={styles.answerInner}>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
