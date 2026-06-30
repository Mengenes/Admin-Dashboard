import { apiBaseUrl } from "@/config/axios";
import { useQuery } from "@tanstack/react-query";

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await apiBaseUrl.get("/dashboard/summary");
    
      return res.data;
      
    },
        staleTime: 5 * 60 * 1000,//5 minutes
gcTime: 30 * 60 * 1000, // 30 minutes
  });
};