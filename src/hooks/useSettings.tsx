// src/hooks/useSettings.ts
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useSettings() {
  return useQuery({
    queryKey: ["settings", "me"],
    queryFn: async () => {
      const res = await axios.get("/api/settings");
      return res.data.user;
    },
    staleTime: 1000 * 60 * 2,
  });
}

export function useUpdateProfileAndSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      name?: string;
      email?: string;
      settings?: any;
    }) => {
      const res = await axios.patch("/api/settings", payload);
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries(["settings", "me"]);
      qc.invalidateQueries(["me"]);
    },
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      currentPassword,
      newPassword,
    }: {
      currentPassword: string;
      newPassword: string;
    }) => {
      const res = await axios.post("/api/settings/password", {
        currentPassword,
        newPassword,
      });
      return res.data;
    },
    onSuccess: () => {
      // optionally you may want to force logout or show success
      qc.invalidateQueries(["settings", "me"]);
    },
  });
}
