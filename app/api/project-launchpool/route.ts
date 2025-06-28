import { ThumbnailImage } from "@/app/components/UI/carousel/ThumbnailCarousel";
import { prismaClient } from "@/app/lib/prisma";
import { ProjectDetail } from "@/app/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	const projectId = req.nextUrl.searchParams.get("projectId");
	console.log("projectId", projectId);
	// if (!projectId) {
	// 	return NextResponse.json(
	// 		{
	// 			success: false,
	// 			message: "Project ID is required",
	// 		},
	// 		{
	// 			status: 400,
	// 		}
	// 	);
	// }
	const projectDetail = await prismaClient.project.findFirst({
		where: {
			id: projectId ?? undefined,
		},
	});
	console.log("projectDetail", projectDetail);
	if (!projectDetail) {
		return NextResponse.json(
			{
				success: false,
				message: "Project not found",
			},
			{
				status: 404,
			}
		);
	}

	const pools = await prismaClient.launchpool.findMany({
		where: {
			project_id: projectId ?? undefined,
		},
	});

	console.log("pools", pools);
	if (!pools) {
		return NextResponse.json(
			{
				success: false,
				message: "Pools not found",
			},
			{
				status: 404,
			}
		);
	}

	// const numberOfInvestors = await prismaClient.launchpool_stake.count({
	// 	where: {
	// 		launchpool_id: projectId,
	// 	},
	// });
	const uniqueInvestors = await prismaClient.launchpool_stake.count({
		where: {
			launchpool: {
				project_id: projectId ?? undefined,
			},
		},
		// distinct: ["user_id"] as Prisma.Launchpool_stakeScalarFieldEnum[], // 👈 Fixes the TS error
	});

	console.log("Unique Investors:", uniqueInvestors);
	// console.log("numberOfInvestors", numberOfInvestors);
	if (!uniqueInvestors) {
		return NextResponse.json(
			{
				success: false,
				message: "Number of investors not found",
			},
			{
				status: 404,
			}
		);
	}

	const projectDetails: ProjectDetail = {
		id: Number(projectDetail?.id),
		name: projectDetail?.id ?? "", // Replace 'name' with an existing property like 'project_id'
		shortDescription: projectDetail.short_description ?? "",
		longDescription: projectDetail.long_description ?? "",
		logoImage: projectDetail.logo ?? "",
		projectImages: Array.isArray(projectDetail?.images)
			? projectDetail.images.map((img: string) => ({ src: img }))
			: [],
		status: "",
		pools: Array.isArray(pools)
			? pools.map((pool) => ({
					id: Number(pool.id),
					name: pool.pool_id,
					amount: pool.total_staked.toNumber(),
					v_asset_address: pool.v_asset_address,
					percentage: 0,
				}))
			: [],
		socials: {
			website: projectDetail?.website ?? "",
			twitter: projectDetail?.twitter ?? "",
			telegram: projectDetail?.telegram ?? "",
			discord: projectDetail?.discord ?? "",
			github: projectDetail?.github ?? "",
		},
	};
	// console.log("projectDetails", projectDetails);

	return NextResponse.json(
		{
			success: true,
			projectDetails,
			uniqueInvestors,
		},
		{
			status: 200,
		}
	);
}
