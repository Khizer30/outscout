import UserSettingsPageContent from "@features/user/components/UserSettingsPageContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings"
};

export default function SettingsPage() {
  return <UserSettingsPageContent />;
}
