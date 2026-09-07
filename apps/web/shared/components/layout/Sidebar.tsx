"use client";
import { useLogout } from "@features/auth/api/auth.api";
import iconDark from "@shared/assets/images/icon_dark.webp";
import iconLight from "@shared/assets/images/icon_light.webp";
import logoDark from "@shared/assets/images/logo_dark.webp";
import logoLight from "@shared/assets/images/logo_light.webp";
import AppearanceControls from "@shared/components/layout/AppearanceControls";
import { Button } from "@shared/components/ui/button";
import { ROUTES } from "@shared/lib/routes";
import { cn } from "@shared/lib/utils";
import { useAuthStore } from "@shared/stores/authStore";
import { ChevronLeft, LayoutDashboard, LogOut, Users, Building2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const NAV_LINKS = [
  { href: ROUTES.dashboard, labelKey: "sidebar.dashboard", icon: LayoutDashboard },
  { href: ROUTES.company, labelKey: "sidebar.company", icon: Building2 },
  { href: ROUTES.team, labelKey: "sidebar.team", icon: Users }
] as const;

const EXPANDED_WIDTH = 256;
const COLLAPSED_WIDTH = 76;
const STORAGE_KEY = "sidebarCollapsed";

export default function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(STORAGE_KEY) === "true");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      return next;
    });
  };

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSettled: () => {
        useAuthStore.getState().logout();
        router.replace(ROUTES.auth.login);
      }
    });
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="sticky top-0 flex h-screen shrink-0 flex-col border-e border-border bg-card"
    >
      <button
        type="button"
        onClick={toggleCollapsed}
        aria-label="Toggle sidebar"
        className="absolute -inset-e-3 top-9 z-10 flex size-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-xs transition-colors hover:text-foreground"
      >
        <motion.span animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.25 }} className="flex">
          <ChevronLeft className="size-4" />
        </motion.span>
      </button>

      <div className="flex h-20 items-center px-4">
        <Link href={ROUTES.dashboard} className="flex items-center overflow-hidden">
          {collapsed ? (
            <>
              <Image src={iconDark} alt="Outscout" className="size-9 dark:hidden" draggable={false} priority />
              <Image src={iconLight} alt="Outscout" className="hidden size-9 dark:block" draggable={false} priority />
            </>
          ) : (
            <>
              <Image src={logoDark} alt="Outscout" className="h-11 w-auto dark:hidden" draggable={false} priority />
              <Image src={logoLight} alt="Outscout" className="hidden h-11 w-auto dark:block" draggable={false} priority />
            </>
          )}
        </Link>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_LINKS.map((link) => {
          const active = pathname === link.href;
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              title={collapsed ? t(link.labelKey) : undefined}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-2.5 text-sm font-medium transition-colors",
                collapsed && "justify-center",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="size-5 shrink-0" />
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden whitespace-nowrap"
                  >
                    {t(link.labelKey)}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-border p-3">
        <div className={cn("flex", collapsed ? "justify-center" : "justify-start")}>
          <AppearanceControls className={cn(collapsed && "flex-col")} />
        </div>

        <Link
          href={ROUTES.settings}
          title={collapsed ? user?.name : undefined}
          className={cn(
            "flex w-full items-center gap-3 rounded-md px-1 py-1.5 text-start transition-colors hover:bg-muted",
            pathname === ROUTES.settings && "bg-muted",
            collapsed && "justify-center"
          )}
        >
          {user?.profileImage ? (
            <Image src={user.profileImage} alt={user.name} width={36} height={36} unoptimized className="size-9 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">
              {user?.name?.charAt(0).toUpperCase() ?? "?"}
            </div>
          )}

          <AnimatePresence initial={false}>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="min-w-0 flex-1 overflow-hidden"
              >
                <p className="truncate text-sm font-medium text-foreground">{user?.name}</p>
                {user?.companyName && <p className="truncate text-xs text-muted-foreground">{user.companyName}</p>}
              </motion.div>
            )}
          </AnimatePresence>
        </Link>

        <Button
          variant="ghost"
          onClick={handleLogout}
          disabled={logout.isPending}
          title={collapsed ? t("sidebar.logout") : undefined}
          className={cn("w-full gap-3 text-muted-foreground hover:text-foreground", collapsed ? "justify-center" : "justify-start")}
        >
          <LogOut className="size-5 shrink-0" />
          {!collapsed && <span className="whitespace-nowrap">{t("sidebar.logout")}</span>}
        </Button>
      </div>
    </motion.aside>
  );
}
