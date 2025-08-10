import "@/app/lib/superjson-init";
import { stringify } from "superjson";
import { prismaClient } from "@/app/lib/prisma";
import { Prisma } from "@prisma/client";
import { getTokenInfoFromConfig } from "@/app/utils/chain";
import { ProjectLaunchpoolMetrics } from "@/app/lib/queries/projectLaunchpoolMetrics";
import Decimal from "decimal.js";
import { formatDate } from "@/app/utils/display";

// Add type definitions for raw query results
type TotalTokensResult = {
	total_tokens: number;
};

type DistributedTokensResult = {
	distributed_tokens: number;
};

export async function GET(
	request: Request,
	{ params }: { params: { projectId: string } }
) {
	const projectId = params.projectId;

	try {
		// 1. Get all launchpools for this project
		const projectLaunchpools = await prismaClient.launchpool.findMany({
			where: {
				project_id: projectId,
			},
			include: {
				launchpool_stake: {
					include: {
						user: true,
					},
				},
				launchpool_project_token_claim: {
					include: {
						user: true,
					},
				},
			},
		});

		if (projectLaunchpools.length === 0) {
			return Response.json(
				stringify({
					error: "No launchpools found for this project",
				}),
				{ status: 404 }
			);
		}

		// 2. Calculate current metrics
		const launchpoolIds = projectLaunchpools.map((pool) => pool.id);

		// Total participants (unique users across all pools)
		const uniqueParticipants = await prismaClient.user.count({
			where: {
				launchpool_stake: {
					some: {
						launchpool_id: {
							in: launchpoolIds,
						},
					},
				},
			},
		});

		// Total value locked (sum across all pools)
		const totalValueLocked = projectLaunchpools.reduce(
			(sum, pool) => sum.plus(pool.total_staked),
			new Decimal(0)
		);

		// 3. Calculate additional metrics for stat cards
		const totalLaunchpools = projectLaunchpools.length;

		// Calculate average APR across all launchpools
		const averageApr =
			projectLaunchpools.length > 0
				? projectLaunchpools
						.reduce(
							(sum, pool) => sum.plus(pool.staker_apy),
							new Decimal(0)
						)
						.div(projectLaunchpools.length)
						.toNumber()
				: 0;

		// 4. Query time series data for staked amount progress chart
		// const stakingTimeSeriesData = Array.from({ length: 6 }, (_, i) => {
		// 	const date = new Date();
		// 	date.setMonth(date.getMonth() - (5 - i));
		// 	const baseValue = totalValueLocked.toNumber() * (0.4 + i * 0.12);

		// 	return {
		// 		date: date.toISOString().split("T")[0],
		// 		totalStaked: Math.round(baseValue),
		// 		breakdown: {
		// 			vASTR: Math.round(baseValue * 0.25),
		// 			vDOT: Math.round(baseValue * 0.35),
		// 			vGLMR: Math.round(baseValue * 0.28),
		// 			vKSM: Math.round(baseValue * 0.12),
		// 		},
		// 	};
		// });
		const stakeAmountTimeSeriesRes = await prismaClient.$queryRaw`
		select 
			sum(stakes.amount) as daily_stake_amount,
			DATE(stakes.created_at) as date,
			pools.v_asset_address
		from 
		(
			(select amount, launchpool_id, created_at
			from launchpool_stake
			where launchpool_id in (${Prisma.join(launchpoolIds)})) as stakes
			join
			(select id, project_token_address, v_asset_address
			from launchpool
			where id in (${Prisma.join(launchpoolIds)})
			) as pools
			on stakes.launchpool_id = pools.id
		) 
		group by DATE(stakes.created_at), pools.v_asset_address
		`;

		const dateToStakeAmountMap = new Map<string, any>();
		const vAssetInfoMap = new Map<
			string,
			{ symbol: string; decimals: number }
		>();
		for (const item of stakeAmountTimeSeriesRes as any[]) {
			const { date, v_asset_address, daily_stake_amount } = item;

			let tokenInfo: { symbol: string; decimals: number } | undefined =
				vAssetInfoMap.get(v_asset_address);

			if (!tokenInfo) {
				const { symbol, decimals } =
					getTokenInfoFromConfig(
						projectLaunchpools[0].chain_id,
						v_asset_address
					) || {};
				// If not found symbol or decimals from config, skip this vAsset (should not happen)
				if (!symbol || !decimals) {
					console.warn(
						"Token info not found for vAsset:",
						v_asset_address,
						", skipping..."
					);
					continue;
				}

				// cache for fast access in subsequent iters if available
				tokenInfo = { symbol, decimals };
				vAssetInfoMap.set(v_asset_address, tokenInfo);
			}
			console.log("Found token info:", tokenInfo);

			const stakeRecordOfDate = dateToStakeAmountMap.get(date);
			const dailyStakeAmount = (daily_stake_amount as Decimal)
				.div(Math.pow(10, tokenInfo?.decimals || 0))
				.toNumber();
			console.log(
				`Processing date: ${date}, vAsset: ${v_asset_address}, daily stake amount: ${dailyStakeAmount}`
			);
			if (!stakeRecordOfDate) {
				dateToStakeAmountMap.set(date, {
					date,
					breakdown: {
						[tokenInfo!.symbol]: dailyStakeAmount,
					},
				});
			} else {
				stakeRecordOfDate.breakdown[
					tokenInfo!
						.symbol as keyof typeof stakeRecordOfDate.breakdown
				] = dailyStakeAmount;
			}
		}
		const stakeAmountTimeSeriesData = Array.from(
			dateToStakeAmountMap.values()
		);
		console.log(
			"Stake amount time series data:",
			JSON.stringify(stakeAmountTimeSeriesData, null, 2)
		);

		// 6. Get APR time series data
		// TODO: Calculate from actual launchpool APY data
		// const aprTimeSeriesData = Array.from({ length: 7 }, (_, i) => {
		// 	const date = new Date();
		// 	date.setMonth(date.getMonth() - (6 - i));
		// 	const avgApy = projectLaunchpools
		// 		.reduce(
		// 			(sum, pool) => sum.plus(pool.staker_apy),
		// 			new Decimal(0)
		// 		)
		// 		.div(projectLaunchpools.length);

		// 	return {
		// 		date: date.toISOString().split("T")[0],
		// 		apr: Math.round(avgApy.toNumber() * (0.8 + i * 0.05)),
		// 	};
		// });
		const aprTimeSeriesRes = (await prismaClient.$queryRaw`
			select
				CURRENT_DATE as date,
				COALESCE(AVG(staker_apr), 0) as daily_staker_apr
			from launchpool_project_ex_rate_snapshot 
			group by EXTRACT (MINUTE FROM timestamp);
		`) as { date: string; daily_staker_apr: number }[];

		const aprTimeSeriesData: { dates: string[]; dailyStakerApr: number[] } =
			{ dates: [], dailyStakerApr: [] };

		// Transform raw apr time series data result into structured format for displaying
		aprTimeSeriesRes.forEach(
			(item: { date: string; daily_staker_apr: number }) => {
				aprTimeSeriesData.dates.push(formatDate(item.date));
				aprTimeSeriesData.dailyStakerApr.push(item.daily_staker_apr);
			}
		);
		console.log("APR time series raw data:", aprTimeSeriesRes);

		// 7. vAsset breakdown (mock data - TODO: implement from actual pool data)
		const vAssetBreakdown = [
			{
				asset: "vASTR",
				amount: Math.round(totalValueLocked.toNumber() * 0.25),
			},
			{
				asset: "vDOT",
				amount: Math.round(totalValueLocked.toNumber() * 0.35),
			},
			{
				asset: "vGLMR",
				amount: Math.round(totalValueLocked.toNumber() * 0.28),
			},
			{
				asset: "vKSM",
				amount: Math.round(totalValueLocked.toNumber() * 0.12),
			},
		];

		// 8. Token distribution for donut chart
		const resultTotalTokens = await prismaClient.$queryRaw<
			TotalTokensResult[]
		>`
			SELECT SUM(COALESCE(project_token_amount / POW(10, project_token_decimals),0)) AS total_tokens
			FROM launchpool
			WHERE project_id = ${projectId}
		`;

		const resultDistributedTokens = await prismaClient.$queryRaw<
			DistributedTokensResult[]
		>`
			SELECT SUM(COALESCE(project_token_amount / POW(10, project_token_decimals), 0)) AS distributed_tokens
			FROM launchpool_project_token_claim
			WHERE launchpool_id IN (${launchpoolIds.join(",")})
		`;

		console.log(
			`Total tokens query result: ${JSON.stringify(resultTotalTokens)}`
		);
		console.log(
			`Distributed tokens query result: ${JSON.stringify(resultDistributedTokens)}`
		);

		const totalTokens = new Decimal(
			resultTotalTokens[0]?.total_tokens || 0
		);
		const distributedTokens = new Decimal(
			resultDistributedTokens[0]?.distributed_tokens || 0
		);
		console.log(
			`Total tokens: ${totalTokens.toString()}, Distributed tokens: ${distributedTokens.toString()}`
		);

		const remainingTokens = totalTokens.minus(distributedTokens);

		const response = {
			// StatCard metrics (no growth rates needed)
			totalParticipants: uniqueParticipants,
			totalLaunchpools: totalLaunchpools,
			averageApr: averageApr,

			// Additional metrics for internal use and charts
			totalValueLocked: totalValueLocked.toNumber(),
			tokensDistributed: distributedTokens.toNumber(),

			// Chart data
			stakeAmountTimeSeriesData,
			aprTimeSeriesData,
			vAssetBreakdown,

			// Token distribution
			tokenDistribution: {
				remainingTokens: remainingTokens.toNumber(),
				distributedTokens: distributedTokens.toNumber(),
				totalTokens: totalTokens.toNumber(),
			},
		} as ProjectLaunchpoolMetrics;

		return Response.json(stringify(response));
	} catch (error) {
		console.error("Error fetching project metrics:", error);
		return Response.json(
			stringify({
				error: "Failed to fetch project metrics",
			}),
			{ status: 500 }
		);
	}
}
