"use client";
import { useSwitchCompany } from "@features/auth/api/auth.api";
import { useMyCompanies } from "@features/company/api/company.api";
import CreateCompanyDialog from "@features/company/components/CreateCompanyDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@shared/components/ui/dropdown-menu";
import { getErrorMessage } from "@shared/lib/error";
import { cn } from "@shared/lib/utils";
import { useAuthStore } from "@shared/stores/authStore";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import Image from "next/image";
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
        <DropdownMenuContent align="start" className="w-72 p-1.5">
          <DropdownMenuGroup>
            <DropdownMenuLabel className="px-2 py-1.5 text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {t("companySwitcher.yourCompanies")}
            </DropdownMenuLabel>
            {companies?.map(({ company, membership }) => {
              const isActive = company.id === user?.companyId;
              return (
                <DropdownMenuItem
                  key={membership.id}
                  data-active={isActive}
                  className="gap-2.5 rounded-lg py-2 data-[active=true]:bg-primary/10"
                  onClick={() => handleSwitch(membership.id, company.id, company.name)}
                >
                  <span className="relative flex size-7 shrink-0 items-center justify-center overflow-hidden rounded-md bg-primary/10 text-xs font-semibold text-primary!">
                    {company.companyImageURL ? (
                      <Image src={company.companyImageURL} alt={company.name} fill sizes="28px" unoptimized className="object-cover" />
                    ) : (
                      company.name.charAt(0).toUpperCase()
                    )}
                  </span>
                  <span className="min-w-0 flex-1 truncate font-medium">{company.name}</span>
                  {isActive && <Check className="size-4 shrink-0 text-primary!" />}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
          <DropdownMenuSeparator className="my-1.5" />
          <DropdownMenuItem className="gap-2.5 rounded-lg py-2 font-medium text-primary! focus:**:text-primary!" onClick={() => setCreateOpen(true)}>
            <span className="flex size-7 shrink-0 items-center justify-center rounded-md border border-dashed border-primary/40">
              <Plus className="size-4" />
            </span>
            {t("companySwitcher.createCompany")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <CreateCompanyDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  );
}
