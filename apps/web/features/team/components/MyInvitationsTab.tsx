"use client";
import { useRefresh } from "@features/auth/api/auth.api";
import { useAcceptMyInvitation, useMyInvitations, useRejectMyInvitation } from "@features/team/api/team.api";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent } from "@shared/components/ui/card";
import { getErrorMessage } from "@shared/lib/error";
import { useAuthStore } from "@shared/stores/authStore";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

export default function MyInvitationsTab() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const { data: invitations, isLoading } = useMyInvitations();
  const acceptInvitation = useAcceptMyInvitation();
  const rejectInvitation = useRejectMyInvitation();
  const refresh = useRefresh();

  const formatDate = (value: Date) => new Date(value).toLocaleDateString(i18n.language, { year: "numeric", month: "short", day: "numeric" });

  const handleAccept = (id: string, companyName: string) => {
    acceptInvitation.mutate(id, {
      onSuccess: () => {
        toast.success(t("team.myInvitations.acceptSuccess", { company: companyName }));
        refresh.mutate(undefined, {
          onSuccess: (res) => {
            useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
            void queryClient.invalidateQueries({ queryKey: ["team", "members"] });
          }
        });
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  const handleReject = (id: string) => {
    rejectInvitation.mutate(id, {
      onSuccess: () => toast.success(t("team.myInvitations.rejectSuccess")),
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <Card>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">{t("team.myInvitations.empty")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {invitations.map((invitation) => (
        <Card key={invitation.id}>
          <CardContent className="flex flex-row flex-wrap items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{invitation.companyName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {invitation.invitedBy ? t("team.myInvitations.invitedBy", { name: invitation.invitedBy.name }) : invitation.email}
              </p>
              <p className="text-xs text-muted-foreground">{t("team.pendingInvitations.expires", { date: formatDate(invitation.expiresAt) })}</p>
            </div>

            <div className="flex shrink-0 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={rejectInvitation.isPending || acceptInvitation.isPending}
                onClick={() => handleReject(invitation.id)}
              >
                {t("team.myInvitations.reject")}
              </Button>
              <Button
                type="button"
                size="sm"
                disabled={acceptInvitation.isPending || rejectInvitation.isPending}
                onClick={() => handleAccept(invitation.id, invitation.companyName)}
              >
                {t("team.myInvitations.accept")}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
