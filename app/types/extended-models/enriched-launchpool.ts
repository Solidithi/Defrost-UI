import { launchpool } from "@prisma/client";

export type LaunchpoolStatus = "upcoming" | "active" | "ended";

export interface EnrichedLaunchpool extends launchpool {
	// accepted_tokens_symbol: string[];
	type: "launchpool"; // Define type here for filtering, sorting, searching convenience
	image: string;
	// your_stake: string
	// your_share: string
	durationSeconds: number; // @TODO: should add this to db
	name: string; // @TODO: should add this to db
	description: string; // @TODO: should add this to db
	status: LaunchpoolStatus;
}

export function toEnrichedLaunchpool() {}
