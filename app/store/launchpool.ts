// import { create } from "zustand";
// import {
// 	ConfirmState,
// 	FormDataType,
// 	PhaseDataType,
// } from "../types/input/create-launchpool";
// import { launchpool } from "@prisma/client";

// type PoolStore = {
// 	projectTokenAddress: string;
// 	setTokenAddress: (value: string) => void;
// 	pool: number[];
// 	// poolData: Record<number, FormDataType>;
// 	poolData: Record<number, FormDataType>;
// 	isConfirming: ConfirmState;
// 	isOpenEmissionRate: boolean;
// 	setPool: (data: number[]) => void;
// 	setPoolData: (data: Record<number, FormDataType>) => void;
// 	updatePoolItem: (id: number, updatedItem: Partial<FormDataType>) => void;
// 	addPool: () => void;
// 	removePool: (id: number) => void;
// 	addPhase: (poolId: number) => void;
// 	removePhase: (poolId: number, phaseId: number) => void;
// 	updatePhase: (
// 		poolId: number,
// 		phaseId: number,
// 		updated: Partial<PhaseDataType>
// 	) => void;
// 	setIsConfirming: (confirm: ConfirmState) => void;
// 	setIsOpenEmissionRate: (open: boolean) => void;
// };

// export const usePoolStore = create<PoolStore>((set, get) => ({
// 	projectTokenAddress: "0x96b6D28DF53641A47be72F44BE8C626bf07365A8",
// 	setTokenAddress: (value) => set({ projectTokenAddress: value }),
// 	pool: [1, 2],
// 	poolData: {
// 		1: {
// 			tokenSupply: 1000,
// 			maxStake: 100,
// 			from: "2025-05-11T00:00:00Z",
// 			to: "2027-01-01T16:59:59Z",
// 			vTokenAddress: "",
// 			vTokenSymbol: "",
// 			phases: [
// 				{
// 					id: 1,
// 					tokenAmount: 200,
// 					from: "2025-05-11T00:00:00Z",
// 					to: "2025-05-31T23:59:59Z",
// 				},
// 				{
// 					id: 2,
// 					tokenAmount: 800,
// 					from: "2025-05-31T23:59:59Z",
// 					to: "2026-01-01T16:59:59Z",
// 				},
// 				{
// 					id: 3,
// 					tokenAmount: 500,
// 					from: "2026-01-01T16:59:59Z",
// 					to: "2027-01-01T16:59:59Z",
// 				},
// 			],
// 		},
// 		2: {
// 			tokenSupply: 1000,
// 			maxStake: 100,
// 			from: "2025-05-11T00:00:00Z",
// 			to: "2027-01-01T16:59:59Z",
// 			vTokenAddress: "",
// 			vTokenSymbol: "",
// 			phases: [
// 				{
// 					id: 1,
// 					tokenAmount: 200,
// 					from: "2025-05-11T00:00:00Z",
// 					to: "2025-05-31T23:59:59Z",
// 				},
// 				{
// 					id: 2,
// 					tokenAmount: 800,
// 					from: "2025-05-31T23:59:59Z",
// 					to: "2026-01-01T16:59:59Z",
// 				},
// 				{
// 					id: 3,
// 					tokenAmount: 500,
// 					from: "2026-01-01T16:59:59Z",
// 					to: "2027-01-01T16:59:59Z",
// 				},
// 			],
// 		},
// 	},
// 	isConfirming: { open: false, id: null, type: null },
// 	isOpenEmissionRate: false,
// 	setPool: (data) => set({ pool: data }),
// 	setPoolData: (data) => set({ poolData: data }),
// 	updatePoolItem: (id, updatedItem) =>
// 		set((state) => ({
// 			poolData: {
// 				...state.poolData,
// 				[id]: { ...state.poolData[id], ...updatedItem },
// 			},
// 		})),
// 	addPool: () => {
// 		const id = Date.now();
// 		const state = get();
// 		set({
// 			pool: [...state.pool, id],
// 			poolData: {
// 				...state.poolData,
// 				[id]: {
// 					vTokenAddress: "",
// 					vTokenSymbol: "",
// 					tokenSupply: 0,
// 					maxStake: 0,
// 					from: "",
// 					to: "",
// 					phases: [],
// 				},
// 			},
// 		});
// 	},
// 	removePool: (id) => {
// 		const state = get();
// 		const { [id]: _, ...rest } = state.poolData;
// 		set({
// 			pool: state.pool.filter((p) => p !== id),
// 			poolData: rest,
// 		});
// 	},

// 	addPhase: (poolId) =>
// 		set((state) => {
// 			const pool = state.poolData[poolId];
// 			if (!pool) return {};
// 			const newPhase: PhaseDataType = {
// 				id: Date.now(),
// 				tokenAmount: 0,
// 				// from: Object.keys(state.poolData).length < 1 ? state.poolData[poolId].from : ,
// 				from:
// 					pool.phases.length < 1
// 						? pool.from
// 						: pool.phases.slice(-1)[0].to,
// 				to: "",
// 			};
// 			return {
// 				poolData: {
// 					...state.poolData,
// 					[poolId]: {
// 						...pool,
// 						phases: [...pool.phases, newPhase],
// 					},
// 				},
// 			};
// 		}),
// 	removePhase: (poolId, phaseId) =>
// 		set((state) => {
// 			const pool = state.poolData[poolId];
// 			if (!pool) return {};
// 			return {
// 				poolData: {
// 					...state.poolData,
// 					[poolId]: {
// 						...pool,
// 						phases: pool.phases.filter((p) => p.id !== phaseId),
// 					},
// 				},
// 			};
// 		}),
// 	updatePhase: (poolId, phaseId, updated) =>
// 		set((state) => {
// 			const pool = state.poolData[poolId];
// 			if (!pool) return {};
// 			return {
// 				poolData: {
// 					...state.poolData,
// 					[poolId]: {
// 						...pool,
// 						phases: pool.phases.map((p) =>
// 							p.id === phaseId ? { ...p, ...updated } : p
// 						),
// 					},
// 				},
// 			};
// 		}),
// 	setIsConfirming: (confirm) => set({ isConfirming: confirm }),
// 	setIsOpenEmissionRate: (open) => set({ isOpenEmissionRate: open }),
// }));
// export const useHoverSideBarIndexStore = create<{
// 	hoveredData: number | null;
// 	setHoveredData: (data: number | null) => void;
// }>((set) => ({
// 	hoveredData: null,
// 	setHoveredData: (data) => set({ hoveredData: data }),
// }));
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
	PhaseDataType,
	PoolDataType,
	ProjectTokenMetadata,
} from "../types/input/create-launchpool";

// interface PhaseDataType {
// 	id: number;
// 	tokenAmount: number;
// 	from: string;
// 	to: string;
// }

// interface PoolDataType {
// 	vTokenAddress: string;
// 	vTokenSymbol: string;
// 	tokenSupply: number;
// 	maxStake: number;
// 	from: string;
// 	to: string;
// 	launchpools: launchpool[];
// 	phases: PhaseDataType[];
// }

// interface LaunchpoolData {
// 	projectId: string;
// 	projectTokenAddress: string;
// 	pools: string[];
// 	poolData: PoolDataType;
// }

interface PoolStore {
	// Pool data
	projectTokenAddress: string;
	projectTokenMetadata: null | ProjectTokenMetadata;
	pool: string[]; // list of pool IDs
	poolData: Record<string, PoolDataType>; // Changed from PoolDataType[] to Record<string, PoolDataType>
	lastFetchedTime: number | null;

	// Loading states
	isLoading: boolean;
	error: string | null;

	// Confirmation states
	isConfirming: { open: boolean; id: string | null; type: string | null };
	isOpenEmissionRate: boolean;

	// Basic actions
	setTokenAddress: (value: string) => void;
	setProjectTokenMetadata: (metadata: ProjectTokenMetadata) => void;
	setPool: (data: string[]) => void;
	setPoolData: (data: Record<string, PoolDataType>) => void; // Updated parameter type
	setIsConfirming: (confirm: {
		open: boolean;
		id: string | null;
		type: string | null;
	}) => void;
	setIsOpenEmissionRate: (open: boolean) => void;

	// Pool management actions
	updatePoolItem: (id: string, updatedItem: Partial<PoolDataType>) => void;
	addPool: () => void;
	removePool: (id: string) => void;

	// Phase management actions
	addPhase: (poolId: string) => void;
	removePhase: (poolId: string, phaseId: number) => void;
	updatePhase: (
		poolId: string,
		phaseId: number,
		updated: Partial<PhaseDataType>
	) => void;

	// API actions
	fetchLaunchpoolData: (
		projectId: string,
		forceRefresh?: boolean
	) => Promise<void>;
	clearLaunchpoolData: () => void;
	setIsLoading: (isLoading: boolean) => void;

	// Temp data initialization
	// initializeTempData: () => void;
}

// Temp data based on API response
// const tempPoolData: PoolDataType = {
// 	vTokenAddress: "0xFixedTokenAddress123",
// 	vTokenSymbol: "vFIXED",
// 	tokenSupply: 1000000,
// 	maxStake: 50000,
// 	from: "2025-01-01T00:00:00.000Z",
// 	to: "2025-12-31T23:59:59.999Z",
// 	launchpools: [],
// 	phases: [],
// };

// const tempPoolIds = Object.keys(tempPoolData);

export const usePoolStore = create<PoolStore>()(
	persist(
		(set, get) => ({
			// Initial state
			projectTokenAddress: "0x96b6d28df53641a47be72f44be8c626bf07365a8",
			projectTokenMetadata: null,
			pool: [],
			poolData: {}, // Changed from [] to {}
			lastFetchedTime: null,
			isLoading: false,
			error: null,
			isConfirming: { open: false, id: null, type: null },
			isOpenEmissionRate: false,

			// Basic setters
			setTokenAddress: (value) => set({ projectTokenAddress: value }),
			setProjectTokenMetadata: (metadata) => {
				console.log("Setting project token metadata:", metadata);
				set({ projectTokenMetadata: metadata });
			},
			setPool: (data) => set({ pool: data }),
			setPoolData: (data) => set({ poolData: data }), // Removed Object.values() wrapper
			setIsConfirming: (confirm) => set({ isConfirming: confirm }),
			setIsOpenEmissionRate: (open) => set({ isOpenEmissionRate: open }),
			setIsLoading: (isLoading) => set({ isLoading }),

			// Initialize temp data
			// initializeTempData: () => {
			// 	set({
			// 		pool: tempPoolIds,
			// 		poolData: { tempPoolId: tempPoolData },
			// 		lastFetchedTime: Date.now(),
			// 	});
			// },

			// API actions
			fetchLaunchpoolData: async (projectId, forceRefresh = false) => {
				const state = get();
				const now = Date.now();
				const MAX_CACHE_AGE_MS = 5 * 60 * 1000; // 5 minutes

				// Skip fetching if data is still fresh and force refresh is not requested
				if (
					!forceRefresh &&
					state.lastFetchedTime &&
					now - state.lastFetchedTime < MAX_CACHE_AGE_MS
				) {
					return;
				}

				set({ isLoading: true, error: null });

				try {
					const response = await fetch(
						`/api/project/launchpools/?${new URLSearchParams({
							"project-id": projectId,
						}).toString()}`
					);

					if (!response.ok) {
						throw new Error(
							`Failed to fetch launchpool data: ${response.statusText}`
						);
					}

					const data: { message: string; launchpools: any[] } =
						await response.json();

					// Transform API data to match store structure
					const transformedPoolData: Record<string, PoolDataType> =
						{};
					const poolIds: string[] = [];

					data.launchpools.forEach((launchpool) => {
						const poolId = launchpool.id;
						poolIds.push(poolId);

						transformedPoolData[poolId] = {
							vTokenAddress: launchpool.v_asset_address,
							vTokenSymbol: "vTOKEN", // Default, should be fetched from contract
							tokenSupply:
								Math.floor(Math.random() * 2000000) + 500000, // Temp random value
							maxStake:
								Math.floor(Math.random() * 100000) + 25000, // Temp random value
							from: launchpool.start_date,
							to: launchpool.end_date,
							launchpools: launchpool,
							phases: [],
						};
					});

					set({
						projectTokenAddress:
							data.launchpools[0]?.project_token_address ||
							state.projectTokenAddress,
						pool: poolIds,
						poolData: transformedPoolData, // Changed from Object.values() to the record itself
						lastFetchedTime: now,
						isLoading: false,
						error: null,
					});
				} catch (error) {
					console.error("Error fetching launchpool data:", error);
					set({
						error:
							error instanceof Error
								? error.message
								: "Unknown error fetching launchpool data",
						isLoading: false,
					});
				}
			},

			clearLaunchpoolData: () => {
				set({
					projectTokenAddress: "",
					pool: [],
					poolData: {}, // Changed from [] to {}
					lastFetchedTime: null,
					error: null,
					isConfirming: { open: false, id: null, type: null },
					isOpenEmissionRate: false,
				});
			},

			// Pool management
			updatePoolItem: (id, updatedItem) =>
				set((state) => ({
					poolData: {
						...state.poolData,
						[id]: { ...state.poolData[id], ...updatedItem },
					},
				})),

			addPool: () => {
				const id = `0x${Date.now().toString(16)}${Math.random().toString(16).slice(2, 8)}`;
				const state = get();
				set({
					pool: [...state.pool, id],
					poolData: {
						...state.poolData,
						[id]: {
							vTokenAddress: "",
							vTokenSymbol: "",
							tokenSupply: 0,
							maxStake: 0,
							from: "",
							to: "",
							launchpools: [],
							phases: [],
						},
					},
				});
			},

			// removePool now works correctly with the record type
			removePool: (id) => {
				const state = get();
				const { [id]: _, ...rest } = state.poolData;
				set({
					pool: state.pool.filter((p) => p !== id),
					poolData: rest,
				});
			},

			// Phase management
			addPhase: (poolId) =>
				set((state) => {
					const pool = state.poolData[poolId];
					if (!pool) return {};
					const newPhase: PhaseDataType = {
						id: Date.now(),
						tokenAmount: 0,
						from:
							pool.phases.length < 1
								? pool.from
								: pool.phases.slice(-1)[0].to,
						to: "",
					};
					return {
						poolData: {
							...state.poolData,
							[poolId]: {
								...pool,
								phases: [...pool.phases, newPhase],
							},
						},
					};
				}),

			removePhase: (poolId, phaseId) =>
				set((state) => {
					const pool = state.poolData[poolId];
					if (!pool) return {};
					return {
						poolData: {
							...state.poolData,
							[poolId]: {
								...pool,
								phases: pool.phases.filter(
									(p) => p.id !== phaseId
								),
							},
						},
					};
				}),

			updatePhase: (poolId, phaseId, updated) =>
				set((state) => {
					const pool = state.poolData[poolId];
					if (!pool) return {};
					return {
						poolData: {
							...state.poolData,
							[poolId]: {
								...pool,
								phases: pool.phases.map((p) =>
									p.id === phaseId ? { ...p, ...updated } : p
								),
							},
						},
					};
				}),
		}),
		{
			name: "launchpool-storage",
			partialize: (state) => ({
				projectTokenAddress: state.projectTokenAddress,
				pool: state.pool,
				poolData: state.poolData,
				lastFetchedTime: state.lastFetchedTime,
				// Don't persist loading states and UI states
			}),
		}
	)
);
export const useHoverSideBarIndexStore = create<{
	hoveredData: number | null;
	setHoveredData: (data: number | null) => void;
}>((set) => ({
	hoveredData: null,
	setHoveredData: (data) => set({ hoveredData: data }),
}));

export const useStakeAreaStore = create<{
	stakeAmount: number;
	setStakeAmount: (amount: number) => void;
}>((set) => ({
	stakeAmount: 0,
	setStakeAmount: (amount) => set({ stakeAmount: amount }),
}));
