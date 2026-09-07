"use client";
import { useListInvitations, useRevokeInvitation, useTeamMembers } from "@features/team/api/team.api";
import InviteMemberDialog from "@features/team/components/InviteMemberDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@shared/components/ui/avatar";
import { Badge } from "@shared/components/ui/badge";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/components/ui/table";
import { getErrorMessage } from "@shared/lib/error";
import { useAuthStore } from "@shared/stores/authStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

const PENDING_STATUS = ["PENDING"] as const;

export default function TeamMembersTab() {
  const { t, i18n } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.companyRole === "COMPANY_ADMIN";

  const { data: members, isLoading: membersLoading } = useTeamMembers();
  const { data: pendingInvitations, isLoading: invitationsLoading } = useListInvitations([...PENDING_STATUS]);
  const revokeInvitation = useRevokeInvitation();

  const formatDate = (value: Date) => new Date(value).toLocaleDateString(i18n.language, { year: "numeric", month: "short", day: "numeric" });

  const handleRevoke = (id: string) => {
    revokeInvitation.mutate(id, {
      onSuccess: () => toast.success(t("team.pendingInvitations.revokeSuccess")),
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">{isAdmin && <InviteMemberDialog />}</div>

      <Card>
        <CardHeader>
          <CardTitle>{t("team.tabs.members")}</CardTitle>
        </CardHeader>
        <CardContent>
          {membersLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : members && members.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("team.members.headerMember")}</TableHead>
                  <TableHead>{t("team.members.headerRole")}</TableHead>
                  <TableHead>{t("team.members.headerJoined")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={member.profileImage ?? undefined} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="truncate text-sm font-medium text-foreground">{member.name}</p>
                            {member.userId === user?.id && (
                              <Badge variant="secondary" className="shrink-0">
                                {t("team.members.you")}
                              </Badge>
                            )}
                          </div>
                          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={member.role === "COMPANY_ADMIN" ? "default" : "outline"}>
                        {member.role === "COMPANY_ADMIN" ? t("team.members.roleAdmin") : t("team.members.roleUser")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatDate(member.joinedAt)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("team.members.empty")}</p>
          )}
        </CardContent>
      </Card>

      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle>{t("team.pendingInvitations.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            {invitationsLoading ? (
              <div className="flex h-24 items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              </div>
            ) : pendingInvitations && pendingInvitations.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("team.inviteDialog.email")}</TableHead>
                    <TableHead />
                    <TableHead />
                    <TableHead className="text-end">{t("team.pendingInvitations.headerActions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingInvitations.map((invitation) => (
                    <TableRow key={invitation.id}>
                      <TableCell className="font-medium text-foreground">{invitation.email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {invitation.invitedBy && t("team.pendingInvitations.invitedBy", { name: invitation.invitedBy.name })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {t("team.pendingInvitations.expires", { date: formatDate(invitation.expiresAt) })}
                      </TableCell>
                      <TableCell className="text-end">
                        <Button type="button" variant="destructive" size="sm" disabled={revokeInvitation.isPending} onClick={() => handleRevoke(invitation.id)}>
                          {t("team.pendingInvitations.revoke")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="py-6 text-center text-sm text-muted-foreground">{t("team.pendingInvitations.empty")}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
