import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "./authSlice";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    register: builder.mutation<
      { user: User },
      { name: string; email: string; password: string }
    >({
      query: (body) => ({
        url: "auth/register",
        method: "POST",
        body,
      }),
    }),

    login: builder.mutation<
      { user: User },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),

    logout: builder.mutation<{ ok: boolean }, void>({
      query: () => ({
        url: "auth/logout",
        method: "POST",
      }),
    }),

    me: builder.query<{ user: User | null }, void>({
      query: () => ({ url: "auth/me" }),
      // Keep the data in cache for 5 minutes (300 seconds)
      keepUnusedDataFor: 300,
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useMeQuery,
} = api;
