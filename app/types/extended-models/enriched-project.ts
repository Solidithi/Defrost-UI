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

export type TokenPool = {
	id: number;
	name: string;
	amount: number;
	percentage: number;
};

export type ProjectDetail = {
	id: number;
	// projectDetail: string;
	name: string;
	description: string;
	image: string;
	status: string;
	tokenPools: TokenPool[];
};

export interface BarChartProps {
	data: number[];
	label: string[];
}
