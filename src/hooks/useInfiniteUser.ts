import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useInfiniteUsers({ search, role, sortBy, order, limit = 10 }) {
  return useInfiniteQuery({
    queryKey: ["users", { search, role, sortBy, order }],
    queryFn: async ({ pageParam = null }) => {
      const params = new URLSearchParams({
        limit: String(limit),
        search: search || "",
        role: role || "ALL",
        sortBy,
        order,
      });

      if (pageParam) params.set("cursor", pageParam);

      const res = await axios.get(`/api/users?${params.toString()}`);
      return res.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
