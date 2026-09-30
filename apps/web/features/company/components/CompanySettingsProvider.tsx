"use client";
import { useRefresh } from "@features/auth/api/auth.api";
import { useUpdateCompany, useUpdateCompanyEmailSettings, useUpdateCompanyMessageRules } from "@features/company/api/company.api";
import { COMPANY_IMAGE_FOLDER, useDeleteImage, useUploadImage } from "@features/media/api/media.api";
import { zodResolver } from "@hookform/resolvers/zod";
import type { CompanySettingsResponseSchema } from "@repo/dtos/company";
import { getErrorMessage } from "@shared/lib/error";
import { useAuthStore } from "@shared/stores/authStore";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import type { FieldErrors, UseFormHandleSubmit, UseFormRegister, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { z } from "zod";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const CompanySettingsFormSchema = z
  .object({
    name: z.string().trim().min(1, "VALIDATION_COMPANY_NAME_REQUIRED").max(100, "VALIDATION_COMPANY_NAME_TOO_LONG"),
    about: z.string().trim().max(1000, "VALIDATION_COMPANY_ABOUT_TOO_LONG"),
    companyImageURL: z.string().trim(),
    fromEmail: z.string().trim(),
    brevoApiKey: z.string().trim(),
    emailSignature: z.string().trim().max(2000, "VALIDATION_EMAIL_SIGNATURE_TOO_LONG"),
    primaryColor: z.string().trim().max(20, "VALIDATION_PRIMARY_COLOR_TOO_LONG"),
    secondaryColor: z.string().trim().max(20, "VALIDATION_SECONDARY_COLOR_TOO_LONG"),
    whatsappRules: z.string().trim().max(2000, "VALIDATION_RULES_TOO_LONG"),
    whatsappGreeting: z.string().trim().max(500, "VALIDATION_GREETING_TOO_LONG"),
    emailRules: z.string().trim().max(2000, "VALIDATION_RULES_TOO_LONG"),
    emailGreeting: z.string().trim().max(500, "VALIDATION_GREETING_TOO_LONG")
  })
  .superRefine((val, ctx) => {
    if (val.fromEmail && !z.email().safeParse(val.fromEmail).success) {
      ctx.addIssue({ code: "custom", path: ["fromEmail"], message: "VALIDATION_EMAIL_INVALID" });
    }
  });

export type CompanySettingsFormValues = z.infer<typeof CompanySettingsFormSchema>;
export type CompanySettingsData = z.infer<typeof CompanySettingsResponseSchema>["data"];

interface CompanySettingsContextValue {
  settings: CompanySettingsData;
  register: UseFormRegister<CompanySettingsFormValues>;
  errors: FieldErrors<CompanySettingsFormValues>;
  watch: UseFormWatch<CompanySettingsFormValues>;
  setValue: UseFormSetValue<CompanySettingsFormValues>;
  handleSubmit: UseFormHandleSubmit<CompanySettingsFormValues>;
  onSubmit: (values: CompanySettingsFormValues) => Promise<void>;
  saving: boolean;
  uploading: boolean;
  companyImageURL: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handlePickFile: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveImage: () => void;
}

const CompanySettingsContext = createContext<CompanySettingsContextValue | null>(null);

export function useCompanySettingsContext() {
  const ctx = useContext(CompanySettingsContext);
  if (!ctx) {
    throw new Error("useCompanySettingsContext must be used within a CompanySettingsProvider");
  }
  return ctx;
}

interface CompanySettingsProviderProps {
  settings: CompanySettingsData;
  children: React.ReactNode;
}

export function CompanySettingsProvider({ settings, children }: CompanySettingsProviderProps) {
  const { t } = useTranslation();
  const updateCompany = useUpdateCompany();
  const updateEmailSettings = useUpdateCompanyEmailSettings();
  const updateMessageRules = useUpdateCompanyMessageRules();
  const uploadImage = useUploadImage(COMPANY_IMAGE_FOLDER);
  const deleteImage = useDeleteImage();
  const refresh = useRefresh();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingUpload, setPendingUpload] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CompanySettingsFormValues>({
    resolver: zodResolver(CompanySettingsFormSchema),
    defaultValues: buildDefaultValues(settings)
  });

  useEffect(() => {
    reset(buildDefaultValues(settings));
    setPendingUpload(null);
  }, [settings, reset]);

  const companyImageURL = watch("companyImageURL");

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(t("companySettings.details.invalidImage"));
      return;
    }

    if (file.size > MAX_IMAGE_BYTES) {
      toast.error(t("companySettings.details.imageTooLarge"));
      return;
    }

    const previous = pendingUpload;

    uploadImage.mutate(file, {
      onSuccess: (url) => {
        if (previous) {
          deleteImage.mutate(previous);
        }
        setPendingUpload(url);
        setValue("companyImageURL", url, { shouldDirty: true });
      },
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  const handleRemoveImage = () => {
    if (pendingUpload && companyImageURL === pendingUpload) {
      deleteImage.mutate(pendingUpload);
    }
    setPendingUpload(null);
    setValue("companyImageURL", "", { shouldDirty: true });
  };

  const onSubmit = async (values: CompanySettingsFormValues) => {
    const { company, emailSettings, messageRules } = settings;

    const companyPayload: { name?: string; about?: string | null; companyImageURL?: string | null } = {};
    if (values.name !== company.name) {
      companyPayload.name = values.name;
    }
    const nextAbout = values.about;
    if (nextAbout !== (company.about ?? "")) {
      companyPayload.about = nextAbout === "" ? null : nextAbout;
    }
    const nextImage = values.companyImageURL;
    if (nextImage !== (company.companyImageURL ?? "")) {
      companyPayload.companyImageURL = nextImage === "" ? null : nextImage;
    }

    const emailPayload: {
      brevoApiKey?: string;
      fromEmail?: string | null;
      emailSignature?: string | null;
      primaryColor?: string | null;
      secondaryColor?: string | null;
    } = {};
    if (values.fromEmail !== (emailSettings.fromEmail ?? "")) {
      emailPayload.fromEmail = values.fromEmail === "" ? null : values.fromEmail;
    }
    if (values.emailSignature !== (emailSettings.emailSignature ?? "")) {
      emailPayload.emailSignature = values.emailSignature === "" ? null : values.emailSignature;
    }
    if (values.primaryColor !== (emailSettings.primaryColor ?? "")) {
      emailPayload.primaryColor = values.primaryColor === "" ? null : values.primaryColor;
    }
    if (values.secondaryColor !== (emailSettings.secondaryColor ?? "")) {
      emailPayload.secondaryColor = values.secondaryColor === "" ? null : values.secondaryColor;
    }
    if (values.brevoApiKey !== "") {
      emailPayload.brevoApiKey = values.brevoApiKey;
    }

    const whatsappRules = messageRules.WHATSAPP;
    const whatsappPayload: { rules?: string | null; greeting?: string | null } = {};
    if (values.whatsappRules !== (whatsappRules?.rules ?? "")) {
      whatsappPayload.rules = values.whatsappRules === "" ? null : values.whatsappRules;
    }
    if (values.whatsappGreeting !== (whatsappRules?.greeting ?? "")) {
      whatsappPayload.greeting = values.whatsappGreeting === "" ? null : values.whatsappGreeting;
    }

    const emailRules = messageRules.EMAIL;
    const emailRulesPayload: { rules?: string | null; greeting?: string | null } = {};
    if (values.emailRules !== (emailRules?.rules ?? "")) {
      emailRulesPayload.rules = values.emailRules === "" ? null : values.emailRules;
    }
    if (values.emailGreeting !== (emailRules?.greeting ?? "")) {
      emailRulesPayload.greeting = values.emailGreeting === "" ? null : values.emailGreeting;
    }

    const tasks: Promise<unknown>[] = [];
    if (Object.keys(companyPayload).length > 0) {
      tasks.push(updateCompany.mutateAsync(companyPayload));
    }
    if (Object.keys(emailPayload).length > 0) {
      tasks.push(updateEmailSettings.mutateAsync(emailPayload));
    }
    if (Object.keys(whatsappPayload).length > 0) {
      tasks.push(updateMessageRules.mutateAsync({ channel: "WHATSAPP", ...whatsappPayload }));
    }
    if (Object.keys(emailRulesPayload).length > 0) {
      tasks.push(updateMessageRules.mutateAsync({ channel: "EMAIL", ...emailRulesPayload }));
    }

    if (tasks.length === 0) {
      toast.success(t("companySettings.success"));
      return;
    }

    const results = await Promise.allSettled(tasks);
    const rejected = results.find((result): result is PromiseRejectedResult => result.status === "rejected");

    if (rejected) {
      toast.error(getErrorMessage(rejected.reason));
      return;
    }

    toast.success(t("companySettings.success"));
    setPendingUpload(null);

    if (companyPayload.name !== undefined) {
      refresh.mutate(undefined, {
        onSuccess: (res) => useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken)
      });
    }
  };

  const saving = updateCompany.isPending || updateEmailSettings.isPending || updateMessageRules.isPending;
  const uploading = uploadImage.isPending;

  const value: CompanySettingsContextValue = {
    settings,
    register,
    errors,
    watch,
    setValue,
    handleSubmit,
    onSubmit,
    saving,
    uploading,
    companyImageURL,
    fileInputRef,
    handlePickFile,
    handleFileChange,
    handleRemoveImage
  };

  return <CompanySettingsContext.Provider value={value}>{children}</CompanySettingsContext.Provider>;
}

function buildDefaultValues(settings: CompanySettingsData): CompanySettingsFormValues {
  return {
    name: settings.company.name,
    about: settings.company.about ?? "",
    companyImageURL: settings.company.companyImageURL ?? "",
    fromEmail: settings.emailSettings.fromEmail ?? "",
    brevoApiKey: "",
    emailSignature: settings.emailSettings.emailSignature ?? "",
    primaryColor: settings.emailSettings.primaryColor ?? "",
    secondaryColor: settings.emailSettings.secondaryColor ?? "",
    whatsappRules: settings.messageRules.WHATSAPP?.rules ?? "",
    whatsappGreeting: settings.messageRules.WHATSAPP?.greeting ?? "",
    emailRules: settings.messageRules.EMAIL?.rules ?? "",
    emailGreeting: settings.messageRules.EMAIL?.greeting ?? ""
  };
}
