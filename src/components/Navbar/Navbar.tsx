"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.scss";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const navItems: NavItem[] = [
  { label: "Work", href: "/#work", id: "work" },
  { label: "About", href: "/#about", id: "about" },
  { label: "Services", href: "/#services", id: "services" },
  { label: "Stack", href: "/#stack", id: "stack" },
  { label: "Contact", href: "/#contact", id: "contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("work");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Track scroll position for navbar glass styling
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section detection via IntersectionObserver on homepage
  useEffect(() => {
    if (pathname.startsWith("/work/")) {
      setActiveSection("work");
      return;
    }

    const sections = ["work", "about", "services", "stack", "contact"]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        root: null,
        rootMargin: "-25% 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    id: string
  ) => {
    setMobileOpen(false);

    // If on homepage and clicking anchor link, smooth scroll
    if (pathname === "/" && href.startsWith("/#")) {
      e.preventDefault();
      const targetElement = document.getElementById(id);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        setActiveSection(id);
      }
    }
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.navContainer}>
        {/* Brand Identity */}
        <Link href="/" className={styles.brand} aria-label="Basel Abushab Homepage">
          <span className={styles.mark}>Basel Abushab</span>
          <span className={styles.roleBadge}>Engineer</span>
        </Link>

        {/* Center Desktop Navigation Links */}
        <nav className={styles.linksWrapper} aria-label="Desktop Navigation">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`${styles.navLink} ${isActive ? styles.active : ""}`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className={styles.actions}>
          <div className={styles.statusPill}>
            <span className={styles.dotWrapper}>
              <span className={styles.dot} />
              <span className={styles.pulse} />
            </span>
            <span>Available</span>
          </div>

          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact", "contact")}
            className={styles.ctaButton}
          >
            Get in touch ↗
          </a>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            className={`${styles.mobileToggle} ${mobileOpen ? styles.open : ""}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {/* Mobile Glass Dropdown Menu */}
      <div
        className={`${styles.mobileMenu} ${mobileOpen ? styles.menuOpen : ""}`}
        aria-hidden={!mobileOpen}
      >
        <div className={styles.mobileList}>
          {navItems.map((item, idx) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href, item.id)}
                className={`${styles.mobileLink} ${
                  isActive ? styles.mobileActive : ""
                }`}
              >
                <span>{item.label}</span>
                <span className={styles.tag}>0{idx + 1}</span>
              </a>
            );
          })}
        </div>

        <div className={styles.mobileFooter}>
          <div className={styles.mobileStatus}>
            <span className={styles.greenDot} />
            Available for selected contracts & full-time roles
          </div>
          <a
            href="/#contact"
            onClick={(e) => handleNavClick(e, "/#contact", "contact")}
            className={styles.mobileCta}
          >
            Start a conversation ↗
          </a>
        </div>
      </div>
    </header>
  );
}
