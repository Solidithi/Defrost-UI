import { useQuery } from "@tanstack/react-query";
import { useProjectStore } from "@/app/store/project";
import {
	projectLaunchpoolMetricsApi,
	type ProjectLaunchpoolMetrics,
} from "@/app/lib/queries/projectLaunchpoolMetrics";

export const projectLaunchpoolMetricsKeys = {
	all: ["projectLaunchpoolMetrics"] as const,
	project: (projectId: string) =>
		[...projectLaunchpoolMetricsKeys.all, projectId] as const,
};

export const useProjectLaunchpoolMetrics = () => {
	const { currentProject } = useProjectStore();

	return useQuery({
		queryKey: projectLaunchpoolMetricsKeys.project(
			currentProject?.id || ""
		),
		queryFn: () =>
			projectLaunchpoolMetricsApi.getLaunchpoolMetrics(
				currentProject?.id || ""
			),
		enabled: !!currentProject?.id, // Only run if we have a project
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes for live data
	});
};

export type { ProjectLaunchpoolMetrics };

// TODO: Add other project metric hooks as needed
// export const useProjectLaunchpadMetrics = () => { ... }
// export const useProjectNFTMetrics = () => { ... }
// export const useProjectYieldFarmingMetrics = () => { ... }
