"use client";
import { useSwitchCompany } from "@features/auth/api/auth.api";
import { useMyCompanies } from "@features/company/api/company.api";
import CreateCompanyDialog from "@features/company/components/CreateCompanyDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@shared/components/ui/dropdown-menu";
import { getErrorMessage } from "@shared/lib/error";
import { cn } from "@shared/lib/utils";
import { useAuthStore } from "@shared/stores/authStore";
import { Building2, ChevronsUpDown, Plus } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";

interface CompanySwitcherProps {
  collapsed: boolean;
}

export default function CompanySwitcher({ collapsed }: CompanySwitcherProps) {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);
  const { data: companies } = useMyCompanies();
  const switchCompany = useSwitchCompany();
  const [createOpen, setCreateOpen] = useState(false);

  const handleSwitch = (membershipId: string, companyId: string, companyName: string) => {
    if (companyId === user?.companyId) {
      return;
    }

    switchCompany.mutate(
      { membershipId },
      {
        onSuccess: (res) => {
          useAuthStore.getState().setCredentials(res.data.user, res.data.accessToken);
          toast.success(t("companySwitcher.switchSuccess", { company: companyName }));
        },
        onError: (error) => toast.error(getErrorMessage(error))
      }
    );
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              title={collapsed ? t("companySwitcher.selectCompany") : undefined}
              className={cn(
                "flex h-10 w-full items-center gap-3 rounded-md px-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                collapsed && "justify-center"
              )}
            />
          }
        >
          <Building2 className="size-5 shrink-0" />
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1 truncate text-start">{user?.companyName ?? t("companySwitcher.selectCompany")}</span>
              <ChevronsUpDown className="size-4 shrink-0" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel>{t("companySwitcher.yourCompanies")}</DropdownMenuLabel>
          {companies?.map(({ company, membership }) => (
            <DropdownMenuItem
              key={membership.id}
              data-active={company.id === user?.companyId}
              className="data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
              onClick={() => handleSwitch(membership.id, company.id, company.name)}
            >
              <span className="truncate">{company.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setCreateOpen(true)}>
            <Plus className="size-4" />
            {t("companySwitcher.createCompany")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateCompanyDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
