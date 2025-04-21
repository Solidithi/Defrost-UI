/* ---------------------- Interface for create pool ---------------------- */
export interface ConfirmState {
	open: boolean;
	id: number | null;
	type: "form" | "phase" | null;
}

export interface FormDataType {
	chain: string;
	token: string;
	tokenSupply: string;
	maxStake: string;
	from: string;
	to: string;
	emissionRate: string;
}

export interface PhaseDataType {
	emissionRate: string;
	from: string;
	to: string;
}
