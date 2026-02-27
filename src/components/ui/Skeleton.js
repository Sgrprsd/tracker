import styles from "./Skeleton.module.css";

export function SkeletonText({ width }) {
  return (
    <div
      className={styles.skeletonText}
      style={width ? { width } : undefined}
    />
  );
}

export function SkeletonTitle({ width }) {
  return (
    <div
      className={styles.skeletonTitle}
      style={width ? { width } : undefined}
    />
  );
}

export function SkeletonCard() {
  return <div className={styles.skeletonCard} />;
}

export function KanbanSkeleton() {
  return (
    <div className={styles.kanbanSkeleton}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.columnSkeleton}>
          <div className={styles.columnHeaderSkeleton} />
          <div className={styles.skeletonCard} />
          {i % 2 === 0 && <div className={styles.skeletonCard} />}
        </div>
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className={styles.dashSkeleton}>
      <div className={styles.statsRowSkeleton}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className={styles.skeletonStatCard} />
        ))}
      </div>
      <div className={styles.chartsRowSkeleton}>
        <div className={styles.skeletonChart} />
        <div className={styles.skeletonChart} />
      </div>
      <div className={styles.skeletonCard} />
    </div>
  );
}
