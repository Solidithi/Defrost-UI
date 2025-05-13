import { create } from "zustand";
import { persist } from "zustand/middleware";
import Decimal from "decimal.js";
import {
	EnrichedLaunchpool,
	LaunchpoolStatus,
	toEnrichedLaunchpool,
} from "../types/extended-models/enriched-launchpool";
import { PoolType } from "../types/extended-models/generic-pool";
import { SortOrderType } from "../components/UI/filter/StakingFilter";
import { formatTokenAmount } from "../utils/display";
import { launchpool } from "@prisma/client";
import { parse } from "superjson";
import { useMemo } from "react";

// Base token information
interface TokenInfo {
	symbol: string;
	decimals: number;
	address: string;
	// Optional additional fields that might be needed in the future
	name?: string;
	logo?: string;
	price?: Decimal;
}

// Generic interface for all pool token configurations
interface BaseTokensInfo {
	poolType: PoolType;
	// Every pool will have a reward token
	rewardTokens: TokenInfo[];
}

// Specific token info for launchpool-type pools
export interface LaunchpoolTokenInfo extends BaseTokensInfo {
	poolType: "launchpool";
	vTokenInfo: TokenInfo;
	nativeTokenInfo: TokenInfo;
	projectTokenInfo: TokenInfo;
}

// Specific token info for farm-type pools
export interface FarmTokenInfo extends BaseTokensInfo {
	poolType: "farm";
	// Farm pools can have multiple deposit tokens
	depositTokens: TokenInfo[];
	// Farm pools can have LP token
	lpTokenInfo?: TokenInfo;
}

// Union type for all possible token info configurations
export type PoolTokenInfo =
	| LaunchpoolTokenInfo
	| FarmTokenInfo
	| BaseTokensInfo;

interface UserPoolStaking {
	formattedClaimableRewards: number;
}

type StakingStore = {
	// Pool data
	pools: {
		launchpools: EnrichedLaunchpool[];
		// Add other pool types here when needed, like farms
		// farms: EnrichedFarm[];
	};
	isLoading: boolean;

	// Token information for all pools - using discriminated union type
	tokensInfo: Record<string, PoolTokenInfo>; // Mapped by pool.id

	userStakingData: Record<string, UserPoolStaking>; // Mapped by pool.id

	// UI state
	activeTab: "all" | "active" | "ended";
	activeFilters: {
		activePoolTypes: PoolType[];
		activeSortOrder: SortOrderType;
	};
	selectedPoolId: string | null;
	selectedPoolType: PoolType | null;
	showDetailsModal: boolean;

	// Actions
	setActiveTab: (tab: "all" | "active" | "ended") => void;
	setActiveFilters: (filters: {
		activePoolTypes: PoolType[];
		activeSortOrder: SortOrderType;
	}) => void;
	selectPool: (id: string, type: PoolType) => void;
	closeDetailsModal: () => void;
	setPools: (pools: EnrichedLaunchpool[]) => void;
	setTokensInfo: (poolId: string, info: PoolTokenInfo) => void;
	fetchPools: (userID: `0x${string}`, chainID: number) => Promise<void>;

	setPoolClaimableRewardsFormatted: (
		poolAddress: string,
		formattedAmount: number
	) => void;
};

export const useStakingStore = create<StakingStore>()(
	persist(
		(set, get) => ({
			// Initial state
			pools: {
				launchpools: [],
			},
			isLoading: false,
			tokensInfo: {},
			activeTab: "all",
			activeFilters: {
				activePoolTypes: ["launchpool"],
				activeSortOrder: "Highest APY",
			},
			selectedPoolId: null,
			selectedPoolType: null,
			showDetailsModal: false,
			userStakingData: {},

			// Actions
			setActiveTab: (tab) => set({ activeTab: tab }),
			setActiveFilters: (filters) => set({ activeFilters: filters }),
			selectPool: (id, type) =>
				set({
					selectedPoolId: id,
					selectedPoolType: type,
					showDetailsModal: true,
				}),
			closeDetailsModal: () => set({ showDetailsModal: false }),
			setPools: (launchpools) =>
				set({
					pools: {
						...get().pools,
						launchpools,
					},
				}),
			setTokensInfo: (poolId, info) =>
				set({
					tokensInfo: {
						...get().tokensInfo,
						[poolId]: info,
					},
				}),

			fetchPools: async (userID: `0x${string}`, chainID: number) => {
				set({ isLoading: true });
				try {
					const response = await fetch(
						"/api/my-staking?" +
							new URLSearchParams({
								"user-id": userID,
								"chain-id": chainID.toString(),
							}).toString()
					);
					const data = await response.json();
					const { launchpools } = parse(data) as Record<string, any>;

					const enrichedLaunchpools = launchpools.map(
						(launchpool: launchpool) =>
							toEnrichedLaunchpool(launchpool)
					);

					set({
						pools: {
							...get().pools,
							launchpools: enrichedLaunchpools,
						},
					});
				} catch (err) {
					console.error("Failed to fetch pools:", err);
					set({ isLoading: false });
				} finally {
					set({ isLoading: false });
				}
			},

			// fetchPools: async () => {
			// 	set({ isLoading: true });
			// 	try {
			// 		// Simulating API call - replace with your actual data fetching
			// 		// const response = await fetch('/api/pools')
			// 		// const launchpools = await response.json()
			// 		await new Promise((resolve) => setTimeout(resolve, 2000));

			// 		// For now, use mock data
			// 		const launchpools: EnrichedLaunchpool[] = Array(6)
			// 			.fill(0)
			// 			.map((_, index) => ({
			// 				id:
			// 					index < 3
			// 						? `0xfbe66a07021d7cf5bd89486abe9690421dcc649b`
			// 						: "0x",
			// 				pool_id: `{index}`,
			// 				project_id: "dot-staking",
			// 				tx_hash: "0x123abc",
			// 				chain_id: 1287,
			// 				type: "launchpool",
			// 				name: "vDOT Flexible Staking",
			// 				description:
			// 					"Liquid staking for Polkadot with flexible redemption",
			// 				image: "/placeholder.svg?height=200&width=200",
			// 				staker_apy: new Decimal(245837.23),
			// 				durationSeconds: 30 * 86400,
			// 				v_asset_address:
			// 					"0xd02d73e05b002cb8eb7bef9df8ed68ed39752465",
			// 				native_asset_address:
			// 					"0x7a4ebae8ca815b9f52f23a8ac9a2f707d4d4ff81",
			// 				total_staked: new Decimal(1068 * 10 ** 18),
			// 				status: "active" as LaunchpoolStatus,
			// 				start_date: new Date(Date.now() / 1000 - 86400), // Yesterday
			// 				end_date: new Date(Date.now() / 1000 + 29 * 86400), // 29 days from now
			// 				created_at: new Date(Date.now() / 1000 - 86400), // Yesterday
			// 				updated_at: new Date(Date.now() / 1000 - 86400), // Yesterday
			// 				project_token_address:
			// 					"0x96b6D28DF53641A47be72F44BE8C626bf07365A8",
			// 				// Adding missing properties from EnrichedLaunchpool
			// 				start_block: new Decimal(1000000),
			// 				end_block: new Decimal(2000000),
			// 				total_stakers: 250,
			// 				owner_apy: new Decimal(10.5),
			// 				combined_apy: new Decimal(255837.23),
			// 				platform_apy: new Decimal(0.5),
			// 			}));
			// 		set({
			// 			pools: {
			// 				...get().pools,
			// 				launchpools,
			// 			},
			// 			isLoading: false,
			// 		});
			// 	} catch (error) {
			// 		console.error("Failed to fetch pools:", error);
			// 		set({ isLoading: false });
			// 	}
			// },
			setPoolClaimableRewardsFormatted: (
				poolAddress: string,
				amount: number
			) =>
				set((state) => ({
					userStakingData: {
						...state.userStakingData,
						[poolAddress]: {
							...state.userStakingData[poolAddress],
							formattedClaimableRewards: amount,
						},
					},
				})),
		}),
		{
			name: "staking-store",
			// Only persist certain parts of the state
			partialize: (state) => ({
				activeTab: state.activeTab,
				activeFilters: state.activeFilters,
				// Don't persist pools data or modals state
			}),
		}
	)
);

// Selector functions for derived data
export const useFilteredPools = () => {
	const pools = useStakingStore((state) => state.pools);
	const activeTab = useStakingStore((state) => state.activeTab);
	const activePoolTypes = useStakingStore(
		(state) => state.activeFilters.activePoolTypes
	);
	const activeSortOrder = useStakingStore(
		(state) => state.activeFilters.activeSortOrder
	);

	// Using primitive dependencies instead of objects for better performance
	return useMemo(() => {
		console.log("Filter recalculating...");
		console.log("Active tab:", activeTab);
		console.log("Active pool types:", activePoolTypes);

		// Filter by status and type
		const filteredLaunchpools = pools.launchpools.filter((pool) => {
			// Status filtering
			if (activeTab === "all") return true;

			if (pool.status !== activeTab) return false;

			// Type filtering
			return activePoolTypes.includes("launchpool");
		});

		// Sort the filtered pools
		const sortedLaunchpools = [...filteredLaunchpools].sort((a, b) => {
			switch (activeSortOrder) {
				case "Highest APY":
					return b.staker_apy.minus(a.staker_apy).toNumber();
				case "Lowest APY":
					return a.staker_apy.minus(b.staker_apy).toNumber();
				case "Recently Added":
					return (
						new Date(b.created_at).getTime() -
						new Date(a.created_at).getTime()
					);
				case "Ending Soon":
					return (
						new Date(a.created_at).getTime() -
						new Date(b.created_at).getTime()
					);
				default:
					return 0;
			}
		});

		console.log("Filtered and sorted pools:", sortedLaunchpools);

		return {
			launchpools: sortedLaunchpools,
		};
	}, [pools.launchpools, activeTab, activePoolTypes, activeSortOrder]);
};

export const useSelectedPool = () => {
	const { pools, selectedPoolId, selectedPoolType } = useStakingStore();

	if (!selectedPoolId || !selectedPoolType) return null;

	switch (selectedPoolType) {
		case "launchpool":
			return (
				pools.launchpools.find((pool) => pool.id === selectedPoolId) ||
				null
			);
		// Add other pool types here when needed
		default:
			return null;
	}
};

export const useSelectedPoolTokensInfo = () => {
	const { tokensInfo, selectedPoolId } = useStakingStore();

	if (!selectedPoolId) return null;

	return tokensInfo[selectedPoolId];
};

export const useTotalClaimableRewardsFormatted = () => {
	const { userStakingData } = useStakingStore();

	let total = 0;
	for (const data of Object.values(userStakingData)) {
		if (data.formattedClaimableRewards) {
			total += data.formattedClaimableRewards;
		}
	}

	return formatTokenAmount(total, {
		maxDecimals: 6,
	});
};
