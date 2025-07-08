import { getChainName } from "@/app/utils/chain";
import { launchpool, project } from "@prisma/client";

export type LaunchpoolStatus = "upcoming" | "active" | "ended";

export interface EnrichedLaunchpool extends launchpool {
	type: "launchpool"; // Define type here for filtering, sorting, searching convenience
	image: string;
	durationSeconds: number; // @TODO: should add this to db
	description: string;
	status: LaunchpoolStatus;
	project?: project;
}

export interface LaunchpoolMetrics {}

function getLaunchpoolStatus(startDate: Date, endDate: Date): LaunchpoolStatus {
	const now = new Date();
	if (now < startDate) {
		return "upcoming";
	} else if (now > endDate) {
		return "ended";
	} else {
		return "active";
	}
}

export function toEnrichedLaunchpool(
	launchpool: launchpool
): EnrichedLaunchpool {
	return {
		...launchpool,
		type: "launchpool",
		image: "",
		durationSeconds:
			(new Date(launchpool.end_date).getTime() -
				new Date(launchpool.start_date).getTime()) /
			1000,
		status: getLaunchpoolStatus(launchpool.start_date, launchpool.end_date),
		description: `Stake voucher tokens to earn rewards`,
	};
}
