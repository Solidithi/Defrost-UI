import { NextResponse } from "next/server";
import { prismaClient } from "@/app/lib/prisma";
import {
	toUnifiedPool,
	UnifiedPool,
	EnrichedProject,
	calcPoolsAvgApy,
} from "@/app/types";
import { calcGeneratorDuration } from "framer-motion";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const address = searchParams.get("address");

	if (!address) {
		return NextResponse.json(
			{ error: "Address is required" },
			{ status: 400 }
		);
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

		// Transform projects to include unified pools
		const enrichedProjects = projects.map((project) => {
			// Convert all pool types to unified format
			const unifiedPools: UnifiedPool[] = [];

			// Add launchpools to unified pools
			if (project.launchpool?.length) {
				project.launchpool.forEach((pool) => {
					unifiedPools.push(toUnifiedPool(pool, "launchpool"));
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
			const totalStaked = unifiedPools.reduce(
				(sum, pool) => sum + parseFloat(pool.total_staked.toString()),
				0
			);

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
					? unifiedPools[0].project_token_address
					: undefined);

			// Create enriched project with all needed metrics
			return {
				...project,
				unifiedPools,
				avgApy,
				tokenAddress,
				totalStaked,
				poolCount: unifiedPools.length,
				totalStakers,
			} as EnrichedProject;
		});

		return NextResponse.json({ projects: enrichedProjects });
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{ error: "Failed to fetch projects" },
			{ status: 500 }
		);
	}
}
