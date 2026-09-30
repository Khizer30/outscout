import type {
  CompanySettingsResponseSchema,
  CreateCompanyResponseSchema,
  CreateCompanySchema,
  DeleteCompanyResponseSchema,
  GetUserCompaniesResponseSchema,
  UpdateCompanyEmailSettingsResponseSchema,
  UpdateCompanyEmailSettingsSchema,
  UpdateCompanyMessageRulesResponseSchema,
  UpdateCompanyMessageRulesSchema,
  UpdateCompanyResponseSchema,
  UpdateCompanySchema
} from "@repo/dtos/company";
import useAxios from "@shared/hooks/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

// Get My Companies
export const useMyCompanies = () => {
  const api = useAxios();

  return useQuery({
    queryKey: ["company", "me"],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof GetUserCompaniesResponseSchema>>("/company");
      return res.data.data;
    }
  });
};

// Get Company Settings
export const useCompanySettings = (enabled: boolean = true) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["company", "settings"],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof CompanySettingsResponseSchema>>("/company/settings");
      return res.data.data;
    },
    enabled
  });
};

// Create Company
export const useCreateCompany = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof CreateCompanySchema>) => {
      const res = await api.post<z.infer<typeof CreateCompanyResponseSchema>>("/company", data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    }
  });
};

// Update Company
export const useUpdateCompany = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UpdateCompanySchema>) => {
      const res = await api.patch<z.infer<typeof UpdateCompanyResponseSchema>>("/company", data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    }
  });
};

// Delete Company
export const useDeleteCompany = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await api.delete<z.infer<typeof DeleteCompanyResponseSchema>>("/company");
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    }
  });
};

// Update Company Email Settings
export const useUpdateCompanyEmailSettings = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UpdateCompanyEmailSettingsSchema>) => {
      const res = await api.patch<z.infer<typeof UpdateCompanyEmailSettingsResponseSchema>>("/company/email-settings", data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    }
  });
};

// Update Company Message Rules
export const useUpdateCompanyMessageRules = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UpdateCompanyMessageRulesSchema>) => {
      const res = await api.patch<z.infer<typeof UpdateCompanyMessageRulesResponseSchema>>("/company/message-rules", data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["company"] });
    }
  });
};
