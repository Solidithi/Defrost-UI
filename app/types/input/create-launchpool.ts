// /* ---------------------- Interface for create pool ---------------------- */
// export interface ConfirmState {
// 	open: boolean;
// 	id: number | null;
// 	type: "pool" | "phase" | null;
// }

// export interface FormDataType {
// 	tokenSupply: number;
// 	maxStake: number;
// 	from: string;
// 	to: string;
// 	phases: PhaseDataType[];
// 	vTokenAddress: string;
// 	vTokenSymbol: string;
// }

// export interface PhaseDataType {
// 	id: number;
// 	tokenAmount: number;
// 	from: string;
// 	to: string;
// }
import { project, launchpool } from "@prisma/client";

export interface PhaseDataType {
	id: number;
	tokenAmount: number;
	from: string;
	to: string;
}

export interface PoolDataType {
	vTokenAddress: string;
	vTokenSymbol: string;
	tokenSupply: number;
	maxStake: number;
	from: string;
	to: string;
	launchpools: launchpool[];
	phases: PhaseDataType[];
}

export interface LaunchpoolData {
	projectId: string;
	projectTokenAddress: string;
	pools: string[];
	poolData: PoolDataType;
}
