"use client";

import TopBar from "@/components/layout/TopBar";
import FollowUpsContent from "@/components/follow-ups/FollowUpsContent";

export default function FollowUpsPage() {
  return (
    <>
      <TopBar title="Follow-ups" subtitle="Stay on top of your applications" />
      <div style={{ padding: "var(--space-6)" }}>
        <FollowUpsContent />
      </div>
    </>
  );
}
