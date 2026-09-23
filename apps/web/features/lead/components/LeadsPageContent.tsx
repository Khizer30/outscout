"use client";
import { useUpdateLead } from "@features/lead/api/lead.api";
import EditLeadDialog from "@features/lead/components/EditLeadDialog";
import { LeadsProvider, useLeadsContext } from "@features/lead/components/LeadsProvider";
import { formatSocialLink, SOCIAL_PLATFORMS, STATUS_CHIP_CLASSES, STATUS_ICONS } from "@features/lead/lib/leadDisplay";
import { LeadStatusSchema } from "@repo/dtos/lead";
import { Button } from "@shared/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@shared/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@shared/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@shared/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@shared/components/ui/table";
import { Tooltip, TooltipContent, TooltipTrigger } from "@shared/components/ui/tooltip";
import { getErrorMessage } from "@shared/lib/error";
import { cn } from "@shared/lib/utils";
import { ChevronLeft, ChevronRight, Globe, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import type { z } from "zod";

type LeadStatus = z.infer<typeof LeadStatusSchema>;

export default function LeadsPageContent() {
  return (
    <LeadsProvider>
      <LeadsPageContentInner />
    </LeadsProvider>
  );
}

function LeadsPageContentInner() {
  const { t } = useTranslation();
  const { leads, meta, isLoading, page, setPage, status, setStatus, selectLead } = useLeadsContext();
  const updateLead = useUpdateLead();

  const statusItems = {
    ALL: t("leads.allStatuses"),
    ...Object.fromEntries(LeadStatusSchema.options.map((option) => [option, t(`leads.status.${option}`)]))
  };

  const handleStatusChange = (next: LeadStatus | "ALL" | null) => {
    setStatus(next ?? "ALL");
  };

  const handleLeadStatusUpdate = (id: string, nextStatus: LeadStatus) => {
    updateLead.mutate({ id, status: nextStatus }, { onError: (error) => toast.error(getErrorMessage(error)) });
  };

  return (
    <div className="space-y-4 p-6 md:p-8">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-semibold text-foreground">{t("leads.title")}</h1>
        <p className="text-sm text-muted-foreground">{t("leads.description")}</p>
      </div>

      <div className="flex justify-end">
        <Select items={statusItems} value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-full sm:w-56">
            <SelectValue />
          </SelectTrigger>
          <SelectContent alignItemWithTrigger={false}>
            <SelectItem value="ALL">{t("leads.allStatuses")}</SelectItem>
            {LeadStatusSchema.options.map((option) => (
              <SelectItem key={option} value={option}>
                {t(`leads.status.${option}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("leads.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : leads.length > 0 ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("leads.headerStatus")}</TableHead>
                    <TableHead>{t("leads.headerName")}</TableHead>
                    <TableHead>{t("leads.headerDescription")}</TableHead>
                    <TableHead>{t("leads.headerAddress")}</TableHead>
                    <TableHead>{t("leads.headerPhone")}</TableHead>
                    <TableHead>{t("leads.headerWebsite")}</TableHead>
                    <TableHead>{t("leads.headerType")}</TableHead>
                    <TableHead>{t("leads.headerEmails")}</TableHead>
                    <TableHead>{t("leads.headerSocialLinks")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const StatusIcon = STATUS_ICONS[lead.status];
                    const emails = lead.emails.join(", ");

                    return (
                      <TableRow key={lead.id} className="cursor-pointer" onClick={() => selectLead(lead)}>
                        <TableCell className="text-center" onClick={(event) => event.stopPropagation()}>
                          <DropdownMenu>
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <DropdownMenuTrigger
                                    render={
                                      <button
                                        type="button"
                                        className={cn(
                                          "inline-flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity hover:opacity-80",
                                          STATUS_CHIP_CLASSES[lead.status]
                                        )}
                                        aria-label={t(`leads.status.${lead.status}`)}
                                      />
                                    }
                                  >
                                    <StatusIcon className={cn("size-3.5", lead.status === "ENRICHING" && "animate-spin")} />
                                  </DropdownMenuTrigger>
                                }
                              />
                              <TooltipContent>{t(`leads.status.${lead.status}`)}</TooltipContent>
                            </Tooltip>
                            <DropdownMenuContent align="start">
                              {LeadStatusSchema.options.map((option) => {
                                const OptionIcon = STATUS_ICONS[option];

                                return (
                                  <DropdownMenuItem key={option} disabled={option === lead.status} onClick={() => handleLeadStatusUpdate(lead.id, option)}>
                                    <OptionIcon className="size-3.5" />
                                    {t(`leads.status.${option}`)}
                                  </DropdownMenuItem>
                                );
                              })}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>

                        <TableCell>
                          <p className="max-w-48 truncate text-sm font-medium text-foreground">{lead.name ?? t("leads.unnamed")}</p>
                        </TableCell>

                        <TableCell>
                          {lead.description ? (
                            <Tooltip>
                              <TooltipTrigger render={<p className="max-w-56 truncate text-sm text-muted-foreground">{lead.description}</p>} />
                              <TooltipContent>{lead.description}</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t("leads.noDescription")}</span>
                          )}
                        </TableCell>

                        <TableCell>
                          {lead.address ? (
                            <Tooltip>
                              <TooltipTrigger render={<p className="max-w-56 truncate text-sm text-muted-foreground">{lead.address}</p>} />
                              <TooltipContent>{lead.address}</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t("leads.noAddress")}</span>
                          )}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">{lead.phone ?? t("leads.noPhone")}</TableCell>

                        <TableCell onClick={(event) => event.stopPropagation()}>
                          {lead.website ? (
                            <Tooltip>
                              <TooltipTrigger
                                render={
                                  <a
                                    href={lead.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex max-w-40 items-center gap-1 text-sm text-primary hover:underline"
                                  >
                                    <Globe className="size-3.5 shrink-0" />
                                    <span className="truncate">{lead.website}</span>
                                  </a>
                                }
                              />
                              <TooltipContent>{lead.website}</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t("leads.noWebsite")}</span>
                          )}
                        </TableCell>

                        <TableCell className="text-sm text-muted-foreground">
                          {lead.types.length > 0 ? (
                            <Tooltip>
                              <TooltipTrigger render={<p className="max-w-48 truncate">{lead.types.map((type) => t(`map.types.${type}`)).join(", ")}</p>} />
                              <TooltipContent>{lead.types.map((type) => t(`map.types.${type}`)).join(", ")}</TooltipContent>
                            </Tooltip>
                          ) : (
                            "-"
                          )}
                        </TableCell>

                        <TableCell>
                          {lead.emails.length > 0 ? (
                            <Tooltip>
                              <TooltipTrigger render={<p className="max-w-48 truncate text-sm text-muted-foreground">{emails}</p>} />
                              <TooltipContent>{emails}</TooltipContent>
                            </Tooltip>
                          ) : (
                            <span className="text-sm text-muted-foreground">{t("leads.noEmails")}</span>
                          )}
                        </TableCell>

                        <TableCell onClick={(event) => event.stopPropagation()}>
                          <div className="flex items-center gap-1">
                            {SOCIAL_PLATFORMS.map(({ key, Icon }) => {
                              const rawHref = lead.socialLinks[key];
                              const href = rawHref ? formatSocialLink(key, rawHref) || undefined : undefined;

                              return (
                                <Tooltip key={key}>
                                  <TooltipTrigger
                                    render={
                                      href ? (
                                        <Button
                                          variant="ghost"
                                          size="icon-xs"
                                          nativeButton={false}
                                          render={<a href={href} target="_blank" rel="noopener noreferrer" />}
                                        >
                                          <Icon />
                                        </Button>
                                      ) : (
                                        <Button variant="ghost" size="icon-xs" disabled>
                                          <Icon />
                                        </Button>
                                      )
                                    }
                                  />
                                  <TooltipContent>{t(`leads.social.${key}`)}</TooltipContent>
                                </Tooltip>
                              );
                            })}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <p className="text-sm text-muted-foreground">{t("leads.pagination", { page: meta.page, totalPages: meta.totalPages })}</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" disabled={!meta.hasPrevious} onClick={() => setPage(page - 1)}>
                      <ChevronLeft />
                      {t("leads.previous")}
                    </Button>
                    <Button variant="outline" size="sm" disabled={!meta.hasNext} onClick={() => setPage(page + 1)}>
                      {t("leads.next")}
                      <ChevronRight />
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="py-6 text-center text-sm text-muted-foreground">{t("leads.empty")}</p>
          )}
        </CardContent>
      </Card>

      <EditLeadDialog />
    </div>
  );
}
