"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { api } from "@/utils/api";
import { STATUS_CONFIG } from "@/utils/constants";
import { formatDate, formatRelativeDate } from "@/utils/formatters";
import { useToast } from "@/components/ui/Toast";
import styles from "./FollowUps.module.css";

// ─── Grouping Logic ─────────────────────────────────
function groupFollowUps(items) {
  const now = new Date();
  const startOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const endOfToday = new Date(startOfToday);
  endOfToday.setDate(endOfToday.getDate() + 1);
  const endOfWeek = new Date(startOfToday);
  endOfWeek.setDate(endOfWeek.getDate() + 7);

  const groups = {
    overdue: { title: "Overdue", color: "var(--danger)", items: [] },
    today: { title: "Today", color: "var(--warning)", items: [] },
    thisWeek: { title: "This Week", color: "var(--info)", items: [] },
    later: { title: "Later", color: "var(--text-muted)", items: [] },
  };

  items.forEach((item) => {
    const date = new Date(item.followUpDate);
    if (date < startOfToday) {
      groups.overdue.items.push(item);
    } else if (date < endOfToday) {
      groups.today.items.push(item);
    } else if (date < endOfWeek) {
      groups.thisWeek.items.push(item);
    } else {
      groups.later.items.push(item);
    }
  });

  return groups;
}

export default function FollowUpsContent() {
  const toast = useToast();
  const [followUps, setFollowUps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFollowUps = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get("/api/follow-ups");
      setFollowUps(data.followUps || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowUps();
  }, [fetchFollowUps]);

  const groups = useMemo(() => groupFollowUps(followUps), [followUps]);

  // Snooze: push follow-up 3 days out
  const handleSnooze = async (app) => {
    const newDate = new Date();
    newDate.setDate(newDate.getDate() + 3);
    try {
      await api.put(`/api/applications/${app._id}`, {
        followUpDate: newDate.toISOString(),
      });
      setFollowUps((prev) =>
        prev.map((f) =>
          f._id === app._id ? { ...f, followUpDate: newDate.toISOString() } : f,
        ),
      );
      toast.info(`Snoozed ${app.company} follow-up by 3 days`);
    } catch {
      toast.error("Failed to snooze follow-up");
    }
  };

  // Done: remove the follow-up date
  const handleDone = async (app) => {
    try {
      await api.put(`/api/applications/${app._id}`, {
        followUpDate: "",
      });
      setFollowUps((prev) => prev.filter((f) => f._id !== app._id));
      toast.success(`Marked ${app.company} follow-up as done`);
    } catch {
      toast.error("Failed to update follow-up");
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        Loading follow-ups…
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.loading} style={{ color: "var(--danger)" }}>
        ⚠️ {error}
      </div>
    );
  }

  if (followUps.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>🔔</div>
        <h3 className={styles.emptyTitle}>No follow-ups scheduled</h3>
        <p className={styles.emptyText}>
          Set a follow-up date when creating or editing an application to see
          reminders here.
        </p>
      </div>
    );
  }

  const activeGroups = Object.entries(groups).filter(
    ([, group]) => group.items.length > 0,
  );

  return (
    <div className={styles.followUpsGrid}>
      {activeGroups.map(([key, group]) => (
        <div key={key} className={styles.group}>
          <div className={styles.groupHeader}>
            <span
              className={styles.groupDot}
              style={{ background: group.color }}
            />
            <span className={styles.groupTitle} style={{ color: group.color }}>
              {group.title}
            </span>
            <span className={styles.groupCount}>{group.items.length}</span>
          </div>

          <div className={styles.groupList}>
            {group.items.map((app) => {
              const statusConf = STATUS_CONFIG[app.status] || {};
              const relative = formatRelativeDate(app.followUpDate);
              const isOverdue = key === "overdue";

              return (
                <div key={app._id} className={styles.card}>
                  <div className={styles.cardLeft}>
                    <div className={styles.cardCompany}>{app.company}</div>
                    <div className={styles.cardPosition}>{app.position}</div>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.metaTag}
                        style={{
                          background: statusConf.bgColor,
                          color: statusConf.color,
                        }}
                      >
                        {statusConf.label}
                      </span>
                      <span
                        className={styles.dueBadge}
                        style={{
                          background: isOverdue
                            ? "var(--danger-bg)"
                            : "var(--bg-tertiary)",
                          color: isOverdue
                            ? "var(--danger)"
                            : "var(--text-secondary)",
                        }}
                      >
                        📅 {relative} · {formatDate(app.followUpDate)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.cardActions}>
                    <button
                      className={styles.snoozeBtn}
                      onClick={() => handleSnooze(app)}
                    >
                      ⏰ Snooze 3d
                    </button>
                    <button
                      className={styles.doneBtn}
                      onClick={() => handleDone(app)}
                    >
                      ✓ Done
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
