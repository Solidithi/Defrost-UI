import { prismaClient } from "@/app/lib/prisma";
import {
	toUnifiedPool,
	UnifiedPool,
	EnrichedProject,
	calcPoolsAvgApy,
} from "@/app/types";
import {
	EnrichedLaunchpool,
	toEnrichedLaunchpool,
} from "@/app/types/extended-models/enriched-launchpool";
import { normalizeAddress } from "@/app/utils/address";
import { Address } from "viem";
import { getTokenInfoFromConfig } from "@/app/utils/chain";
import { stringify } from "superjson";
import "@/app/lib/superjson-init";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");
	const chainID = parseInt(searchParams.get("chainID") || "1", 10);

	if (!address) {
		return Response.json({ error: "Address is required" }, { status: 400 });
	}

	try {
		// Fetch projects with all potential pool types
		const projects = await prismaClient.project.findMany({
			where: {
				owner_id: address,
			},
			include: {
				launchpool: {
					where: {
						start_date: { lte: new Date() },
						end_date: { gte: new Date() },
					},
				},
				// farmpool: true, // Include farmpool if it exists in your schema
				// launchpad: true, // Include launchpad if it exists in your schema
			},
		});

		// Transform projects to include both specific pool types and unified pools
		const enrichedProjects = projects.map((project) => {
			// Convert all pool types to specific enriched types
			const enrichedLaunchpools: EnrichedLaunchpool[] = [];
			const unifiedPools: UnifiedPool[] = [];

			// Add launchpools to both enriched and unified pools
			if (project.launchpool?.length) {
				project.launchpool.forEach((pool) => {
					// Create enriched launchpool
					const enrichedPool = toEnrichedLaunchpool(pool);
					enrichedLaunchpools.push(enrichedPool);

					// Create unified pool for backward compatibility
					unifiedPools.push(
						toUnifiedPool(pool, "launchpool", chainID)
					);
				});
			}

			// // Add farmpools to unified pools if they exist
			// if (project.farmpool?.length) {
			// 	project.farmpool.forEach((pool) => {
			// 		unifiedPools.push(toUnifiedPool(pool, "farmpool"));
			// 	});
			// }

			// // Add launchpads to unified pools if they exist
			// if (project.launchpad?.length) {
			// 	project.launchpad.forEach((pool) => {
			// 		unifiedPools.push(toUnifiedPool(pool, "launchpad"));
			// 	});
			// }

			// Calculate metrics across all pool types
			const tokenDecimals = new Map<string, number>(); // map for fast access
			const totalStaked = unifiedPools.reduce((sum, pool) => {
				let decimals = tokenDecimals.get(pool.token_address ?? "");
				if (!decimals) {
					decimals = getTokenInfoFromConfig(
						chainID,
						normalizeAddress((pool.token_address as Address) ?? "")
					)?.decimals;
					if (decimals) {
						tokenDecimals.set(pool.token_address!, decimals);
					}
				}

				return decimals
					? sum + pool.total_staked.div(decimals).toNumber()
					: sum;
			}, 0);

			const totalStakers = unifiedPools.reduce(
				(sum, pool) => sum + pool.total_stakers,
				0
			);

			// const avgApy = unifiedPools.length
			// 	? unifiedPools.reduce((sum, pool) => sum + pool.staker_apy, 0) /
			// 		unifiedPools.length
			// 	: 0;
			const avgApy = calcPoolsAvgApy(unifiedPools);

			// Get most relevant token address
			const tokenAddress =
				project.token_address ||
				(unifiedPools.length > 0
					? unifiedPools[0].reward_token_address
					: undefined);

			// Create enriched project with all needed metrics
			return {
				...project,
				launchpools: enrichedLaunchpools,
				unifiedPools, // keep for backward compatibility
				avgApy,
				tokenAddress,
				totalStaked,
				poolCount: unifiedPools.length,
				totalStakers,
			} as EnrichedProject;
		});

		return Response.json(stringify({ projects: enrichedProjects }));
	} catch (error) {
		console.error("Error fetching projects:", error);
		return Response.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 }
		);
	}
}
