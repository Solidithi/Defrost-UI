import { platform_metrics_snapshots } from "@prisma/client";
import { parse } from "superjson";

interface PlatformMetricsSnapshotResponse {
	snapshot: platform_metrics_snapshots;
	growthRates: Omit<platform_metrics_snapshots, "timestamp" | "id">;
}

export const statsApi = {
	getPlatformMetricsSnapshot: async (): Promise<
		PlatformMetricsSnapshotResponse | undefined
	> => {
		try {
			const response = await fetch("/api/stats/platform-metrics");
			const data = parse(
				await response.json()
			) as PlatformMetricsSnapshotResponse;
			console.log(
				"Platform metrics snapshot fetched successfully:",
				data
			);
			return data;
		} catch (error) {
			console.error("Failed to fetch platform stats snapshot:", error);
		}
	},
};
