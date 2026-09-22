import type {
  GenerateLeadsResponseSchema,
  GenerateLeadsSchema,
  GenerateOutreachMessageResponseSchema,
  GenerateWhatsAppLinkResponseSchema,
  GetLeadResponseSchema,
  GetLeadsResponseSchema,
  GetLeadsSchema,
  MessageChannelSchema,
  ProcessLeadResponseSchema,
  SendOutreachEmailResponseSchema,
  UpdateLeadResponseSchema,
  UpdateLeadSchema,
  WhatsAppMessagePartSchema
} from "@repo/dtos/lead";
import useAxios from "@shared/hooks/useAxios";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { z } from "zod";

// Generate Leads
export const useGenerateLeads = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async (data: z.infer<typeof GenerateLeadsSchema>) => {
      const res = await api.post<z.infer<typeof GenerateLeadsResponseSchema>>("/lead/generate", data);
      return res.data;
    }
  });
};

// Get Leads
export const useLeads = (params: z.infer<typeof GetLeadsSchema>) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["lead", "search", params],
    queryFn: async () => {
      const res = await api.post<z.infer<typeof GetLeadsResponseSchema>>("/lead/search", params);
      return res.data;
    },
    staleTime: 0,
    refetchOnMount: "always"
  });
};

// Get Lead
export const useLead = (id: string) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["lead", id],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof GetLeadResponseSchema>>(`/lead/${id}`);
      return res.data;
    },
    enabled: !!id
  });
};

// Update Lead
export const useUpdateLead = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async ({ id, ...data }: z.infer<typeof UpdateLeadSchema> & { id: string }) => {
      const res = await api.patch<z.infer<typeof UpdateLeadResponseSchema>>(`/lead/${id}`, data);
      return res.data;
    }
  });
};

// Generate Outreach Message
export const useGenerateOutreachMessage = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async ({ id, channel }: { id: string; channel: z.infer<typeof MessageChannelSchema> }) => {
      const res = await api.post<z.infer<typeof GenerateOutreachMessageResponseSchema>>(`/lead/outreach-message/${id}`, null, {
        params: { channel }
      });
      return res.data;
    }
  });
};

// Generate WhatsApp Link
export const useGenerateWhatsAppLink = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async ({ id, messagePart }: { id: string; messagePart?: z.infer<typeof WhatsAppMessagePartSchema> }) => {
      const res = await api.get<z.infer<typeof GenerateWhatsAppLinkResponseSchema>>(`/lead/whatsapp-link/${id}`, {
        params: { messagePart }
      });
      return res.data;
    }
  });
};

// Send Outreach Email
export const useSendOutreachEmail = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<z.infer<typeof SendOutreachEmailResponseSchema>>(`/lead/email/${id}`);
      return res.data;
    }
  });
};

// Process Lead
export const useProcessLead = () => {
  const api = useAxios();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<z.infer<typeof ProcessLeadResponseSchema>>(`/lead/process-lead/${id}`);
      return res.data;
    }
  });
};
