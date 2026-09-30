import type {
  AcceptMyInvitationResponseSchema,
  InvitationEmailResponseSchema,
  InviteUserResponseSchema,
  InviteUserSchema,
  ListInvitationsResponseSchema,
  ListInvitationsSchema,
  ListTeamMembersResponseSchema,
  MyInvitationsResponseSchema,
  RejectInvitationResponseSchema,
  RevokeInvitationResponseSchema
} from "@repo/dtos/team";
import useAxios from "@shared/hooks/useAxios";
import { api } from "@shared/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { z } from "zod";

// Invite User
export const useInviteUser = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: z.infer<typeof InviteUserSchema>) => {
      const res = await api.post<z.infer<typeof InviteUserResponseSchema>>("/team/invitations", data);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", "invitations"] });
    }
  });
};

// List Invitations
export const useListInvitations = (status: z.infer<typeof ListInvitationsSchema>["status"]) => {
  const api = useAxios();

  return useQuery({
    queryKey: ["team", "invitations", "list", status],
    queryFn: async () => {
      const res = await api.post<z.infer<typeof ListInvitationsResponseSchema>>("/team/invitations/list", { status });
      return res.data.data;
    },
    enabled: status.length > 0
  });
};

// Revoke Invitation
export const useRevokeInvitation = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete<z.infer<typeof RevokeInvitationResponseSchema>>(`/team/invitations/${id}`);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", "invitations"] });
    }
  });
};

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

// List My Invitations
export const useMyInvitations = () => {
  const api = useAxios();

  return useQuery({
    queryKey: ["team", "invitations", "me"],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof MyInvitationsResponseSchema>>("/team/invitations/me");
      return res.data.data;
    }
  });
};

// Accept My Invitation
export const useAcceptMyInvitation = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<z.infer<typeof AcceptMyInvitationResponseSchema>>(`/team/invitations/${id}/accept`);
      return res.data.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", "invitations"] });
    }
  });
};

// Reject My Invitation
export const useRejectMyInvitation = () => {
  const api = useAxios();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const res = await api.post<z.infer<typeof RejectInvitationResponseSchema>>(`/team/invitations/${id}/reject`);
      return res.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["team", "invitations"] });
    }
  });
};

// List Team Members
export const useTeamMembers = () => {
  const api = useAxios();

  return useQuery({
    queryKey: ["team", "members"],
    queryFn: async () => {
      const res = await api.get<z.infer<typeof ListTeamMembersResponseSchema>>("/team/members");
      return res.data.data;
    }
  });
};
