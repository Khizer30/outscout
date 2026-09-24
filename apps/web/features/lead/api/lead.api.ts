import type {
  GenerateLeadsResponseSchema,
  GenerateLeadsSchema,
  GenerateOutreachMessageResponseSchema,
  GenerateWhatsAppLinkResponseSchema,
  GetLeadResponseSchema,
  GetLeadsResponseSchema,
  GetLeadsSchema,
  LeadResponseSchema,
  MessageChannelSchema,
  ProcessLeadResponseSchema,
  SendOutreachEmailResponseSchema,
  UpdateLeadResponseSchema,
  UpdateLeadSchema,
  WhatsAppMessagePartSchema
} from "@repo/dtos/lead";
import useAxios from "@shared/hooks/useAxios";
import { useAuthStore } from "@shared/stores/authStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import type { z } from "zod";

type LeadStreamEvent = { jobId: string; data: z.infer<typeof LeadResponseSchema> };

const RECONNECT_DELAY_MS = 3000;

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: z.infer<typeof UpdateLeadSchema> & { id: string }) => {
      const res = await api.patch<z.infer<typeof UpdateLeadResponseSchema>>(`/lead/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["lead", "search"] });
    }
  });
};

// Generate Outreach Message
export const useGenerateOutreachMessage = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, channel }: { id: string; channel: z.infer<typeof MessageChannelSchema> }) => {
      const res = await api.post<z.infer<typeof GenerateOutreachMessageResponseSchema>>(`/lead/outreach-message/${id}`, undefined, {
        params: { channel }
      });
      return res.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["ai", "lead", data.data.leadId] });
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

// Live Lead Updates (SSE)
export const useLeadStream = (onLead: (lead: z.infer<typeof LeadResponseSchema>) => void) => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const onLeadRef = useRef(onLead);
  onLeadRef.current = onLead;

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    const controller = new AbortController();
    let stopped = false;
    let reconnectTimeout: ReturnType<typeof setTimeout> | undefined;

    const connect = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/lead/stream`, {
          headers: { Authorization: `Bearer ${accessToken}`, Accept: "text/event-stream" },
          credentials: "include",
          signal: controller.signal
        });

        if (!response.body) {
          throw new Error("Lead stream response has no body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (!stopped) {
          const { done, value } = await reader.read();
          if (done) {
            break;
          }

          buffer += decoder.decode(value, { stream: true });

          let separatorIndex = buffer.indexOf("\n\n");
          while (separatorIndex !== -1) {
            const rawEvent = buffer.slice(0, separatorIndex);
            buffer = buffer.slice(separatorIndex + 2);

            const data = rawEvent
              .split("\n")
              .filter((line) => line.startsWith("data:"))
              .map((line) => line.slice(5).trim())
              .join("\n");

            if (data) {
              try {
                const event = JSON.parse(data) as LeadStreamEvent;
                onLeadRef.current(event.data);
              } catch {
                // Ignore malformed events
              }
            }

            separatorIndex = buffer.indexOf("\n\n");
          }
        }
      } catch {
        // Connection dropped or failed; fall through to reconnect below unless unmounted
      }

      if (!stopped) {
        reconnectTimeout = setTimeout(() => void connect(), RECONNECT_DELAY_MS);
      }
    };

    void connect();

    return () => {
      stopped = true;
      controller.abort();
      clearTimeout(reconnectTimeout);
    };
  }, [accessToken]);
};
