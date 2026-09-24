"use client";
import { useLeads, useLeadStream } from "@features/lead/api/lead.api";
import type { GetLeadResponseSchema, GetLeadsResponseSchema, LeadStatusSchema } from "@repo/dtos/lead";
import { useQueryClient } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";
import type { z } from "zod";

export type LeadStatusFilter = z.infer<typeof LeadStatusSchema> | "ALL";
export type LeadsMeta = z.infer<typeof GetLeadsResponseSchema>["meta"];
export type Lead = z.infer<typeof GetLeadsResponseSchema>["data"][number];

const LIMIT = 20;

interface LeadsContextValue {
  leads: Lead[];
  meta: LeadsMeta | undefined;
  isLoading: boolean;
  page: number;
  setPage: (page: number) => void;
  status: LeadStatusFilter;
  setStatus: (status: LeadStatusFilter) => void;
  selectedLead: Lead | null;
  selectLead: (lead: Lead | null) => void;
}

const LeadsContext = createContext<LeadsContextValue | null>(null);

export function useLeadsContext() {
  const ctx = useContext(LeadsContext);
  if (!ctx) {
    throw new Error("useLeadsContext must be used within a LeadsProvider");
  }
  return ctx;
}

interface LeadsProviderProps {
  children: React.ReactNode;
}

export function LeadsProvider({ children }: LeadsProviderProps) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [status, setStatusState] = useState<LeadStatusFilter>("ALL");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const { data, isLoading } = useLeads({
    page,
    limit: LIMIT,
    status: status === "ALL" ? undefined : [status]
  });

  useLeadStream((lead) => {
    queryClient.setQueriesData<z.infer<typeof GetLeadsResponseSchema>>({ queryKey: ["lead", "search"] }, (old) => {
      if (!old || !old.data.some((existing) => existing.id === lead.id)) {
        return old;
      }
      return { ...old, data: old.data.map((existing) => (existing.id === lead.id ? lead : existing)) };
    });

    queryClient.setQueryData<z.infer<typeof GetLeadResponseSchema>>(["lead", lead.id], (old) => (old ? { ...old, data: lead } : old));

    setSelectedLead((current) => (current && current.id === lead.id ? lead : current));
  });

  const setStatus = (next: LeadStatusFilter) => {
    setStatusState(next);
    setPage(1);
  };

  const value: LeadsContextValue = {
    leads: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    page,
    setPage,
    status,
    setStatus,
    selectedLead,
    selectLead: setSelectedLead
  };

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}
