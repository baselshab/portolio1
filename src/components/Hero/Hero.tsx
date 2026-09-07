"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.scss";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

  useGSAP(
    () => {
      const reveals = containerRef.current?.querySelectorAll(".fx");
      if (reveals && reveals.length > 0) {
        gsap.fromTo(
          reveals,
          {
            clipPath: "inset(0 0 100% 0)",
            y: 12,
            opacity: 0,
          },
          {
            clipPath: "inset(0 0 0% 0)",
            y: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.18,
            ease: "power3.out",
            delay: 0.1,
          }
        );
      }
    },
    { scope: containerRef }
  );

  const handleScrollToWork = () => {
    const target = document.getElementById("work");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className={`${styles.hero} ${loaded ? styles.loaded : ""}`}
      id="hero"
      ref={containerRef}
    >
      <div className={styles.text}>
        <div className={styles.eyebrow}>
          <span className={styles.statusDotWrapper}>
            <span className={styles.statusDot} />
            <span className={styles.statusPulse} />
          </span>
          <span className={styles.line} />
          Full-Stack Software Engineer
        </div>
        <h1 className={styles.name}>
          <span className={styles.lineWrap}>
            <span className="fx">Basel</span>
          </span>
          <span className={styles.lineWrap}>
            <span className="fx">
              <em>Abushab</em>
            </span>
          </span>
        </h1>
        <p className={styles.tagline}>
          <span className="fx">
            <strong>I don&apos;t chase clever.</strong> I chase code that still
            makes sense a year from now — from the first idea to production, at
            scale.
          </span>
        </p>
        <div className={styles.heroActions}>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              handleScrollToWork();
            }}
            className={styles.primaryCta}
          >
            Explore Work ↗
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const target = document.getElementById("contact");
              if (target) target.scrollIntoView({ behavior: "smooth" });
            }}
            className={styles.secondaryCta}
          >
            Get in touch
          </a>
        </div>

        <div className={styles.scroll} onClick={handleScrollToWork}>
          <div className={styles.bar} />
          Scroll
        </div>
      </div>
      <div className={styles.visual}>
        <Image
          src="/images/hero.jpg"
          alt="Basel Abushab at work"
          width={800}
          height={1000}
          priority
          sizes="(max-width: 900px) 100vw, 50vw"
        />
      </div>
    </section>
  );
}
