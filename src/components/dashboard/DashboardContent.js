"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { useDashboard } from "@/hooks/useDashboard";
import { STATUS_CONFIG } from "@/utils/constants";
import { formatDate } from "@/utils/formatters";
import styles from "./Dashboard.module.css";

// ─── Custom Tooltip ─────────────────────────────────
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: "var(--bg-card)",
        border: "1px solid var(--border-primary)",
        borderRadius: "var(--radius-md)",
        padding: "8px 12px",
        fontSize: "var(--text-xs)",
        color: "var(--text-primary)",
        boxShadow: "var(--shadow-md)",
      }}
    >
      <strong>{d.name}</strong>: {d.value}
    </div>
  );
}

export default function DashboardContent() {
  const { stats, loading, error } = useDashboard();

  // Derive stat values
  const derived = useMemo(() => {
    if (!stats) return null;

    const statusMap = {};
    (stats.statusCounts || []).forEach(({ _id, count }) => {
      statusMap[_id] = count;
    });

    const total = stats.totalCount || 0;
    const interviews = statusMap["interview"] || 0;
    const offers = statusMap["offer"] || 0;
    const applied = statusMap["applied"] || 0;
    const responseRate =
      applied > 0
        ? Math.round(
            ((interviews + offers) / (applied + interviews + offers)) * 100,
          )
        : 0;

    // Pie chart data
    const pieData = Object.entries(STATUS_CONFIG)
      .map(([key, config]) => ({
        name: config.label,
        value: statusMap[key] || 0,
        color: config.color,
      }))
      .filter((d) => d.value > 0);

    // Bar chart — status distribution
    const barData = Object.entries(STATUS_CONFIG).map(([key, config]) => ({
      name: config.label,
      count: statusMap[key] || 0,
      color: config.color,
    }));

    return {
      total,
      interviews,
      offers,
      responseRate,
      pieData,
      barData,
      statusMap,
    };
  }, [stats]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        Loading analytics…
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

  if (!derived) return null;

  const statCards = [
    {
      label: "Total Applications",
      value: derived.total,
      icon: "📋",
      color: "var(--accent-primary)",
      footer: "All time",
    },
    {
      label: "Interviews",
      value: derived.interviews,
      icon: "🎯",
      color: "var(--warning)",
      footer: "Scheduled or completed",
    },
    {
      label: "Offers",
      value: derived.offers,
      icon: "🎉",
      color: "var(--success)",
      footer: "Received",
    },
    {
      label: "Response Rate",
      value: `${derived.responseRate}%`,
      icon: "📈",
      color: "var(--info)",
      footer: "Interview + offer / applied",
    },
  ];

  return (
    <div className={styles.dashboardGrid}>
      {/* ─── Stat Cards ──────────────────────────── */}
      <div className={styles.statsRow}>
        {statCards.map((card) => (
          <div
            key={card.label}
            className={styles.statCard}
            style={{ "--card-accent": card.color }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: card.color,
                borderRadius: "var(--radius-lg) var(--radius-lg) 0 0",
              }}
            />
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{card.label}</span>
              <span className={styles.statIcon}>{card.icon}</span>
            </div>
            <div className={styles.statValue}>{card.value}</div>
            <div className={styles.statFooter}>{card.footer}</div>
          </div>
        ))}
      </div>

      {/* ─── Charts ──────────────────────────────── */}
      <div className={styles.chartsRow}>
        {/* Pie Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Status Distribution</h3>
          <div className={styles.chartContainer}>
            {derived.pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={derived.pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="value"
                    stroke="none"
                  >
                    {derived.pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className={styles.emptyActivity}>No data yet</div>
            )}
          </div>
        </div>

        {/* Bar Chart */}
        <div className={styles.chartCard}>
          <h3 className={styles.chartTitle}>Applications by Status</h3>
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={derived.barData} barSize={32}>
                <CartesianGrid
                  stroke="var(--border-primary)"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={{ stroke: "var(--border-primary)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: "var(--text-muted)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {derived.barData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ─── Recent Activity ─────────────────────── */}
      <div className={styles.activityCard}>
        <h3 className={styles.activityTitle}>Recent Applications</h3>
        {stats.recentApplications?.length > 0 ? (
          <div className={styles.activityList}>
            {stats.recentApplications.map((app) => {
              const statusConf = STATUS_CONFIG[app.status] || {};
              return (
                <div key={app._id} className={styles.activityItem}>
                  <span
                    className={styles.activityDot}
                    style={{ backgroundColor: statusConf.color }}
                  />
                  <div className={styles.activityContent}>
                    <div className={styles.activityCompany}>{app.company}</div>
                    <div className={styles.activityPosition}>
                      {app.position}
                    </div>
                  </div>
                  <span
                    className={styles.activityStatus}
                    style={{
                      background: statusConf.bgColor,
                      color: statusConf.color,
                    }}
                  >
                    {statusConf.label}
                  </span>
                  <span className={styles.activityDate}>
                    {formatDate(app.createdAt)}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.emptyActivity}>
            No applications yet. Create one to see activity here.
          </div>
        )}
      </div>
    </div>
  );
}
