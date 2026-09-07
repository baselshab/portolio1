"use client";

import React, { useState } from "react";
import Link from "next/link";
import { submitContactMessage } from "@/lib/api/contact";
import styles from "./Contact.module.scss";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    websiteHoneypot: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText("basel@example.com");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2400);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback({ type: null, message: "" });
    setIsSubmitting(true);

    const result = await submitContactMessage(formData);
    setIsSubmitting(false);

    if (result.success) {
      setFeedback({ type: "success", message: result.message });
      setFormData({ name: "", email: "", message: "", websiteHoneypot: "" });
    } else {
      setFeedback({ type: "error", message: result.message });
    }
  };

  return (
    <section className={styles.contactSection} id="contact" aria-label="Contact and Collaboration">
      <div className="wrap">
        <div className={styles.containerGrid}>
          {/* Left Column: Direct Communication & Channels */}
          <div className={styles.infoCol}>
            <div className={styles.availabilityBadge}>
              <span className={styles.statusDotWrapper}>
                <span className={styles.statusDot} />
                <span className={styles.statusPulse} />
              </span>
              <span>Available for Select Contracts & Roles</span>
            </div>

            <h2 className={styles.mainHeading}>
              Let&apos;s build something <em>exceptional</em> together.
            </h2>

            <p className={styles.description}>
              Whether you are architecting a new product from zero, scaling complex distributed services, or seeking high-ownership engineering leadership — my inbox is open.
            </p>

            {/* Direct Email Card with Copy Action */}
            <div className={styles.emailCard}>
              <div className={styles.emailTextWrap}>
                <span className={styles.emailLabel}>Direct Email</span>
                <a href="mailto:basel@example.com" className={styles.emailAddress}>
                  basel@example.com
                </a>
              </div>
              <button
                type="button"
                onClick={handleCopyEmail}
                className={styles.copyBtn}
                aria-label="Copy email address"
              >
                {copiedEmail ? "Copied! ✓" : "Copy"}
              </button>
            </div>

            {/* Meta details: Timezone & Reply speed */}
            <div className={styles.metaRow}>
              <div className={styles.metaItem}>
                <span className={styles.metaDot} />
                <span>Remote • UTC+2 (Flexible Hours)</span>
              </div>
              <div className={styles.metaItem}>
                <span className={styles.metaLightning}>⚡</span>
                <span>Replies within 24 hours</span>
              </div>
            </div>

            {/* Social Channels Pills */}
            <div className={styles.socialGroup}>
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialPill}
              >
                GitHub ↗
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialPill}
              >
                LinkedIn ↗
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.socialPill}
              >
                X (Twitter) ↗
              </a>
            </div>
          </div>

          {/* Right Column: Embedded Direct Message Form */}
          <div className={styles.formCol}>
            <div className={styles.formCard}>
              <div className={styles.formHeader}>
                <h3 className={styles.formTitle}>Send a Direct Message</h3>
                <span className={styles.formStatus}>Instant Delivery</span>
              </div>

              {feedback.type === "success" && (
                <div className={styles.alertSuccess}>
                  <span>✓</span>
                  <span>{feedback.message}</span>
                </div>
              )}

              {feedback.type === "error" && (
                <div className={styles.alertError}>
                  <span>⚠</span>
                  <span>{feedback.message}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Honeypot for spam protection */}
                <input
                  type="text"
                  name="websiteHoneypot"
                  value={formData.websiteHoneypot}
                  onChange={handleInputChange}
                  className={styles.honeypot}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Alex Miller"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-email">Email Address</label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="alex@company.com"
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="contact-message">Project or Inquiry</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Tell me about your goals, stack requirements, or collaboration ideas..."
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={styles.submitButton}
                >
                  {isSubmitting ? "Sending message..." : "Send Message ↗"}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Grand Finale Footer */}
        <footer className={styles.footer}>
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <span className={styles.brandName}>Basel Abushab</span>
              <span className={styles.brandRole}>Full-Stack Software Engineer</span>
            </div>

            <nav className={styles.footerNav} aria-label="Footer Navigation">
              <a href="#work">Work</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#stack">Stack</a>
            </nav>

            <button
              type="button"
              onClick={scrollToTop}
              className={styles.backToTopBtn}
              aria-label="Back to top of page"
            >
              Back to top ↑
            </button>
          </div>

          <div className={styles.footerBottom}>
            <span>© {new Date().getFullYear()} Basel Abushab. All rights reserved.</span>
            <span>Designed & Engineered with Next.js & TypeScript</span>
          </div>
        </footer>
      </div>
    </section>
  );
}
