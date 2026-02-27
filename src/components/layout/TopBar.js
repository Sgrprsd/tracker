"use client";

import styles from "./TopBar.module.css";

export default function TopBar({
  title,
  subtitle,
  searchValue,
  onSearchChange,
  onAddClick,
  addLabel,
}) {
  return (
    <header className={styles.topbar}>
      <div className={styles.topbarLeft}>
        <div>
          <h1 className={styles.pageTitle}>{title}</h1>
          {subtitle && <p className={styles.pageSubtitle}>{subtitle}</p>}
        </div>
      </div>

      {onSearchChange && (
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search company or position…"
            className={styles.searchInput}
            value={searchValue || ""}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      <div className={styles.topbarRight}>
        {onAddClick && (
          <button className={styles.addBtn} onClick={onAddClick}>
            + <span className={styles.addBtnLabel}>{addLabel || "Add"}</span>
          </button>
        )}
      </div>
    </header>
  );
}
