import { prismaClient } from "@/app/lib/prisma";
import { stringify } from "superjson";

// Return percentage
const calculateGrowthRate = (now: number, then: number): number => {
	return (now / then - 1) * 100;
};

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const growthRatesInterval = parseInt(
		searchParams.get("growthRatesInterval") || "24"
	); // Default to 24 hours ago

	const latestSnapshot =
		await prismaClient.platform_metrics_snapshots.findFirst({
			orderBy: {
				timestamp: "desc", // latest first
			},
		});

	const latestTimestamp =
		latestSnapshot?.timestamp.getTime() || new Date().getTime();
	const pastSnapshot =
		await prismaClient.platform_metrics_snapshots.findFirst({
			where: {
				timestamp: {
					lte: new Date(
						latestTimestamp - growthRatesInterval * 60 * 60 * 1000 // convert hours to milisecs
					),
				},
			},
		});

	if (!latestSnapshot) {
		return new Response(
			stringify({
				error: "No platform metrics snapshot found",
			}),
			{ status: 404 }
		);
	}

	if (!pastSnapshot) {
		return new Response(
			stringify({
				error: "No past platform metrics snapshot found",
			}),
			{ status: 404 }
		);
	}

	// Calculate growth rates of metrics
	const growthRates = {
		total_value_locked: calculateGrowthRate(
			latestSnapshot.total_value_locked.toNumber(),
			pastSnapshot.total_value_locked.toNumber()
		),
		count_projects: calculateGrowthRate(
			latestSnapshot.count_projects,
			pastSnapshot.count_projects
		),
		count_launchpools: calculateGrowthRate(
			latestSnapshot.count_launchpools,
			pastSnapshot.count_launchpools
		),
		count_unique_users: calculateGrowthRate(
			latestSnapshot.count_unique_users,
			pastSnapshot.count_unique_users
		),
		count_active_users: calculateGrowthRate(
			latestSnapshot.count_active_users,
			pastSnapshot.count_active_users
		),
		count_transactions: calculateGrowthRate(
			latestSnapshot.count_transactions,
			pastSnapshot.count_transactions
		),
		tokens_distributed: calculateGrowthRate(
			latestSnapshot.tokens_distributed.toNumber(),
			pastSnapshot.tokens_distributed.toNumber()
		),
	};

	return Response.json(
		stringify({
			snapshot: latestSnapshot,
			growthRates,
		})
	);
}
