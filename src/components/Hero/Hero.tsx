"use client";

import React, { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import styles from "./Hero.module.scss";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reveals = containerRef.current?.querySelectorAll(".fx");
      if (reveals && reveals.length > 0) {
        gsap.fromTo(
          reveals,
          {
            y: 18,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            stagger: 0.14,
            ease: "power2.out",
          }
        );
      }
    },
    { scope: containerRef }
  );

  const handleScrollTo = (id: string) => {
    const target = document.getElementById(id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className={styles.hero} id="hero" ref={containerRef}>
      <div className={styles.bgWrapper}>
        <Image
          src="/images/hero.jpeg"
          alt="Basel Abushab"
          fill
          priority
          sizes="100vw"
          className={styles.bgImage}
        />
      </div>

      <div className={styles.content}>
        <p className={`${styles.eyebrow} fx`}>
          Full-Stack Software Engineer
        </p>

        <h1 className={`${styles.headline} fx`}>
          I care about what happens  <em>after “it works.”</em>
        </h1>

        <h2 className={`${styles.name} fx`}>
          Basel Abushab
        </h2>

        <p className={`${styles.supporting} fx`}>
          Building web applications powered by AI.
        </p>

        <div className={`${styles.heroActions} fx`}>
          <a
            href="#work"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("work");
            }}
            className={styles.primaryCta}
          >
            Explore Work ↗
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              handleScrollTo("contact");
            }}
            className={styles.secondaryCta}
          >
            Get in touch
          </a>
        </div>
      </div>
    </section>
  );
}
