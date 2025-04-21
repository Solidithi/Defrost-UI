import { project, launchpool } from "@prisma/client";
import { UnifiedPool } from "./pool";

// Project with potentially multiple types of pools
export type ProjectWithPools = project & {
	launchpool?: launchpool[];
	// farmpool?: farmpool[];
	// launchpad?: launchpad[];
};

// Enriched project type with calculated fields and unified pools
export type EnrichedProject = ProjectWithPools & {
	avgApy: number;
	tokenAddress: string | false | undefined;
	totalStaked: number;
	poolCount: number;
	totalStakers: number;
	unifiedPools: UnifiedPool[];
};
