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
	const projectOwnerAddress = searchParams.get(
		"projectOwnerAddress"
	) as Address;
	const chainID = parseInt(searchParams.get("chainID") || "1", 10);

	const page = parseInt(searchParams.get("page") || "1", 10);
	const limit = parseInt(searchParams.get("limit") || "10", 10);

	if (!projectOwnerAddress) {
		return Response.json({ error: "Address is required" }, { status: 400 });
	}

	try {
		const where = {
			owner_id: normalizeAddress(projectOwnerAddress),
		};

		// Get total count for pagination
		const total = await prismaClient.project.count({ where });

		// Fetch paginated projects with all potential pool types
		const projects = await prismaClient.project.findMany({
			where,
			include: {
				launchpool: {
					where: {
						start_date: { lte: new Date() },
						end_date: { gte: new Date() },
					},
				},
				// farmpool: true,
				// launchpad: true,
			},
			skip: (page - 1) * limit,
			take: limit,
			orderBy: { id: "desc" },
		});

		const enrichedProjects = projects.map((project) => {
			const enrichedLaunchpools: EnrichedLaunchpool[] = [];
			const unifiedPools: UnifiedPool[] = [];

			if (project.launchpool?.length) {
				project.launchpool.forEach((pool) => {
					const enrichedPool = toEnrichedLaunchpool(pool);
					enrichedLaunchpools.push(enrichedPool);
					unifiedPools.push(
						toUnifiedPool(pool, "launchpool", chainID)
					);
				});
			}

			const tokenDecimals = new Map<string, number>();
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

			const avgApy = calcPoolsAvgApy(unifiedPools);

			const tokenAddress =
				project.token_address ||
				(unifiedPools.length > 0
					? unifiedPools[0].reward_token_address
					: undefined);

			return {
				...project,
				launchpools: enrichedLaunchpools,
				unifiedPools,
				avgApy,
				tokenAddress,
				totalStaked,
				poolCount: unifiedPools.length,
				totalStakers,
			} as EnrichedProject;
		});

		const totalPages = Math.ceil(total / limit);

		return Response.json(
			stringify({
				projects: enrichedProjects,
				total,
				page,
				limit,
				totalPages,
			})
		);
	} catch (error) {
		console.error("Error fetching projects:", error);
		return Response.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 }
		);
	}
}
