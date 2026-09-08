"use client";
import { useCreateCompany } from "@features/company/api/company.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateCompanySchema } from "@repo/dtos/company";
import { Button } from "@shared/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@shared/components/ui/dialog";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type CreateCompanyFormValues = z.infer<typeof CreateCompanySchema>;

interface CreateCompanyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCompanyDialog({ open, onOpenChange }: CreateCompanyDialogProps) {
  const { t } = useTranslation();
  const createCompany = useCreateCompany();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateCompanyFormValues>({
    resolver: zodResolver(CreateCompanySchema),
    defaultValues: { name: "" }
  });

  const onSubmit = (values: CreateCompanyFormValues) => {
    createCompany.mutate(values, {
      onSuccess: () => {
        toast.success(t("companySwitcher.createDialog.success"));
        reset();
        onOpenChange(false);
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("companySwitcher.createDialog.title")}</DialogTitle>
          <DialogDescription>{t("companySwitcher.createDialog.description")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          <div className="space-y-1.5">
            <Label htmlFor="company-name">{t("companySwitcher.createDialog.name")}</Label>
            <Input
              id="company-name"
              autoComplete="organization"
              placeholder={t("companySwitcher.createDialog.namePlaceholder")}
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <p className="min-h-4 text-xs text-destructive">{errors.name?.message && t(`errors:${errors.name.message}`)}</p>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <DialogClose render={<Button type="button" variant="outline" />}>{t("common.cancel")}</DialogClose>
            <Button type="submit" disabled={createCompany.isPending}>
              {createCompany.isPending && <Loader2 className="size-4 animate-spin" />}
              {createCompany.isPending ? t("companySwitcher.createDialog.submitting") : t("companySwitcher.createDialog.submit")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
