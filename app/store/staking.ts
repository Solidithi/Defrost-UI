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
import { AbiEventSignatureEmptyTopicsError, Address } from "viem";
import { normalizeAddress } from "../utils/address";
import { APP_PATH_ROUTES_MANIFEST } from "next/dist/shared/lib/constants";

// Base token information
export interface TokenInfo {
	symbol: string;
	decimals: number;
	address: string;
	// Optional additional fields that might be needed in the future
	name?: string;
	icon?: string;
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

interface LaunchpoolStakingInfo {
	totalVTokenStake: bigint;
	totalNativeStake: bigint;
	yourNativeStake: bigint;
	withdrawableVTokens: bigint;
	yourShare: number; // in percentage
	claimableReward: bigint; // in project token
	updatedAt: number; // timestamp of the last update (milliseconds)

	readTotalNativeStakeStatus: "pending" | "success" | "error";
	readYourNativeStakeStatus: "pending" | "success" | "error";
	readTotalVTokenStakeStatus: "pending" | "success" | "error";
	readWithdrawableVTokensStatus: "pending" | "success" | "error";
	readClaimableRewardStatus: "pending" | "success" | "error";
}

export type StakingInfo = LaunchpoolStakingInfo; // Add more types here |

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
	stakingInfo: Record<string, StakingInfo>; // Mapped by pool.id

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
	getStakingInfo: (poolID: `0x${string}`) => StakingInfo | null;
	setActiveTab: (tab: "all" | "active" | "ended") => void;
	setActiveFilters: (filters: {
		activePoolTypes: PoolType[];
		activeSortOrder: SortOrderType;
	}) => void;
	selectPool: (ID: `0x${string}`, type: PoolType) => void;
	closeDetailsModal: () => void;
	setPools: (pools: EnrichedLaunchpool[]) => void;
	setTokensInfo: (poolID: `0x${string}`, info: PoolTokenInfo) => void;
	setStakingInfo: (poolID: `0x${string}`, info: StakingInfo) => void;
	fetchPools: (userID: `0x${string}`, chainID: number) => Promise<void>;
	fetchPoolsOfProject: (
		projectID: string,
		fetchOptions?: Partial<{
			fetchLaunchpools: boolean;
			fetchFarmPools: boolean;
			fetchLaunchpads: boolean;
			offset: number;
			limit: number;
			// ... more pool types
		}>
	) => Promise<void>;

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
			stakingInfo: {},
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
			getStakingInfo: (poolID: `0x${string}`) => {
				return get().stakingInfo[poolID] || null;
			},
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
			setTokensInfo: (poolID, info) =>
				set({
					tokensInfo: {
						...get().tokensInfo,
						[poolID]: info,
					},
				}),
			setStakingInfo: (poolID: `0x${string}`, info: StakingInfo) => {
				set({
					stakingInfo: {
						...get().stakingInfo,
						[poolID]: info,
					},
				});
			},
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
					console.log("Fetched launchpools:", launchpools);

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
			fetchPoolsOfProject: async (
				projectID: string,
				fetchOptions = {
					fetchLaunchpools: true,
					fetchFarmPools: false,
					fetchLaunchpads: false,
					offset: 0,
					limit: 10,
				}
			) => {
				try {
					if (fetchOptions.fetchLaunchpools) {
						console.log("Fetching launchpool");
						const response = await fetch(
							"/api/project/launchpools?" +
								new URLSearchParams({
									"project-id": projectID,
									offset: (
										fetchOptions?.offset ?? 0
									).toString(),
									limit: (
										fetchOptions?.limit ?? 10
									).toString(),
								}).toString()
						);
						const pools = parse(
							await response.json()
						) as launchpool[];
						const enrichedLaunchpools = pools.map(
							(launchpool: launchpool) =>
								toEnrichedLaunchpool(launchpool)
						);
						console.log("launchpools set");
						set({
							pools: {
								...get().pools,
								launchpools: enrichedLaunchpools,
							},
						});
					}
				} catch (err) {
					console.error("Failed to fetch pools of project:", err);
				}
			},
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
export const useFilteredPoolsMyStaking = () => {
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

export function useFilteredPoolByStakingToken(stakingToken: TokenInfo | null) {
	const { pools } = useStakingStore();

	return useMemo(() => {
		if (!stakingToken) {
			return pools;
		}

		const filteredLaunchpools = pools.launchpools.filter(
			(pool) =>
				pool.v_asset_address?.toLowerCase() ===
				stakingToken.address.toLowerCase()
		);

		return {
			launchpools: filteredLaunchpools,
		};
	}, [pools, stakingToken]);
}

export const useAveragePoolAPYByStakingToken = (
	stakingToken: TokenInfo | null
) => {
	const { pools } = useStakingStore();

	const totalAPY = {
		launchpool: 0,
		// Add other pool types here
	};

	// Calc total APY for launchpools
	pools.launchpools
		.filter((pool) =>
			stakingToken
				? normalizeAddress(pool.v_asset_address as Address) ===
					normalizeAddress(stakingToken?.address as Address)
				: true
		)
		.forEach((pool) => (totalAPY.launchpool += pool.staker_apy.toNumber()));

	return {
		launchpoolAvgAPY:
			totalAPY.launchpool == 0
				? 0
				: totalAPY.launchpool / pools.launchpools.length,
		// Add other pool types here
	};
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
