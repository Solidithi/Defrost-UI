import { project } from "@prisma/client";
import { UnifiedPool } from "./unified-pool";
import { StaticImageData } from "next/image";
import { ThumbnailImage } from "@/app/components/UI/carousel/ThumbnailCarousel";

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
	v_asset_address: string;
	poolImage?: string[] | StaticImageData[];
};

// export type ProjectDetail = {
// 	id: number;
// 	// projectDetail: string;
// 	name: string;
// 	description: string;
// 	image: string | StaticImageData;
// 	status: string;
// 	tokenPools: TokenPool[];
// 	socials: Socials;
// };
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
