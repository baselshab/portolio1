"use client";

import React, { useRef, useState } from "react";
import styles from "./Testimonials.module.scss";

interface Testimonial {
  id: string;
  name: string;
  role: string;
  org: string;
  quote: string;
  initials: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Sarah Jenkins",
    role: "VP of Engineering",
    org: "Nabras Technologies",
    initials: "SJ",
    rating: 5,
    quote:
      "Basel delivers systems with rare architectural clarity. His focus on clean code and maintainability saved our team countless engineering hours down the road.",
  },
  {
    id: "t2",
    name: "David Chen",
    role: "Founder & CEO",
    org: "HealthTech Systems",
    initials: "DC",
    rating: 5,
    quote:
      "Our platform handled 10x user traffic on launch day without a single hiccup. Basel's backend design and database indexing were the cornerstone of that success.",
  },
  {
    id: "t3",
    name: "Marcus Vance",
    role: "Principal Architect",
    org: "Apex Digital Solutions",
    initials: "MV",
    rating: 5,
    quote:
      "He doesn't just write code; he solves foundational product challenges. Basel brings world-class engineering discipline and proactive communication to every sprint.",
  },
];

export default function Testimonials() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const cardWidth = el.firstElementChild?.clientWidth || 280;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(index, testimonials.length - 1));
  };

  const scrollToIndex = (index: number) => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const cards = el.children;
    if (cards[index]) {
      cards[index].scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
      setActiveIndex(index);
    }
  };

  return (
    <section className={styles.testimonialsSection} aria-label="Endorsements and Testimonials">
      <div className="wrap">
        <header className={styles.header}>
          <div className={styles.eyebrow}>
            <span className={styles.dot} />
            Client & Colleague Endorsements
          </div>
          <div className={styles.titleRow}>
            <h2 className={styles.heading}>
              Trusted by teams who value <em>precision</em>.
            </h2>
            <p className={styles.subtitle}>
              Feedback from engineering leaders and founders who have worked directly with Basel on production systems.
            </p>
          </div>
        </header>

        {/* Desktop 3-Column Cards */}
        <div className={styles.desktopGrid}>
          {testimonials.map((t) => (
            <article key={t.id} className={styles.desktopCard}>
              <div className={styles.stars}>
                {"★".repeat(t.rating)}
              </div>
              <blockquote className={styles.quote}>
                “{t.quote}”
              </blockquote>
              <div className={styles.authorRow}>
                <div className={styles.avatar}>{t.initials}</div>
                <div>
                  <div className={styles.authorName}>{t.name}</div>
                  <div className={styles.authorRole}>
                    {t.role} — <span>{t.org}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Dedicated Mobile Swipeable Carousel */}
        <div className={styles.mobileCarouselWrap}>
          <div
            ref={carouselRef}
            className={styles.mobileCarousel}
            onScroll={handleScroll}
          >
            {testimonials.map((t) => (
              <article key={`mob-${t.id}`} className={styles.mobileCard}>
                <div className={styles.cardHeader}>
                  <div className={styles.stars}>
                    {"★".repeat(t.rating)}
                  </div>
                  <span className={styles.verifiedPill}>Verified Colleague</span>
                </div>
                <blockquote className={styles.mobileQuote}>
                  “{t.quote}”
                </blockquote>
                <div className={styles.mobileAuthor}>
                  <div className={styles.avatar}>{t.initials}</div>
                  <div className={styles.authorInfo}>
                    <div className={styles.authorName}>{t.name}</div>
                    <div className={styles.authorRole}>
                      {t.role}, {t.org}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Mobile Pagination & Touch Arrows */}
          <div className={styles.mobileControls}>
            <div className={styles.dots}>
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToIndex(i)}
                  className={`${styles.dotItem} ${
                    activeIndex === i ? styles.activeDot : ""
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <div className={styles.swipeHint}>
              <span>← Swipe to read →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
