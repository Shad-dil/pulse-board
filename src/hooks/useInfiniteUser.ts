import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

type InfiniteUsersParams = {
  search?: string;
  role?: string;
  sortBy?: string;
  order?: "asc" | "desc";
  limit?: number;
};

export function useInfiniteUsers({
  search = "",
  role = "ALL",
  sortBy = "",
  order = "asc",
  limit = 10,
}: InfiniteUsersParams) {
  return useInfiniteQuery({
    queryKey: ["users", { search, role, sortBy, order }],
    initialPageParam: null, // ✅ Required in React Query v5
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams({
        limit: String(limit),
        search,
        role,
        sortBy,
        order,
      });

      if (pageParam) params.set("cursor", pageParam);

      const res = await axios.get(`/api/users?${params.toString()}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage?.nextCursor ?? undefined,
  });
}
