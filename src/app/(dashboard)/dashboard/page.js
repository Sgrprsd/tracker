"use client";

import TopBar from "@/components/layout/TopBar";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default function DashboardPage() {
  return (
    <>
      <TopBar title="Dashboard" subtitle="Overview of your job search" />
      <div style={{ padding: "var(--space-6)" }}>
        <DashboardContent />
      </div>
    </>
  );
}
