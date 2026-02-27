"use client";

import Sidebar from "@/components/layout/Sidebar";
import styles from "./dashboard.module.css";

export default function DashboardLayout({ children }) {
  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />
      <div className={styles.mainArea}>{children}</div>
    </div>
  );
}
