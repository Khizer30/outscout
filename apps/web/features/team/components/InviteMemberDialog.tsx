"use client";
import { useInviteUser } from "@features/team/api/team.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { InviteUserSchema } from "@repo/dtos/team";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { Loader2, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type InviteFormValues = z.infer<typeof InviteUserSchema>;

export default function InviteMemberDialog() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const inviteUser = useInviteUser();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<InviteFormValues>({
    resolver: zodResolver(InviteUserSchema),
    defaultValues: { email: "" }
  });

  const onSubmit = (values: InviteFormValues) => {
    inviteUser.mutate(values, {
      onSuccess: () => {
        toast.success(t("team.inviteDialog.success"));
        reset();
        setOpen(false);
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <UserPlus className="size-4" />
            {t("team.invite")}
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("team.inviteDialog.title")}</DialogTitle>
          <DialogDescription>{t("team.inviteDialog.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="invite-email">{t("team.inviteDialog.email")}</Label>
            <Input
              id="invite-email"
              type="email"
              autoComplete="email"
              placeholder={t("team.inviteDialog.emailPlaceholder")}
              aria-invalid={!!errors.email}
              {...register("email")}
            />
            <p className="min-h-4 text-xs text-destructive">{errors.email?.message && t(`errors:${errors.email.message}`)}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose render={<Button type="button" variant="outline" />}>{t("common.cancel")}</DialogClose>
            <Button type="submit" disabled={inviteUser.isPending}>
              {inviteUser.isPending && <Loader2 className="size-4 animate-spin" />}
              {inviteUser.isPending ? t("team.inviteDialog.submitting") : t("team.inviteDialog.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
