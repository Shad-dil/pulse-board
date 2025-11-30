// src/hooks/useAnalytics.ts
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export function useAnalytics({
  from,
  to,
}: { from?: string; to?: string } = {}) {
  return useQuery({
    queryKey: ["analytics", from, to],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (from) params.set("from", from);
      if (to) params.set("to", to);
      const res = await axios.get(`/api/analytics?${params.toString()}`);
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
  });
}
