import type { GetOutreachMessageResponseSchema, RewriteOutreachMessageResponseSchema, RewriteOutreachMessageSchema } from "@repo/dtos/ai";
import useAxios from "@shared/hooks/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

// Get Outreach Messages By Lead
export const useOutreachMessagesByLead = (leadId: string) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["ai", "lead", leadId],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof GetOutreachMessageResponseSchema>>(`/ai/lead/${leadId}`);
      return res.data.data;
    },
    enabled: !!leadId
  });
};

// Rewrite Outreach Message
export const useRewriteOutreachMessage = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: z.infer<typeof RewriteOutreachMessageSchema> & { id: string }) => {
      const res = await api.post<z.infer<typeof RewriteOutreachMessageResponseSchema>>(`/ai/rewrite/${id}`, data);
      return res.data.data;
    },
    onSuccess: (data) => {
      void queryClient.invalidateQueries({ queryKey: ["ai", "lead", data.leadId] });
    }
  });
};
