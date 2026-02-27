"use client";

import TopBar from "@/components/layout/TopBar";

export default function SettingsPage() {
  return (
    <>
      <TopBar title="Settings" subtitle="Account & preferences" />
      <div
        style={{
          padding: "var(--space-6)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          color: "var(--text-muted)",
          fontSize: "var(--text-lg)",
        }}
      >
        ⚙️ Settings coming soon
      </div>
    </>
  );
}
