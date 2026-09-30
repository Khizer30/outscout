import LeadsPageContent from "@features/lead/components/LeadsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leads"
};

export default function LeadsPage() {
  return <LeadsPageContent />;
}
