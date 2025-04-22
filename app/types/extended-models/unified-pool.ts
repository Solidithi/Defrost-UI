import { launchpool } from "@prisma/client";

// // Define a common pool interface that works across different pool types
// export interface IPoolBase {
// 	id: string;
// 	pool_id: string;
// 	project_id: string;
// 	total_staked: any; // Using any since it could be Decimal or BigInt
// 	total_stakers: number;
// 	start_date: Date;
// 	end_date: Date;
// 	staker_apy: any; // Using any since it could be Decimal or number
// 	type?: "launchpool" | "farmpool" | "launchpad"; // Add pool type identifier
// }

// Unified pool representation for UI rendering
export interface UnifiedPool {
	id: string;
	pool_id: string;
	project_id: string;
	type: "launchpool" | "farmpool" | "launchpad";
	total_staked: string;
	total_stakers: number;
	staker_apy: number;
	start_date: Date;
	end_date: Date;
	duration: number;
	token_address?: string;
	token_symbol?: string;
	description?: string;
	project_token_address?: string;
}

// Define specific pool interfaces for each pool type
export type LaunchpoolType = launchpool & { type: "launchpool" };
// export type FarmpoolType = farmpool & { type: "farmpool" };
// export type LaunchpadType = launchpad & { type: "launchpad" };

// Define a union type for all pool types
// export type PoolType = LaunchpoolType | FarmpoolType | LaunchpadType;
export type PoolType = LaunchpoolType;

// Helper to convert all pool types to UnifiedPool format
export function toUnifiedPool(
	pool: any,
	type: "launchpool" | "farmpool" | "launchpad"
): UnifiedPool {
	// Calculate duration in days
	const start = new Date(pool.start_date);
	const end = new Date(pool.end_date);
	const durationMs = end.getTime() - start.getTime();
	const durationDays = Math.ceil(durationMs / (1000 * 60 * 60 * 24));

	return {
		id: pool.id,
		pool_id: pool.pool_id,
		project_id: pool.project_id,
		type: type,
		total_staked: pool.total_staked?.toString() || "0",
		total_stakers: pool.total_stakers || 0,
		staker_apy:
			typeof pool.staker_apy === "object"
				? parseFloat(pool.staker_apy.toString())
				: pool.staker_apy || 0,
		start_date: start,
		end_date: end,
		duration: durationDays,
		token_address: pool.native_asset_address || pool.token_address,
		token_symbol: pool.token_symbol,
		project_token_address: pool.project_token_address,
		description: pool.description || "",
	};
}

export function isPoolActive(pool: UnifiedPool | launchpool): boolean {
	const now = new Date();
	return pool.start_date <= now && pool.end_date >= now;
}

export function calcPoolsAvgApy(pools: UnifiedPool[]): number {
	if (pools.length === 0) return 0;

	let poolsWithApyCount = 0;
	const avgApy =
		pools.reduce((sum, pool) => {
			if (pool.staker_apy > 0) {
				poolsWithApyCount++;
			}
			return sum + pool.staker_apy;
		}, 0) / poolsWithApyCount;

	return avgApy;
}
