import RecentLeadsBoard from "@features/lead/components/RecentLeadsBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  return (
    <div className="space-y-4 p-6 md:p-8">
      <RecentLeadsBoard />
    </div>
  );
}
