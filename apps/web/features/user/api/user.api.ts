import type { GetUserResponseSchema, UpdateUserResponseSchema, UpdateUserSchema } from "@repo/dtos/user";
import useAxios from "@shared/hooks/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

// Get Current User
export const useGetMe = () => {
  const axios = useAxios();

  return useQuery({
    queryKey: ["user", "me"],
    queryFn: async () => {
      const res = await axios.get<z.infer<typeof GetUserResponseSchema>>("/user/me");
      return res.data.data;
    }
  });
};

// Update Current User
export const useUpdateMe = () => {
  const axios = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof UpdateUserSchema>) => {
      const res = await axios.patch<z.infer<typeof UpdateUserResponseSchema>>("/user/me", data);
      return res.data.data;
    },
    onSuccess: (user) => {
      queryClient.setQueryData(["user", "me"], user);
    }
  });
};
