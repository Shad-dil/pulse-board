import axios from "axios";
import { useQuery } from "@tanstack/react-query";

export const useActivity = (filters: any, page: number) =>
  useQuery({
    queryKey: ["activity", filters, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: String(page),
        limit: "10",
        ...filters,
      });

      const res = await axios.get(`/api/activity?${params}`);
      return res.data;
    },
  });
