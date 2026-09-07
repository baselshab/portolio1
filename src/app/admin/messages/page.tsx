"use client";

import React, { useState, useEffect } from "react";
import {
  getAdminMessages,
  toggleMessageRead,
  deleteAdminMessage,
} from "@/lib/api/admin";
import { ContactMessageRow } from "@/lib/supabase/types";
import styles from "./MessagesAdmin.module.scss";

export default function MessagesAdminPage() {
  const [messages, setMessages] = useState<ContactMessageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState<"all" | "unread" | "read">("all");

  // Modal / Detail state
  const [activeMessage, setActiveMessage] = useState<ContactMessageRow | null>(null);

  // Delete target
  const [deleteTarget, setDeleteTarget] = useState<ContactMessageRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = async () => {
    setLoading(true);
    try {
      const data = await getAdminMessages();
      setMessages(data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  // Filter messages by search and tab
  const filteredMessages = messages.filter((m) => {
    const matchesSearch =
      search.trim() === "" ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase());

    const matchesTab =
      tabFilter === "all" ||
      (tabFilter === "unread" && !m.is_read) ||
      (tabFilter === "read" && m.is_read);

    return matchesSearch && matchesTab;
  });

  const unreadCount = messages.filter((m) => !m.is_read).length;

  // View message & auto mark read if unread
  const handleOpenMessage = async (msg: ContactMessageRow) => {
    setActiveMessage(msg);
    if (!msg.is_read) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m))
      );
      await toggleMessageRead(msg.id, true);
    }
  };

  // Toggle read status manually
  const handleToggleRead = async (msg: ContactMessageRow) => {
    const newStatus = !msg.is_read;
    setMessages((prev) =>
      prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
    );
    if (activeMessage && activeMessage.id === msg.id) {
      setActiveMessage({ ...activeMessage, is_read: newStatus });
    }
    await toggleMessageRead(msg.id, newStatus);
  };

  // Delete message
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    const res = await deleteAdminMessage(deleteTarget.id);
    setIsDeleting(false);

    if (res.success) {
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (activeMessage && activeMessage.id === deleteTarget.id) {
        setActiveMessage(null);
      }
      setDeleteTarget(null);
    } else {
      alert(res.error || "Failed to delete message.");
    }
  };

  return (
    <div className={styles.messagesRoot}>
      {/* Top Header */}
      <div className={styles.topBar}>
        <div className={styles.titleBlock}>
          <h1>Inquiries & Messages</h1>
          <p>Read, respond, and manage submissions from your contact form</p>
        </div>

        <div className={styles.statsPill}>
          <span>Total: <strong>{messages.length}</strong></span>
          <span>•</span>
          <span className={styles.unreadCount}>
            Unread: <strong>{unreadCount}</strong>
          </span>
        </div>
      </div>

      {/* Controls: Search & Tabs */}
      <div className={styles.filterBar}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search by sender name, email, or message text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className={styles.tabs}>
          <button
            type="button"
            className={tabFilter === "all" ? styles.active : ""}
            onClick={() => setTabFilter("all")}
          >
            All ({messages.length})
          </button>
          <button
            type="button"
            className={tabFilter === "unread" ? styles.active : ""}
            onClick={() => setTabFilter("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={tabFilter === "read" ? styles.active : ""}
            onClick={() => setTabFilter("read")}
          >
            Read ({messages.length - unreadCount})
          </button>
        </div>
      </div>

      {/* Messages Table */}
      <div className={styles.tableCard}>
        <div className={styles.tableResponsive}>
          {loading ? (
            <div className={styles.emptyState}>Loading messages...</div>
          ) : filteredMessages.length === 0 ? (
            <div className={styles.emptyState}>
              {search || tabFilter !== "all"
                ? "No inquiries match your current filters."
                : "No contact submissions received yet."}
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Sender</th>
                  <th>Message Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => (
                  <tr
                    key={msg.id}
                    className={!msg.is_read ? styles.unreadRow : ""}
                  >
                    <td>
                      <div className={styles.senderCell}>
                        <div className={styles.name}>{msg.name}</div>
                        <div className={styles.email}>{msg.email}</div>
                      </div>
                    </td>

                    <td>
                      <div className={styles.messageSnippet}>
                        {msg.message}
                      </div>
                    </td>

                    <td>
                      <span style={{ fontFamily: "monospace", fontSize: "11.5px", color: "var(--ink-soft)" }}>
                        {new Date(msg.created_at).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`${styles.statusBadge} ${
                          msg.is_read ? styles.read : styles.unread
                        }`}
                      >
                        {msg.is_read ? "Read" : "Unread"}
                      </span>
                    </td>

                    <td>
                      <div className={styles.actionButtons}>
                        <button
                          type="button"
                          className={styles.viewBtn}
                          onClick={() => handleOpenMessage(msg)}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleRead(msg)}
                          title={msg.is_read ? "Mark unread" : "Mark read"}
                        >
                          {msg.is_read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() => setDeleteTarget(msg)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* MESSAGE DETAIL MODAL */}
      {activeMessage && (
        <div className={styles.modalBackdrop}>
          <div className={styles.messageModalCard}>
            <div className={styles.modalHeader}>
              <h2>Inquiry from {activeMessage.name}</h2>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActiveMessage(null)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.metaGrid}>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Sender Name</span>
                  <span className={styles.val}>{activeMessage.name}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Email Address</span>
                  <span className={styles.val}>{activeMessage.email}</span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Received At</span>
                  <span className={styles.val}>
                    {new Date(activeMessage.created_at).toLocaleString()}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.label}>Status</span>
                  <span className={styles.val}>
                    {activeMessage.is_read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>

              <div className={styles.messageContent}>
                {activeMessage.message}
              </div>
            </div>

            <div className={styles.modalFooter}>
              <a
                href={`mailto:${activeMessage.email}?subject=Re: Your portfolio inquiry`}
                className={styles.replyLink}
              >
                <span>✉</span>
                <span>Reply via Email</span>
              </a>

              <div className={styles.footerActions}>
                <button
                  type="button"
                  onClick={() => handleToggleRead(activeMessage)}
                >
                  {activeMessage.is_read ? "Mark Unread" : "Mark Read"}
                </button>
                <button
                  type="button"
                  style={{ color: "#ef4444" }}
                  onClick={() => {
                    setDeleteTarget(activeMessage);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteTarget && (
        <div className={styles.modalBackdrop}>
          <div
            style={{
              background: "#ffffff",
              padding: "28px",
              borderRadius: "18px",
              maxWidth: "420px",
              width: "100%",
              textAlign: "center",
              boxShadow: "0 20px 50px rgba(0, 0, 0, 0.2)",
            }}
          >
            <h3 style={{ fontFamily: "serif", fontSize: "20px", marginBottom: "8px" }}>
              Delete Message?
            </h3>
            <p style={{ fontSize: "13.5px", color: "var(--ink-soft)", marginBottom: "24px" }}>
              Are you sure you want to delete message from{" "}
              <strong>{deleteTarget.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                type="button"
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "1px solid var(--line)",
                  background: "#f4f3ee",
                  cursor: "pointer",
                }}
                onClick={() => setDeleteTarget(null)}
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  padding: "10px 20px",
                  borderRadius: "999px",
                  border: "none",
                  background: "#ef4444",
                  color: "#ffffff",
                  cursor: "pointer",
                }}
                onClick={handleConfirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
