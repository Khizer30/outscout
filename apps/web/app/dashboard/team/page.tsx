import TeamPageContent from "@features/team/components/TeamPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Team"
};

export default function TeamPage() {
  return <TeamPageContent />;
}
