/* ---------------------- Interface for create pool ---------------------- */
export interface ConfirmState {
	open: boolean;
	id: number | null;
	type: "pool" | "phase" | null;
}

export interface FormDataType {
	tokenSupply: number;
	maxStake: number;
	from: string;
	to: string;
	phases: PhaseDataType[];
	vTokenAddress: string;
	vTokenSymbol: string;
}

export interface PhaseDataType {
	id: number;
	tokenAmount: number;
	from: string;
	to: string;
}
