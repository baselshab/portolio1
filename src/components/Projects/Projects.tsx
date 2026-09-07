"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { projects as staticFallbackProjects, Project } from "@/data/projects";
import styles from "./Projects.module.scss";

interface ProjectsProps {
  initialProjects?: Project[];
}

export default function Projects({ initialProjects }: ProjectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [badgePos, setBadgePos] = useState({ x: -100, y: -100, visible: false });
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);

  const projectList = initialProjects && initialProjects.length > 0 
    ? initialProjects 
    : staticFallbackProjects;

  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft } = carouselRef.current;
    const card = carouselRef.current.querySelector<HTMLElement>(`.${styles.mobileCardLink}`);
    if (card) {
      const cardWidth = card.offsetWidth + 16;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== activeMobileIndex && newIndex >= 0 && newIndex < projectList.length) {
        setActiveMobileIndex(newIndex);
      }
    }
  };

  const scrollToCard = (index: number) => {
    if (!carouselRef.current) return;
    const card = carouselRef.current.querySelector<HTMLElement>(`.${styles.mobileCardLink}`);
    if (card) {
      const cardWidth = card.offsetWidth + 16;
      carouselRef.current.scrollTo({
        left: index * cardWidth,
        behavior: "smooth",
      });
      setActiveMobileIndex(index);
    }
  };

  const handlePrevCard = () => {
    scrollToCard(Math.max(0, activeMobileIndex - 1));
  };

  const handleNextCard = () => {
    scrollToCard(Math.min(projectList.length - 1, activeMobileIndex + 1));
  };

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      const heading = containerRef.current?.querySelector(`.${styles.sectionLabel} .fx`);
      if (heading) {
        gsap.fromTo(
          heading,
          {
            clipPath: "inset(0 0 100% 0)",
            y: 8,
            opacity: 0,
          },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    },
    { scope: containerRef }
  );

  const handleMouseMove = (e: React.MouseEvent) => {
    setBadgePos({
      x: e.clientX,
      y: e.clientY,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setBadgePos((prev) => ({ ...prev, visible: false }));
  };

  return (
    <section id="work" ref={containerRef}>
      {/* Floating interactive cursor badge */}
      <div
        ref={badgeRef}
        className={`${styles.cursorBadge} ${badgePos.visible ? styles.show : ""}`}
        style={{
          left: `${badgePos.x}px`,
          top: `${badgePos.y}px`,
        }}
        aria-hidden="true"
      >
        View
      </div>

      <div className="wrap">
        <div className={styles.sectionLabel}>
          <h2>
            <span className="fx">Selected Work</span>
          </h2>
          <span className={styles.count}>
            {String(projectList.length).padStart(2, "0")} Projects
          </span>
        </div>
      </div>

      <div className={styles.work}>
        {projectList.length === 0 ? (
          <div className="wrap" style={{ padding: "60px 0", color: "var(--ink-soft)" }}>
            <p style={{ fontFamily: "var(--mono)", fontSize: "14px" }}>
              No projects found. New case studies coming soon.
            </p>
          </div>
        ) : (
          projectList.map((item) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className={styles.projectLink}
              aria-label={`${item.title} — ${item.category}`}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              <div
                className={`${styles.project} ${
                  item.isLight ? styles.light : ""
                }`}
                data-title={item.title}
              >
                <div className={styles.visual}>
                  {item.image || item.imageUrl ? (
                    <img
                      src={item.image || item.imageUrl}
                      alt={item.title}
                      className={styles.projectImage}
                      style={{
                        objectFit: item.imageFit || "cover",
                        objectPosition: item.imagePosition || "center",
                        transform:
                          item.imageScale && item.imageScale !== 100
                            ? `scale(${item.imageScale / 100})`
                            : undefined,
                      }}
                      loading="lazy"
                    />
                  ) : (
                    <span className={styles.letter}>{item.letter}</span>
                  )}
                </div>
                <div className={styles.info}>
                  <div className={styles.meta}>
                    <span className={styles.idx}>{item.idx}</span>
                    <span>{item.category}</span>
                  </div>
                  <h3 className={styles.title}>{item.title}</h3>
                  <p className={styles.desc}>{item.desc}</p>
                  <div className={styles.stack}>{item.stack.join(" / ")}</div>
                  <div className={styles.cta}>View project ↗</div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Dedicated Mobile Carousel & Cards (Mobile-First Layout) */}
      {projectList.length > 0 && (
        <div className={styles.mobileWork}>
          <div className={styles.mobileCarouselWrapper}>
            <div
              ref={carouselRef}
              className={styles.mobileCarousel}
              onScroll={handleCarouselScroll}
            >
              {projectList.map((item, idx) => (
                <Link
                  key={`mobile-${item.slug}`}
                  href={`/work/${item.slug}`}
                  className={styles.mobileCardLink}
                  aria-label={`${item.title} — ${item.category}`}
                >
                  <article className={styles.mobileCard}>
                    <div className={styles.mobileCardVisual}>
                      <span className={styles.mobileIdxBadge}>
                        {item.idx || `0${idx + 1}`}
                      </span>
                      <span className={styles.mobileCategoryBadge}>
                        {item.category}
                      </span>

                      {item.image || item.imageUrl ? (
                        <img
                          src={item.image || item.imageUrl}
                          alt={item.title}
                          className={styles.mobileImage}
                          style={{
                            objectFit: item.imageFit || "cover",
                            objectPosition: item.imagePosition || "center",
                            transform:
                              item.imageScale && item.imageScale !== 100
                                ? `scale(${item.imageScale / 100})`
                                : undefined,
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <span className={styles.mobileLetter}>{item.letter}</span>
                      )}
                    </div>

                    <div className={styles.mobileCardBody}>
                      <h3 className={styles.mobileTitle}>{item.title}</h3>
                      <p className={styles.mobileDesc}>{item.desc}</p>

                      <div className={styles.mobileStack}>
                        {item.stack.slice(0, 3).map((tech, i) => (
                          <span key={i} className={styles.mobilePill}>
                            {tech}
                          </span>
                        ))}
                        {item.stack.length > 3 && (
                          <span className={styles.mobilePill}>
                            +{item.stack.length - 3}
                          </span>
                        )}
                      </div>

                      <div className={styles.mobileActionBtn}>
                        <span>View Project</span>
                        <span className={styles.btnArrow}>↗</span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>

            {/* Mobile Pagination & Navigation Controls */}
            {projectList.length > 1 && (
              <div className={styles.mobileControls}>
                <div className={styles.swipeHint}>
                  <span className={styles.swipeIcon}>⇄</span>
                  <span>Swipe to explore</span>
                </div>

                <div className={styles.dotsGroup}>
                  {projectList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`${styles.dotItem} ${
                        i === activeMobileIndex ? styles.activeDot : ""
                      }`}
                      onClick={() => scrollToCard(i)}
                      aria-label={`Go to project ${i + 1}`}
                    />
                  ))}
                </div>

                <div className={styles.arrowButtons}>
                  <button
                    type="button"
                    onClick={handlePrevCard}
                    disabled={activeMobileIndex === 0}
                    aria-label="Previous project"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextCard}
                    disabled={activeMobileIndex === projectList.length - 1}
                    aria-label="Next project"
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
