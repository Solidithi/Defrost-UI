import "@/app/lib/superjson-init";
import { parse } from "superjson";

// Types for project-specific metrics
export interface ProjectLaunchpoolMetrics {
	// StatCard metrics (non-overlapping, no historical trends needed)
	totalParticipants: number;
	totalLaunchpools: number;
	averageApr: number;

	// Additional metrics for charts and other components
	tokensDistributed: number;
	totalValueLocked: number; // Used internally for calculations, not displayed in stat cards

	// Chart data
	stakingTimeSeriesData: Array<{
		date: string;
		totalStaked: number;
		breakdown: {
			vASTR: number;
			vDOT: number;
			vGLMR: number;
			vKSM: number;
		};
	}>;

	// APR data over time
	aprTimeSeriesData: Array<{
		date: string;
		apr: number;
	}>;

	// Current vAsset breakdown for bar chart
	vAssetBreakdown: Array<{
		asset: string;
		amount: number;
	}>;

	// Token distribution for donut chart
	tokenDistribution: {
		remainingTokens: number;
		distributedTokens: number;
		totalTokens: number;
	};
}

export const projectLaunchpoolMetricsApi = {
	getLaunchpoolMetrics: async (
		projectId: string,
		growthRatesInterval: number = 24
	): Promise<ProjectLaunchpoolMetrics> => {
		console.log(`Fetching launchpool metrics for project ${projectId}...`);
		try {
			const params = new URLSearchParams({
				growthRatesInterval: growthRatesInterval.toString(),
			});

			const response = await fetch(
				`/api/project/${projectId}/metrics/launchpool?${params}`
			);

			if (!response.ok) {
				throw new Error(
					`Failed to fetch project launchpool metrics: ${response.status}`
				);
			}

			const responseData = parse(
				await response.json()
			) as ProjectLaunchpoolMetrics;

			console.log(
				`Project launchpool metrics for ${projectId} fetched successfully:`,
				responseData
			);

			return responseData;
		} catch (error) {
			console.error(
				`Failed to fetch project launchpool metrics for ${projectId}:`,
				error
			);
			throw error;
		}
	},
};

// TODO: Add other project metric APIs as they're implemented
// export const projectLaunchpadMetricsApi = { ... }
// export const projectNFTMetricsApi = { ... }
// export const projectYieldFarmingMetricsApi = { ... }
