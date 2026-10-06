"use client";
import AiOutreachDialog from "@features/ai/components/AiOutreachDialog";
import NoCompanyMessage from "@features/company/components/NoCompanyMessage";
import { useLeads, useUpdateLead } from "@features/lead/api/lead.api";
import { STATUS_CHIP_CLASSES, STATUS_ICONS } from "@features/lead/lib/leadDisplay";
import { LeadResponseSchema, LeadStatusSchema } from "@repo/dtos/lead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@shared/components/ui/card";
import { getErrorMessage } from "@shared/lib/error";
import { cn } from "@shared/lib/utils";
import { useAuthStore } from "@shared/stores/authStore";
import { Loader2, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { FaWhatsapp } from "react-icons/fa6";
import type { z } from "zod";

type Lead = z.infer<typeof LeadResponseSchema>;
type LeadStatus = z.infer<typeof LeadStatusSchema>;

const RECENT_LEADS_LIMIT = 20;
const BOARD_STATUSES = LeadStatusSchema.options;

export default function RecentLeadsBoard() {
  const companyId = useAuthStore((state) => state.user?.companyId);
  const { t } = useTranslation();
  const { data, isLoading } = useLeads({ page: 1, limit: RECENT_LEADS_LIMIT, status: [...BOARD_STATUSES] }, !!companyId);
  const updateLead = useUpdateLead();
  const [draggedLeadId, setDraggedLeadId] = useState<string | null>(null);
  const [dragOverStatus, setDragOverStatus] = useState<LeadStatus | null>(null);

  const leads = data?.data ?? [];

  const columns = useMemo(() => {
    const grouped = new Map<LeadStatus, Lead[]>(BOARD_STATUSES.map((status) => [status, []]));
    for (const lead of data?.data ?? []) {
      grouped.get(lead.status)?.push(lead);
    }
    return grouped;
  }, [data?.data]);

  if (!companyId) {
    return (
      <div className="p-6 md:p-8">
        <NoCompanyMessage />
      </div>
    );
  }

  const handleDrop = (status: LeadStatus) => {
    setDragOverStatus(null);
    const leadId = draggedLeadId;
    setDraggedLeadId(null);
    if (!leadId) {
      return;
    }

    const lead = leads.find((candidate) => candidate.id === leadId);
    if (!lead || lead.status === status) {
      return;
    }

    updateLead.mutate({ id: leadId, status }, { onError: (error) => toast.error(getErrorMessage(error)) });
  };

  return (
    <div className="space-y-4 p-6 md:p-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("leads.board.title")}</CardTitle>
          <CardDescription>{t("leads.board.description", { count: RECENT_LEADS_LIMIT })}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          ) : leads.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">{t("leads.empty")}</p>
            </div>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {BOARD_STATUSES.map((status) => {
                const StatusIcon = STATUS_ICONS[status];
                const columnLeads = columns.get(status) ?? [];

                return (
                  <div
                    key={status}
                    onDragOver={(event) => {
                      event.preventDefault();
                      setDragOverStatus(status);
                    }}
                    onDragLeave={() => setDragOverStatus((current) => (current === status ? null : current))}
                    onDrop={(event) => {
                      event.preventDefault();
                      handleDrop(status);
                    }}
                    className={cn(
                      "flex w-64 shrink-0 flex-col gap-2 rounded-lg border border-border bg-muted/30 p-3 transition-colors",
                      dragOverStatus === status && "border-primary bg-primary/5"
                    )}
                  >
                    <div className="flex items-center justify-between px-1">
                      <div className={cn("inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold", STATUS_CHIP_CLASSES[status])}>
                        <StatusIcon className={cn("size-3", status === "ENRICHING" && "animate-spin")} />
                        {t(`leads.status.${status}`)}
                      </div>
                      <span className="text-xs text-muted-foreground">{columnLeads.length}</span>
                    </div>

                    <div className="flex min-h-16 flex-col gap-2">
                      {columnLeads.length === 0 ? (
                        <div className="flex h-16 items-center justify-center rounded-md border border-dashed border-border">
                          <p className="text-xs text-muted-foreground">{t("leads.board.emptyColumn")}</p>
                        </div>
                      ) : (
                        columnLeads.map((lead) => (
                          <div
                            key={lead.id}
                            draggable
                            onDragStart={(event) => {
                              setDraggedLeadId(lead.id);
                              event.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnd={() => {
                              setDraggedLeadId(null);
                              setDragOverStatus(null);
                            }}
                            className={cn(
                              "cursor-grab rounded-md border border-border bg-card p-2.5 shadow-xs transition-opacity active:cursor-grabbing",
                              draggedLeadId === lead.id && "opacity-40"
                            )}
                          >
                            <p className="truncate text-sm font-medium text-foreground">{lead.name ?? t("leads.unnamed")}</p>
                            <div className="mt-1 flex items-center justify-between gap-1">
                              <p className="truncate text-xs text-muted-foreground">{lead.emails[0] ?? t("leads.noEmails")}</p>
                              <div className="flex shrink-0 items-center" onClick={(event) => event.stopPropagation()}>
                                {lead.phone && <AiOutreachDialog leadId={lead.id} channel="WHATSAPP" icon={FaWhatsapp} />}
                                {lead.emails.length > 0 && <AiOutreachDialog leadId={lead.id} channel="EMAIL" icon={Mail} />}
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
