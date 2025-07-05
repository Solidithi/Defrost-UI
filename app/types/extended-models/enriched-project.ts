import { project } from "@prisma/client";
import { UnifiedPool } from "./unified-pool";
import { EnrichedLaunchpool } from "./enriched-launchpool";
import { StaticImageData } from "next/image";
import { ThumbnailImage } from "@/app/components/UI/carousel/ThumbnailCarousel";

// Enriched project type with calculated fields and specific pool types
export interface EnrichedProject extends project {
	avgApy: number;
	tokenAddress: string | false | undefined;
	totalStaked: number;
	poolCount: number;
	totalStakers: number;
	launchpools: EnrichedLaunchpool[];
	// Future pool types can be added here
	// farmpools: EnrichedFarmpool[];
	// launchpads: EnrichedLaunchpad[];

	// Keep unifiedPools for backward compatibility until fully migrated
	unifiedPools?: UnifiedPool[];
}

export type TokenPool = {
	id: number;
	name: string;
	amount: number;
	percentage: number;
	v_asset_address: string;
	poolImage?: string[] | StaticImageData[];
};

export type ProjectDetail = {
	id: string;
	name: string | null;
	token_address: string | null;
	token_symbol: string | null;
	token_decimals: number | null;
	logo: string | StaticImageData | null;
	images: string[];
	short_description: string | null;
	long_description: string | null;
	tx_hash: string;
	chain_id: number;
	created_at: string;
	owner_id: string | null;

	status: string;
	pools: TokenPool[];
	socials: Socials;
};

export type Socials = {
	website: string;
	twitter: string;
	telegram: string;
	discord: string;
	github: string;
};
