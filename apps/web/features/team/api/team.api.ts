import type { InvitationEmailResponseSchema } from "@repo/dtos/team";
import { api } from "@shared/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { z } from "zod";

// Get Invitation's Email
export const useInvitationEmail = (invitationToken: string) =>
  useQuery({
    queryKey: ["team", "invitations", invitationToken, "email"],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof InvitationEmailResponseSchema>>(`/team/invitations/${invitationToken}/email`);
      return res.data;
    },
    enabled: !!invitationToken
  });
