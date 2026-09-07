"use client";
import { useMyInvitations } from "@features/team/api/team.api";
import MyInvitationsTab from "@features/team/components/MyInvitationsTab";
import TeamMembersTab from "@features/team/components/TeamMembersTab";
import { Badge } from "@shared/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@shared/components/ui/tabs";
import { useAuthStore } from "@shared/stores/authStore";
import { useTranslation } from "react-i18next";

export default function TeamPageContent() {
  const { t } = useTranslation();
  const { data: myInvitations } = useMyInvitations();
  const hasCompany = !!useAuthStore((state) => state.user)?.companyId;

  return (
    <div className="mx-auto w-full max-w-4xl p-6 md:p-8">
      <div className="mb-6 space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("team.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("team.description")}</p>
      </div>

      <Tabs defaultValue={hasCompany ? "members" : "invitations"}>
        <TabsList>
          {hasCompany && <TabsTrigger value="members">{t("team.tabs.members")}</TabsTrigger>}
          <TabsTrigger value="invitations" className="gap-1.5">
            {t("team.tabs.invitations")}
            {!!myInvitations?.length && <Badge variant="secondary">{myInvitations.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {hasCompany && (
          <TabsContent value="members">
            <TeamMembersTab />
          </TabsContent>
        )}
        <TabsContent value="invitations">
          <MyInvitationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
