import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      axios.post("/api/auth/register", payload).then((r) => r.data),
    onSuccess: () => {
      // Invalidate the me query cache so it refetches with the new user
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) =>
      axios.post("/api/auth/login", payload).then((r) => r.data),
    onSuccess: () => {
      // Invalidate the me query cache so it refetches with the new user
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => axios.post("/api/auth/logout").then((r) => r.data),
    onSuccess: () => {
      // Invalidate the me query cache so it refetches and gets null
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });
};

export const useMe = () =>
  useQuery({
    queryKey: ["me"],
    queryFn: () => axios.get("/api/auth/me").then((r) => r.data.user),
  });
