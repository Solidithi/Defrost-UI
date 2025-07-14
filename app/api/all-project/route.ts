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
import { normalizeAddress } from "@/app/utils/address";
import { Address } from "viem";
import { getTokenInfoFromConfig } from "@/app/utils/chain";
import { project, launchpool } from "@prisma/client";
import { stringify } from "superjson";
import "@/app/lib/superjson-init";

interface ProjectWithLaunchpool extends project {
	launchpool: launchpool[];
}

export async function GET(request: Request) {
	try {
		// Parse query parameters
		const { searchParams } = new URL(request.url);
		const chainId = searchParams.get("chainId");
		const category = searchParams.get("cateogry");
		const page = parseInt(searchParams.get("page") || "1", 10);
		const limit = parseInt(searchParams.get("limit") || "10", 10);
		const search = searchParams.get("search");

		// Validate parameters
		let filterChainId: number | undefined;
		if (chainId) {
			const numChainId = Number(chainId);
			if (!isNaN(numChainId)) {
				filterChainId = numChainId;
			}
		}

		if (page < 1 || limit < 1 || limit > 100) {
			return NextResponse.json(
				{ error: "Invalid pagination parameters" },
				{ status: 400 }
			);
		}

		// Calculate skip for pagination
		const skip = (page - 1) * limit;

		// Build where clause for search
		let whereClause: any = {};
		if (search) {
			whereClause.OR = [
				{
					name: {
						contains: search,
						mode: "insensitive" as const,
					},
				},
				{
					short_description: {
						contains: search,
						mode: "insensitive" as const,
					},
				},
				{
					token_symbol: {
						contains: search,
						mode: "insensitive" as const,
					},
				},
			];
		}
		if (filterChainId) {
			whereClause.chain_id = filterChainId;
		}
		if (category) {
			whereClause.category = category;
		}

		// Get total count for pagination with search filter
		const totalCount = await prismaClient.project.count({
			where: whereClause,
		});

		// Fetch projects with pagination and search
		const projects = await prismaClient.project.findMany({
			where: whereClause,
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
		const enrichedProjects = projects.map(
			(project: ProjectWithLaunchpool) => {
				// Convert all pool types to specific enriched types
				const enrichedLaunchpools: EnrichedLaunchpool[] = [];
				const unifiedPools: UnifiedPool[] = [];

				// Add launchpools to both enriched and unified pools
				if (project.launchpool?.length) {
					project.launchpool.forEach((pool: launchpool) => {
						// Create enriched launchpool
						const enrichedPool = toEnrichedLaunchpool(pool);
						enrichedLaunchpools.push(enrichedPool);

						// Create unified pool for backward compatibility
						unifiedPools.push(
							toUnifiedPool(pool, "launchpool", project.chain_id)
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
				const tokenDecimals = new Map<string, number>(); // map for fast access
				const totalStaked = unifiedPools.reduce((sum, pool) => {
					let decimals = tokenDecimals.get(pool.token_address ?? "");
					console.log("Pool token address:", pool.token_address);
					if (!decimals) {
						decimals = getTokenInfoFromConfig(
							project.chain_id,
							normalizeAddress(
								(pool.token_address as Address) ?? ""
							)
						)?.decimals;
						if (decimals) {
							tokenDecimals.set(pool.token_address!, decimals);
						}
					}
					console.log("Decimals for pool:", decimals);

					return decimals
						? sum + pool.total_staked.div(decimals).toNumber()
						: sum;
				}, 0);

				const totalStakers = unifiedPools.reduce(
					(sum, pool) => sum + pool.total_stakers,
					0
				);

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
			}
		);

		return NextResponse.json(
			stringify({
				projects: enrichedProjects,
				total: totalCount,
				page,
				limit,
				totalPages: Math.ceil(totalCount / limit),
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
