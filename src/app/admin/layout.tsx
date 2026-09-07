"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@/lib/supabase/client";
import styles from "./AdminLayout.module.scss";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // If the path is /admin/login, render without the admin dashboard chrome
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) return;

    const supabase = createBrowserClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setUserEmail(user.email);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/admin/login");
      } else if (session?.user?.email) {
        setUserEmail(session.user.email);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [isLoginPage, router]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    try {
      const supabase = createBrowserClient();
      await supabase.auth.signOut();
      router.push("/admin/login");
      router.refresh();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const navItems = [
    { label: "Overview", href: "/admin", icon: "▤" },
    { label: "Projects", href: "/admin/projects", icon: "❖" },
    { label: "Messages", href: "/admin/messages", icon: "✉" },
  ];

  const getBreadcrumbTitle = () => {
    if (pathname === "/admin") return "Overview";
    if (pathname.startsWith("/admin/projects")) return "Projects";
    if (pathname.startsWith("/admin/messages")) return "Messages";
    return "Dashboard";
  };

  return (
    <div className={styles.adminShell}>
      {/* Mobile backdrop */}
      <div
        className={`${styles.mobileBackdrop} ${mobileOpen ? styles.mobileOpen : ""}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar Navigation */}
      <aside className={`${styles.sidebar} ${mobileOpen ? styles.mobileOpen : ""}`}>
        <div>
          <div className={styles.brand}>
            <Link href="/admin" className={styles.logo}>
              Basel<span>.</span>
            </Link>
            <span className={styles.adminTag}>Admin Console</span>
          </div>

          <nav className={styles.navSection}>
            {navItems.map((item) => {
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.active : ""}`}
                >
                  <span className={styles.icon}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className={styles.sidebarFooter}>
          <Link href="/" target="_blank" className={styles.siteLink}>
            <span>View Live Portfolio</span>
            <span>↗</span>
          </Link>

          <button onClick={handleLogout} className={styles.logoutBtn} type="button">
            <span>⏻</span>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className={styles.mainViewport}>
        <header className={styles.topHeader}>
          <div className={styles.headerLeft}>
            <button
              type="button"
              className={styles.toggleBtn}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation"
            >
              ☰
            </button>
            <div className={styles.breadcrumb}>
              Admin / <span>{getBreadcrumbTitle()}</span>
            </div>
          </div>

          <div className={styles.headerRight}>
            <div className={styles.statusIndicator}>
              <span className={styles.dot} />
              <span>Live System</span>
            </div>
            {userEmail && <span className={styles.userEmail}>{userEmail}</span>}
          </div>
        </header>

        <main className={styles.pageContainer}>{children}</main>
      </div>
    </div>
  );
}
