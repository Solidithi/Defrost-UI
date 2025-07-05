import { NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/prisma";
import {
	toUnifiedPool,
	UnifiedPool,
	EnrichedProject,
	isPoolActive,
	calcPoolsAvgApy,
} from "@/app/types";
import {
	EnrichedLaunchpool,
	toEnrichedLaunchpool,
} from "@/app/types/extended-models/enriched-launchpool";
import { stringify } from "superjson";
import "@/app/lib/superjson-init";

export async function GET(request: Request) {
	try {
		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const chainID = parseInt(searchParams.get("chainID") || "1", 10);
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);

		// Validate parameters
		if (isNaN(chainID)) {
			return NextResponse.json(
				{ error: "Invalid chainID parameter" },
				{ status: 400 }
			);
		}

		if (page < 1 || limit < 1 || limit > 100) {
			return NextResponse.json(
				{ error: "Invalid pagination parameters" },
				{ status: 400 }
			);
		}

		// Calculate skip for pagination
		const skip = (page - 1) * limit;

		// Get total count for pagination
		const totalCount = await prismaClient.project.count();

		// Fetch projects with pagination
		const projects = await prismaClient.project.findMany({
			skip,
			take: limit,
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

			// Add farmpools to unified pools if they exist
			//   if (project.farmpool?.length) {
			//     project.farmpool.forEach((pool) => {
			//       unifiedPools.push(toUnifiedPool(pool, 'farmpool'))
			//     })
			//   }

			// Add launchpads to unified pools if they exist
			//   if (project.launchpad?.length) {
			//     project.launchpad.forEach((pool) => {
			//       unifiedPools.push(toUnifiedPool(pool, 'launchpad'))
			//     })
			//   }

			// Calculate metrics across all pool types
			const totalStaked = unifiedPools.reduce(
				(sum, pool) => sum + parseFloat(pool.total_staked.toString()),
				0
			);

			const totalStakers = unifiedPools.reduce(
				(sum, pool) => sum + pool.total_stakers,
				0
			);

			const avgApy = calcPoolsAvgApy(unifiedPools);

			// Get most relevant token address
			const tokenAddress =
				project.token_address ||
				(unifiedPools.length > 0
					? unifiedPools[0].project_token_address
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

		return NextResponse.json(
			stringify({
				projects: enrichedProjects,
				total: totalCount,
				page,
				limit,
			})
		);
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch projects",
				message:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
