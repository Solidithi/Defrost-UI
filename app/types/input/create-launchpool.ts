/* ---------------------- Interface for create pool ---------------------- */
export interface ConfirmState {
	open: boolean;
	id: number | null;
	type: "pool" | "phase" | null;
}

export interface FormDataType {
	chain: string;
	tokenSupply: number;
	maxStake: number;
	from: string;
	to: string;
	phases: PhaseDataType[];
	vTokenAddress: string;
}

export interface PhaseDataType {
	id: number;
	emissionRate: number;
	from: string;
	to: string;
}
