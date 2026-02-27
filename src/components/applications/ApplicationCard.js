"use client";

import { formatDate } from "@/utils/formatters";
import styles from "./ApplicationCard.module.css";

const priorityClass = {
  high: styles.priorityHigh,
  medium: styles.priorityMedium,
  low: styles.priorityLow,
};

const priorityLabel = {
  high: "↑ High",
  medium: "→ Med",
  low: "↓ Low",
};

export default function ApplicationCard({
  application,
  onEdit,
  onDelete,
  isDragging,
}) {
  return (
    <div className={isDragging ? styles.cardDragging : styles.card}>
      <div className={styles.cardHeader}>
        <div>
          <div className={styles.company}>{application.company}</div>
          <div className={styles.position}>{application.position}</div>
        </div>
        <span
          className={
            priorityClass[application.priority] || styles.priorityMedium
          }
        >
          {priorityLabel[application.priority] || "→ Med"}
        </span>
      </div>

      <div className={styles.cardMeta}>
        {application.location && (
          <span className={styles.metaItem}>📍 {application.location}</span>
        )}
        {application.type && (
          <span className={styles.metaItem}>💼 {application.type}</span>
        )}
        {application.appliedDate && (
          <span className={styles.metaItem}>
            📅 {formatDate(application.appliedDate)}
          </span>
        )}
      </div>

      <div className={styles.cardActions}>
        <button
          className={styles.actionBtn}
          onClick={() => onEdit?.(application)}
        >
          Edit
        </button>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete?.(application._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
