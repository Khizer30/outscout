import CompanySettingsPageContent from "@features/company/components/CompanySettingsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Company"
};

export default function CompanyPage() {
  return <CompanySettingsPageContent />;
}
