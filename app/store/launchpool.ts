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
				i === index ? { ...item, ...updatedItem } : item
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
					tokenSupply: "",
					maxStake: "",
					from: "",
					to: "",
					emissionRate: "",
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
				{ emissionRate: "", from: "", to: "" },
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
