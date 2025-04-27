/* ---------------------- Interface for create pool ---------------------- */
export interface ConfirmState {
	open: boolean;
	id: number | null;
	type: "form" | "phase" | null;
}

export interface FormDataType {
	chain: string;
	token: string;
	tokenSupply: number;
	maxStake: number;
	from: string;
	to: string;
	// emissionRate: string;
}

export interface PhaseDataType {
	emissionRate: number;
	from: string;
	to: string;
}
