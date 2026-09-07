"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import styles from "./Login.module.scss";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMessage(error.message || "Invalid login credentials.");
        setLoading(false);
        return;
      }

      // Navigate to admin dashboard on success
      router.push(redirectPath);
      router.refresh();
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginCard}>
      <div className={styles.brandHeader}>
        <Link href="/" className={styles.backLink}>
          ← Back to Portfolio
        </Link>
        <h1 className={styles.logo}>Basel Abushab</h1>
        <span className={styles.badge}>Admin Console</span>
        <p>Sign in to manage portfolio projects and messages</p>
      </div>

      {errorMessage && (
        <div className={styles.errorAlert} role="alert">
          <span>⚠</span>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label htmlFor="admin-email">Email Address</label>
          <input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
            required
            autoComplete="email"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="admin-password">Password</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "Signing in..." : "Sign In to Dashboard →"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <main className={styles.loginWrapper}>
      <Suspense fallback={<div className={styles.loginCard}>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
