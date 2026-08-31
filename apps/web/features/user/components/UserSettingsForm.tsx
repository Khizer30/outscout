"use client";
import { useRefresh } from "@features/auth/api/auth.api";
import { useDeleteImage, useUploadImage } from "@features/media/api/media.api";
import { useGetMe, useUpdateMe } from "@features/user/api/user.api";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@shared/components/ui/button";
import { Input } from "@shared/components/ui/input";
import { Label } from "@shared/components/ui/label";
import { getErrorMessage } from "@shared/lib/error";
import i18n from "@shared/lib/i18n";
import { Loader2, Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

const SettingsFormSchema = z
  .object({
    name: z.string().trim().min(1, { error: "VALIDATION_NAME_REQUIRED" }),
    profileImageURL: z.string().trim(),
    language: z.enum(["EN", "AR"]),
    password: z.string()
  })
  .superRefine((val, ctx) => {
    const pw = val.password;
    if (pw.length === 0) {
      return;
    }
    if (pw.length < 8) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "VALIDATION_PASSWORD_MIN_LENGTH" });
    }
    if (!/[a-z]/.test(pw)) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "VALIDATION_PASSWORD_LOWERCASE_REQUIRED" });
    }
    if (!/[A-Z]/.test(pw)) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "VALIDATION_PASSWORD_UPPERCASE_REQUIRED" });
    }
    if (!/[0-9]/.test(pw)) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "VALIDATION_PASSWORD_DIGIT_REQUIRED" });
    }
    if (!/[^a-zA-Z0-9]/.test(pw)) {
      ctx.addIssue({ code: "custom", path: ["password"], message: "VALIDATION_PASSWORD_SPECIAL_CHAR_REQUIRED" });
    }
  });

type SettingsFormValues = z.infer<typeof SettingsFormSchema>;

export default function UserSettingsForm() {
  const { t } = useTranslation();
  const { data: user, isLoading } = useGetMe();
  const updateMe = useUpdateMe();
  const refresh = useRefresh();
  const uploadImage = useUploadImage();
  const deleteImage = useDeleteImage();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitted }
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: { name: "", profileImageURL: "", language: "EN", password: "" }
  });

  const profileImageURL = watch("profileImageURL");

  useEffect(() => {
    if (user) {
      reset({ name: user.name, profileImageURL: user.profileImageURL ?? "", language: user.language, password: "" });
      setPendingUpload(null);
    }
  }, [user, reset]);

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("settings.invalidImage"));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(t("settings.imageTooLarge"));
      return;
    }

    const previous = pendingUpload;

    uploadImage.mutate(file, {
      onSuccess: (url) => {
        if (previous) {
          deleteImage.mutate(previous);
        }
        setPendingUpload(url);
        setValue("profileImageURL", url, { shouldDirty: true });
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  const handleRemoveImage = () => {
    if (pendingUpload && profileImageURL === pendingUpload) {
      deleteImage.mutate(pendingUpload);
    }
    setPendingUpload(null);
    setValue("profileImageURL", "", { shouldDirty: true });
  };

  const onSubmit = (values: SettingsFormValues) => {
    if (!user) {
      return;
    }

    const payload: Parameters<typeof updateMe.mutate>[0] = {};

    if (values.name !== user.name) {
      payload.name = values.name;
    }
    if (values.language !== user.language) {
      payload.language = values.language;
    }

    const nextImage = values.profileImageURL.trim();
    if (nextImage !== (user.profileImageURL ?? "")) {
      payload.profileImageURL = nextImage === "" ? null : nextImage;
    }

    if (values.password) {
      payload.password = values.password;
    }

    if (Object.keys(payload).length === 0) {
      toast.success(t("settings.success"));
      return;
    }

    updateMe.mutate(payload, {
      onSuccess: (updated) => {
        toast.success(t("settings.success"));
        refresh.mutate();

        const nextLng = updated.language.toLowerCase();
        if (i18n.resolvedLanguage !== nextLng) {
          i18n.changeLanguage(nextLng);
        }

        setPendingUpload(null);
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  if (isLoading || !user) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const uploading = uploadImage.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
      <div className="flex items-center gap-4">
        <div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-medium text-primary">
          {profileImageURL ? (
            <Image src={profileImageURL} alt={user.name} fill sizes="80px" unoptimized className="object-cover" />
          ) : (
            (user.name.charAt(0).toUpperCase() ?? "?")
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
              <Loader2 className="size-5 animate-spin text-white" />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handlePickFile} disabled={uploading}>
              <Upload className="size-4" />
              {t("settings.uploadImage")}
            </Button>
            {profileImageURL && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveImage}
                disabled={uploading}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="size-4" />
                {t("settings.removeImage")}
              </Button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{t("settings.imageHint")}</p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settings-name">{t("settings.name")}</Label>
        <Input id="settings-name" type="text" aria-invalid={!!errors.name} {...register("name")} />
        <p className="min-h-4 text-xs text-destructive">{errors.name?.message && t(`errors:${errors.name.message}`)}</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settings-email">{t("settings.email")}</Label>
        <Input id="settings-email" type="email" value={user.email} disabled readOnly />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settings-language">{t("settings.language")}</Label>
        <select
          id="settings-language"
          className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
          {...register("language")}
        >
          <option value="EN">{t("navbar.english")}</option>
          <option value="AR">{t("navbar.arabic")}</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="settings-password">{t("settings.newPassword")}</Label>
        <Input
          id="settings-password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          aria-invalid={!!(isSubmitted && errors.password)}
          {...register("password")}
        />
        <p className="min-h-4 text-xs text-destructive">
          {errors.password?.message ? t(`errors:${errors.password.message}`) : <span className="text-muted-foreground">{t("settings.newPasswordHint")}</span>}
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" disabled={updateMe.isPending || uploading}>
          {updateMe.isPending ? t("settings.saving") : t("settings.save")}
        </Button>
      </div>
    </form>
  );
}
