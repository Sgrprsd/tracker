"use client";

import { useState } from "react";
import { KANBAN_COLUMNS, STATUS_CONFIG } from "@/utils/constants";
import ApplicationCard from "./ApplicationCard";
import styles from "./KanbanBoard.module.css";

export default function KanbanBoard({
  applications,
  loading,
  error,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const [dragOverColumn, setDragOverColumn] = useState(null);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingSpinner} />
        Loading applications…
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>⚠️ {error}</div>;
  }

  // Group applications by status
  const grouped = {};
  KANBAN_COLUMNS.forEach((status) => {
    grouped[status] = [];
  });
  applications.forEach((app) => {
    if (grouped[app.status]) {
      grouped[app.status].push(app);
    }
  });

  const handleDragStart = (e, app) => {
    e.dataTransfer.setData("applicationId", app._id);
    e.dataTransfer.setData("fromStatus", app.status);
    e.dataTransfer.effectAllowed = "move";
    // Add visual feedback to the dragged card
    requestAnimationFrame(() => {
      e.target.style.opacity = "0.4";
      e.target.style.transform = "scale(0.95)";
    });
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = "1";
    e.target.style.transform = "";
    setDragOverColumn(null);
  };

  const handleDragOver = (e, status) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  };

  const handleDragLeave = (e) => {
    // Only clear if we're leaving the drop zone entirely
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);

    const applicationId = e.dataTransfer.getData("applicationId");
    const fromStatus = e.dataTransfer.getData("fromStatus");

    if (fromStatus !== targetStatus && applicationId) {
      onStatusChange?.(applicationId, targetStatus);
    }
  };

  return (
    <div className={styles.kanban}>
      {KANBAN_COLUMNS.map((status) => {
        const config = STATUS_CONFIG[status];
        const apps = grouped[status];
        const isOver = dragOverColumn === status;

        return (
          <div className={styles.column} key={status}>
            <div className={styles.columnHeader}>
              <div className={styles.columnTitle}>
                <span
                  className={styles.statusDot}
                  style={{ backgroundColor: config.color }}
                />
                {config.label}
              </div>
              <span className={styles.columnCount}>{apps.length}</span>
            </div>

            <div
              className={`${styles.dropZone} ${isOver ? styles.dropZoneHighlight : ""}`}
              onDragOver={(e) => handleDragOver(e, status)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, status)}
            >
              {apps.length === 0 ? (
                <div className={styles.emptyColumn}>
                  <div className={styles.emptyIcon}>{isOver ? "📥" : "📭"}</div>
                  <div className={styles.emptyText}>
                    {isOver ? "Release to drop here" : "Drop applications here"}
                  </div>
                </div>
              ) : (
                apps.map((app) => (
                  <div
                    key={app._id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app)}
                    onDragEnd={handleDragEnd}
                  >
                    <ApplicationCard
                      application={app}
                      onEdit={onEdit}
                      onDelete={onDelete}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
