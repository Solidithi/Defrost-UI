import { useQuery } from "@tanstack/react-query";
import { statsApi } from "@/app/lib/queries/stats";

const statsKeys = {
	all: ["stats"] as const,
	platformMetrics: () => [...statsKeys.all, "platformMetrics"] as const,
};

export const usePlatformMetrics = () => {
	return useQuery({
		queryKey: statsKeys.platformMetrics(),
		queryFn: () => statsApi.getPlatformMetricsSnapshot(),
		staleTime: 5 * 60 * 1000, // 5 mins
	});
};
