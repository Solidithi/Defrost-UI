import { project } from "@prisma/client";
import { UnifiedPool } from "./unified-pool";

// Enriched project type with calculated fields and unified pools
export interface EnrichedProject extends project {
	avgApy: number;
	tokenAddress: string | false | undefined;
	totalStaked: number;
	poolCount: number;
	totalStakers: number;
	unifiedPools: UnifiedPool[];
}
