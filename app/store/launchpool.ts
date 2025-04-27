// import { create } from "zustand";
// import {
// 	ConfirmState,
// 	FormDataType,
// 	PhaseDataType,
// } from "../types/input/create-launchpool";

// type PoolStore = {
// 	tokenAddress: string;
// 	setTokenAddress: (value: string) => void;

// 	pool: number[];
// 	poolData: FormDataType[];
// 	phase: number[];
// 	phaseData: PhaseDataType[];
// 	isConfirming: ConfirmState;
// 	isOpenEmissionRate: boolean;

// 	setPool: (data: number[]) => void;
// 	setPoolData: (data: FormDataType[]) => void;
// 	updatePoolItem: (index: number, updatedItem: Partial<FormDataType>) => void;
// 	addPool: () => void;
// 	removePool: (id: number) => void;

// 	setPhase: (data: number[]) => void;
// 	setPhaseData: (data: PhaseDataType[]) => void;
// 	updatePhaseItem: (
// 		index: number,
// 		updatedItem: Partial<PhaseDataType>
// 	) => void;
// 	addPhase: () => void;
// 	removePhase: (id: number) => void;

// 	setIsConfirming: (confirm: ConfirmState) => void;
// 	setIsOpenEmissionRate: (open: boolean) => void;
// };

// export const usePoolStore = create<PoolStore>((set, get) => ({
// 	// Token address
// 	tokenAddress: "0x1234567890abcdef", // example token address
// 	setTokenAddress: (value) => set({ tokenAddress: value }),

// 	// Pool/Phase states with hardcoded data
// 	pool: [1],
// 	poolData: [
// 		{
// 			chain: "Ethereum",
// 			token: "ETH",
// 			tokenSupply: 1000000,
// 			maxStake: 50000,
// 			from: "2025-01-01T00:00:00Z", // Thời gian bắt đầu của pool
// 			to: "2025-12-31T23:59:59Z", // Thời gian kết thúc của pool
// 		},
// 	],
// 	phase: [1, 2, 3], // Ensure Phase 1 is included
// 	phaseData: [
// 		{
// 			emissionRate: 20, // 20% for Phase 1
// 			from: "2025-01-01T00:00:00Z", // Trùng với thời gian bắt đầu của pool
// 			to: "2025-06-30T23:59:59Z", // Kết thúc phase 1
// 		},
// 		{
// 			emissionRate: 30, // 30% for Phase 2
// 			from: "2025-06-30T23:59:59Z", // Nối tiếp từ phase 1
// 			to: "2025-09-30T23:59:59Z", // Kết thúc phase 2
// 		},
// 		{
// 			emissionRate: 40, // 40% for Phase 3
// 			from: "2025-09-30T23:59:59Z", // Nối tiếp từ phase 2
// 			to: "2025-11-30T23:59:59Z", // Kết thúc phase 3
// 		},
// 	],

// 	isConfirming: { open: false, id: null, type: null },
// 	isOpenEmissionRate: false,

// 	setPool: (data) => set({ pool: data }),
// 	setPoolData: (data) => set({ poolData: data }),

// 	updatePoolItem: (index, updatedItem) =>
// 		set((state) => ({
// 			poolData: state.poolData.map((item, i) =>
// 				i === index ? { ...item, ...updatedItem } : item
// 			),
// 		})),

// 	addPool: () => {
// 		const id = Date.now();
// 		set((state) => ({
// 			pool: [...state.pool, id],
// 			poolData: [
// 				...state.poolData,
// 				{
// 					chain: "",
// 					token: "",
// 					tokenSupply: 0,
// 					maxStake: 0,
// 					from: "",
// 					to: "",
// 				},
// 			],
// 		}));
// 	},

// 	removePool: (id) => {
// 		const state = get();
// 		const index = state.pool.findIndex((p) => p === id);
// 		set({
// 			pool: state.pool.filter((p) => p !== id),
// 			poolData: state.poolData.filter((_, i) => i !== index),
// 		});
// 	},

// 	setPhase: (data) => set({ phase: data }),
// 	setPhaseData: (data) => set({ phaseData: data }),

// 	updatePhaseItem: (index, updatedItem) =>
// 		set((state) => ({
// 			phaseData: state.phaseData.map((item, i) =>
// 				i === index ? { ...item, ...updatedItem } : item
// 			),
// 		})),

// 	addPhase: () => {
// 		const state = get();
// 		if (state.phase.length >= 3) return;
// 		const id = Date.now();
// 		set({
// 			phase: [...state.phase, id],
// 			phaseData: [
// 				...state.phaseData,
// 				{ emissionRate: 0, from: "", to: "" },
// 			],
// 		});
// 	},

// 	removePhase: (id) => {
// 		const state = get();
// 		const index = state.phase.findIndex((p) => p === id);
// 		set({
// 			phase: state.phase.filter((p) => p !== id),
// 			phaseData: state.phaseData.filter((_, i) => i !== index),
// 		});
// 	},

// 	setIsConfirming: (confirm) => set({ isConfirming: confirm }),
// 	setIsOpenEmissionRate: (open) => set({ isOpenEmissionRate: open }),
// }));

import { create } from "zustand";
import {
	ConfirmState,
	FormDataType,
	PhaseDataType,
} from "../types/input/create-launchpool";

type PoolStore = {
	tokenAddress: string;
	setTokenAddress: (value: string) => void;

	pool: number[];
	poolData: FormDataType[];
	phase: number[];
	phaseData: PhaseDataType[];
	isConfirming: ConfirmState;
	isOpenEmissionRate: boolean;

	setPool: (data: number[]) => void;
	setPoolData: (data: FormDataType[]) => void;
	updatePoolItem: (index: number, updatedItem: Partial<FormDataType>) => void;
	addPool: () => void;
	removePool: (id: number) => void;

	setPhase: (data: number[]) => void;
	setPhaseData: (data: PhaseDataType[]) => void;
	updatePhaseItem: (
		index: number,
		updatedItem: Partial<PhaseDataType>
	) => void;
	addPhase: () => void;
	removePhase: (id: number) => void;

	setIsConfirming: (confirm: ConfirmState) => void;
	setIsOpenEmissionRate: (open: boolean) => void;
};

export const usePoolStore = create<PoolStore>((set, get) => ({
	// Token address
	tokenAddress: "",
	setTokenAddress: (value) => set({ tokenAddress: value }),

	// Pool/Phase states
	pool: [],
	poolData: [],
	phase: [],
	phaseData: [],
	isConfirming: { open: false, id: null, type: null },
	isOpenEmissionRate: false,

	setPool: (data) => set({ pool: data }),
	setPoolData: (data) => set({ poolData: data }),

	updatePoolItem: (index, updatedItem) =>
		set((state) => ({
			poolData: state.poolData.map((item, i) =>
				i === index
					? {
							...item,
							...updatedItem,
							tokenSupply: updatedItem.tokenSupply
								? Number(updatedItem.tokenSupply)
								: item.tokenSupply, // Đảm bảo giá trị tokenSupply chỉ thay đổi khi có dữ liệu mới
							from: updatedItem.from
								? new Date(updatedItem.from).toISOString()
								: item.from,
							to: updatedItem.to
								? new Date(updatedItem.to).toISOString()
								: item.to,
						}
					: item
			),
		})),

	addPool: () => {
		const id = Date.now();
		set((state) => ({
			pool: [...state.pool, id],
			poolData: [
				...state.poolData,
				{
					chain: "",
					token: "",
					tokenSupply: 0,
					maxStake: 0,
					from: "",
					to: "",
					// emissionRate: "",
				},
			],
		}));
	},

	removePool: (id) => {
		const state = get();
		const index = state.pool.findIndex((p) => p === id);
		set({
			pool: state.pool.filter((p) => p !== id),
			poolData: state.poolData.filter((_, i) => i !== index),
		});
	},

	setPhase: (data) => set({ phase: data }),
	setPhaseData: (data) => set({ phaseData: data }),

	updatePhaseItem: (index, updatedItem) =>
		set((state) => ({
			phaseData: state.phaseData.map((item, i) =>
				i === index ? { ...item, ...updatedItem } : item
			),
		})),

	addPhase: () => {
		const state = get();
		if (state.phase.length >= 3) return;
		const id = Date.now();
		set({
			phase: [...state.phase, id],
			phaseData: [
				...state.phaseData,
				{ emissionRate: 0, from: "", to: "" },
			],
		});
	},

	removePhase: (id) => {
		const state = get();
		const index = state.phase.findIndex((p) => p === id);
		set({
			phase: state.phase.filter((p) => p !== id),
			phaseData: state.phaseData.filter((_, i) => i !== index),
		});
	},

	setIsConfirming: (confirm) => set({ isConfirming: confirm }),
	setIsOpenEmissionRate: (open) => set({ isOpenEmissionRate: open }),
}));

export const useHoverSideBarIndexStore = create<{
	hoveredData: number | null;
	setHoveredData: (data: number | null) => void;
}>((set) => ({
	hoveredData: null,
	setHoveredData: (data) => set({ hoveredData: data }),
}));

// import { create } from "zustand";
// import {
// 	ConfirmState,
// 	FormDataType,
// 	PhaseDataType,
// } from "../types/input/create-launchpool";

// type PoolStore = {
// 	tokenAddress: string;
// 	setTokenAddress: (value: string) => void;

// 	pool: number[];
// 	poolData: FormDataType[];
// 	phase: number[];
// 	phaseData: PhaseDataType[];
// 	isConfirming: ConfirmState;
// 	isOpenEmissionRate: boolean;

// 	setPool: (data: number[]) => void;
// 	setPoolData: (data: FormDataType[]) => void;
// 	updatePoolItem: (index: number, updatedItem: Partial<FormDataType>) => void;
// 	addPool: () => void;
// 	removePool: (id: number) => void;

// 	setPhase: (data: number[]) => void;
// 	setPhaseData: (data: PhaseDataType[]) => void;
// 	updatePhaseItem: (
// 		index: number,
// 		updatedItem: Partial<PhaseDataType>
// 	) => void;
// 	addPhase: () => void;
// 	removePhase: (id: number) => void;

// 	setIsConfirming: (confirm: ConfirmState) => void;
// 	setIsOpenEmissionRate: (open: boolean) => void;
// };

// export const usePoolStore = create<PoolStore>((set, get) => ({
// 	// Token address
// 	tokenAddress: "",
// 	setTokenAddress: (value) => set({ tokenAddress: value }),

// 	// Pool/Phase states (Initial empty data)
// 	pool: [],
// 	poolData: [],
// 	phase: [],
// 	phaseData: [],

// 	isConfirming: { open: false, id: null, type: null },
// 	isOpenEmissionRate: false,

// 	setPool: (data) => set({ pool: data }),
// 	setPoolData: (data) => set({ poolData: data }),

// 	updatePoolItem: (index, updatedItem) =>
// 		set((state) => ({
// 			poolData: state.poolData.map((item, i) =>
// 				i === index ? { ...item, ...updatedItem } : item
// 			),
// 		})),

// 	addPool: () => {
// 		const id = Date.now();
// 		set((state) => ({
// 			pool: [...state.pool, id],
// 			poolData: [
// 				...state.poolData,
// 				{
// 					chain: "",
// 					token: "",
// 					tokenSupply: 0,
// 					maxStake: 0,
// 					from: "",
// 					to: "",
// 				},
// 			],
// 		}));
// 	},

// 	removePool: (id) => {
// 		const state = get();
// 		const index = state.pool.findIndex((p) => p === id);
// 		set({
// 			pool: state.pool.filter((p) => p !== id),
// 			poolData: state.poolData.filter((_, i) => i !== index),
// 		});
// 	},

// 	setPhase: (data) => set({ phase: data }),
// 	setPhaseData: (data) => set({ phaseData: data }),

// 	updatePhaseItem: (index, updatedItem) =>
// 		set((state) => ({
// 			phaseData: state.phaseData.map((item, i) =>
// 				i === index ? { ...item, ...updatedItem } : item
// 			),
// 		})),

// 	addPhase: () => {
// 		const state = get();
// 		if (state.phase.length >= 3) return;
// 		const id = Date.now();
// 		set({
// 			phase: [...state.phase, id],
// 			phaseData: [
// 				...state.phaseData,
// 				{ emissionRate: 0, from: "", to: "" },
// 			],
// 		});
// 	},

// 	removePhase: (id) => {
// 		const state = get();
// 		const index = state.phase.findIndex((p) => p === id);
// 		set({
// 			phase: state.phase.filter((p) => p !== id),
// 			phaseData: state.phaseData.filter((_, i) => i !== index),
// 		});
// 	},

// 	setIsConfirming: (confirm) => set({ isConfirming: confirm }),
// 	setIsOpenEmissionRate: (open) => set({ isOpenEmissionRate: open }),
// }));
