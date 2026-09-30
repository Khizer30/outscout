import RecentLeadsBoard from "@features/lead/components/RecentLeadsBoard";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard"
};

export default function DashboardPage() {
  return <RecentLeadsBoard />;
}
