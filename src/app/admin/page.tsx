"use client";

import React, { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { getAdminStats, AdminStats } from "@/lib/api/admin";
import styles from "./Dashboard.module.scss";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const loadData = async () => {
    try {
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    startTransition(async () => {
      setLoading(true);
      await loadData();
    });
  };

  return (
    <div className={styles.dashboardRoot}>
      {/* Header */}
      <div className={styles.welcomeHeader}>
        <div className={styles.titleGroup}>
          <h1>Dashboard Overview</h1>
          <p>Portfolio activity, project management & visitor inquiries</p>
        </div>

        <div className={styles.actionGroup}>
          <button
            type="button"
            onClick={handleRefresh}
            className={styles.secondaryAction}
            disabled={loading || isPending}
          >
            <span>↻</span>
            <span>{loading ? "Refreshing..." : "Refresh"}</span>
          </button>

          <Link href="/admin/projects" className={styles.primaryAction}>
            <span>+</span>
            <span>New Project</span>
          </Link>
        </div>
      </div>

      {/* SQL Migration Reminder if DB has 0 records */}
      {stats && stats.totalProjects === 0 && stats.totalMessages === 0 && (
        <div className={styles.dbNotice}>
          <div>
            <strong>Database initialization:</strong> If your Supabase tables are newly created, make sure you ran <code>supabase/schema.sql</code> in your Supabase SQL Editor.
          </div>
          <Link href="/admin/projects" className={styles.primaryAction} style={{ padding: "6px 14px", fontSize: "11px" }}>
            Add First Project
          </Link>
        </div>
      )}

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        <div className={`${styles.statCard} ${styles.highlight}`}>
          <div className={styles.statHead}>
            <span className={styles.statLabel}>Total Projects</span>
            <span className={styles.statIcon}>❖</span>
          </div>
          <div className={styles.statValue}>
            {loading ? "..." : (stats?.totalProjects ?? 0)}
          </div>
          <div className={styles.statMeta}>Published & in-progress works</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHead}>
            <span className={styles.statLabel}>Featured Items</span>
            <span className={styles.statIcon}>★</span>
          </div>
          <div className={styles.statValue}>
            {loading ? "..." : (stats?.featuredProjects ?? 0)}
          </div>
          <div className={styles.statMeta}>Highlighted on homepage</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHead}>
            <span className={styles.statLabel}>Total Inquiries</span>
            <span className={styles.statIcon}>✉</span>
          </div>
          <div className={styles.statValue}>
            {loading ? "..." : (stats?.totalMessages ?? 0)}
          </div>
          <div className={styles.statMeta}>Contact form submissions</div>
        </div>

        <div
          className={`${styles.statCard} ${
            (stats?.unreadMessages ?? 0) > 0 ? styles.unreadAlert : ""
          }`}
        >
          <div className={styles.statHead}>
            <span className={styles.statLabel}>Unread Messages</span>
            <span className={styles.statIcon}>●</span>
          </div>
          <div className={styles.statValue}>
            {loading ? "..." : (stats?.unreadMessages ?? 0)}
          </div>
          <div className={styles.statMeta}>Awaiting your response</div>
        </div>
      </div>

      {/* Two Column Section */}
      <div className={styles.dataSection}>
        {/* Recent Projects */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>
              <span>❖</span>
              <span>Recent Projects</span>
            </h3>
            <Link href="/admin/projects" className={styles.viewAllLink}>
              Manage all →
            </Link>
          </div>

          <div className={styles.panelBody}>
            {loading ? (
              <div className={styles.emptyState}>Loading projects...</div>
            ) : !stats?.recentProjects || stats.recentProjects.length === 0 ? (
              <div className={styles.emptyState}>No projects found.</div>
            ) : (
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProjects.map((project) => (
                    <tr key={project.id || project.slug}>
                      <td>
                        <div className={styles.itemTitle}>{project.title}</div>
                        <div className={styles.itemSub}>{project.slug}</div>
                      </td>
                      <td>
                        <span className={styles.tag}>{project.category}</span>
                      </td>
                      <td>
                        {project.featured ? (
                          <span className={`${styles.tag} ${styles.featured}`}>Featured</span>
                        ) : (
                          <span className={styles.tag}>Standard</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Recent Messages */}
        <div className={styles.panel}>
          <div className={styles.panelHeader}>
            <h3>
              <span>✉</span>
              <span>Recent Inquiries</span>
            </h3>
            <Link href="/admin/messages" className={styles.viewAllLink}>
              View inbox →
            </Link>
          </div>

          <div className={styles.panelBody}>
            {loading ? (
              <div className={styles.emptyState}>Loading inquiries...</div>
            ) : !stats?.recentMessages || stats.recentMessages.length === 0 ? (
              <div className={styles.emptyState}>No contact messages yet.</div>
            ) : (
              <table className={styles.miniTable}>
                <thead>
                  <tr>
                    <th>Sender</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentMessages.map((msg) => (
                    <tr key={msg.id}>
                      <td>
                        <div className={styles.itemTitle}>{msg.name}</div>
                        <div className={styles.itemSub}>{msg.email}</div>
                      </td>
                      <td>
                        <span className={styles.itemSub}>
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`${styles.tag} ${
                            msg.is_read ? styles.read : styles.unread
                          }`}
                        >
                          {msg.is_read ? "Read" : "Unread"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
