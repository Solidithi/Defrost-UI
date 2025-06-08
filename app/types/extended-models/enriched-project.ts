import { project } from "@prisma/client";
import { UnifiedPool } from "./unified-pool";
import { StaticImageData } from "next/image";

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
	poolImage: string;
};

export type ProjectDetail = {
	id: number;
	// projectDetail: string;
	name: string;
	description: string;
	image: string | StaticImageData;
	status: string;
	tokenPools: TokenPool[];
	socials: Socials;
};

export type Socials = {
	website: string;
	twitter: string;
	telegram: string;
	discord: string;
	github: string;
};
