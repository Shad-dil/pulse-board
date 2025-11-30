import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// --- Types ---
type UseUsersParams = {
  page: number;
  limit: number;
  search?: string;
  role?: string;
};

// --- Hooks ---
export function useUsers({ page, limit, search, role }: UseUsersParams) {
  return useQuery({
    queryKey: ["users", page, limit, search, role],
    queryFn: async () => {
      const res = await axios.get("/api/users", {
        params: { page, limit, search, role },
      });
      return res.data;
    },
    placeholderData: (prev) => prev, // 👈 React Query v5 replacement
  });
}

export function useUser(id?: string) {
  return useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`/api/users/${id}`);
      return res.data.user;
    },
    enabled: !!id,
  });
}

export function useUserActivities(id?: string) {
  return useQuery({
    queryKey: ["user", id, "activities"],
    queryFn: async () => {
      if (!id) return [];
      const res = await axios.get(`/api/users/${id}/activities?take=20`);
      return res.data.activities;
    },
    enabled: !!id,
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      axios.patch(`/api/users/${id}`, payload).then((r) => r.data.user),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      qc.invalidateQueries({ queryKey: ["user", vars.id] });
    },
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      axios.delete(`/api/users/${id}`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useRestoreUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      axios.patch(`/api/users/${id}/restore`).then((r) => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useExportUsers() {
  return {
    exportCSV: async (params: Record<string, any> = {}) => {
      const url = new URL("/api/users/export", window.location.origin);
      Object.entries(params).forEach(
        ([k, v]) => v != null && url.searchParams.set(k, String(v))
      );
      const res = await fetch(url.toString());
      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "users_export.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    },
  };
}

export function useUpdateSettings() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, payload }: { id: string; payload: any }) =>
      axios
        .patch(`/api/users/${id}/settings`, payload)
        .then((r) => r.data.settings),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["user", vars.id] });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
  });
}
