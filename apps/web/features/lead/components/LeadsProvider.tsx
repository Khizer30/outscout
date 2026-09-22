"use client";
import { useLeads } from "@features/lead/api/lead.api";
import type { GetLeadsResponseSchema, LeadStatusSchema } from "@repo/dtos/lead";
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
  const [page, setPage] = useState(1);
  const [status, setStatusState] = useState<LeadStatusFilter>("ALL");

  const { data, isLoading } = useLeads({
    page,
    limit: LIMIT,
    status: status === "ALL" ? undefined : [status]
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
    setStatus
  };

  return <LeadsContext.Provider value={value}>{children}</LeadsContext.Provider>;
}
