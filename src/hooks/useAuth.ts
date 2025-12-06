import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
type AuthPayload = {
  name?: string;
  email: string;
  password: string;
};
export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AuthPayload) =>
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
    mutationFn: (payload: AuthPayload) =>
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
    queryFn: async () => {
      const res = await axios.get("/api/auth/me", {
        withCredentials: true,
      });
      return res.data.user; // <-- return only the actual user
    },
  });

export const useAddUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["add"],
    mutationFn: async (payload: AuthPayload) => {
      const res = await axios.post("/api/users", payload);
      return res.data.newUser;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};
