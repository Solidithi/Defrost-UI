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

export type ProjectDetail = {
	id: number;
	// projectDetail: string;
	name: string;
	shortDescription: string;
	longDescription: string;
	image?: string | StaticImageData;
	logoImage: string | StaticImageData;
	projectImages: ThumbnailImage[];
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
