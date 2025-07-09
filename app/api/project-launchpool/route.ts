import { prismaClient } from "@/app/lib/prisma";
import { ProjectDetail } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
	// const projectId = req.nextUrl.searchParams.get("projectId");
	// console.log("projectId", projectId);
	// // if (!projectId) {
	// // 	return NextResponse.json(
	// // 		{
	// // 			success: false,
	// // 			message: "Project ID is required",
	// // 		},
	// // 		{
	// // 			status: 400,
	// // 		}
	// // 	);
	// // }
	// const projectDetail = await prismaClient.project.findFirst({
	// 	where: {
	// 		id: projectId ?? undefined,
	// 	},
	// });
	// console.log("projectDetail", projectDetail);
	// if (!projectDetail) {
	// 	return NextResponse.json(
	// 		{
	// 			success: false,
	// 			message: "Project not found",
	// 		},
	// 		{
	// 			status: 404,
	// 		}
	// 	);
	// }

	// const pools = await prismaClient.launchpool.findMany({
	// 	where: {
	// 		project_id: projectId ?? undefined,
	// 	},
	// });

	// console.log("pools", pools);
	// if (!pools) {
	// 	return NextResponse.json(
	// 		{
	// 			success: false,
	// 			message: "Pools not found",
	// 		},
	// 		{
	// 			status: 404,
	// 		}
	// 	);
	// }

	// // const numberOfInvestors = await prismaClient.launchpool_stake.count({
	// // 	where: {
	// // 		launchpool_id: projectId,
	// // 	},
	// // });
	// const uniqueInvestors = await prismaClient.launchpool_stake.count({
	// 	where: {
	// 		launchpool: {
	// 			project_id: projectId ?? undefined,
	// 		},
	// 	},
	// 	// distinct: ["user_id"] as Prisma.Launchpool_stakeScalarFieldEnum[], // 👈 Fixes the TS error
	// });

	// console.log("Unique Investors:", uniqueInvestors);
	// // console.log("numberOfInvestors", numberOfInvestors);
	// if (!uniqueInvestors) {
	// 	return NextResponse.json(
	// 		{
	// 			success: false,
	// 			message: "Number of investors not found",
	// 		},
	// 		{
	// 			status: 404,
	// 		}
	// 	);
	// }

	// const projectDetails: ProjectDetail = {
	// 	id: projectDetail?.id,
	// 	name: projectDetail?.id ?? "", // Replace 'name' with an existing property like 'project_id'
	// 	short_description: projectDetail.short_description ?? "",
	// 	long_description: projectDetail.long_description ?? "",
	// 	logo: projectDetail.logo ?? "",
	// 	images: Array.isArray(projectDetail?.images)
	// 		? projectDetail.images.map((img: string) => img)
	// 		: [],
	// 	status: "",
	// 	token_address: projectDetail?.token_address ?? "",
	// 	token_symbol: projectDetail?.token_symbol ?? "",
	// 	token_decimals: projectDetail?.token_decimals ?? 0,
	// 	tx_hash: projectDetail?.tx_hash ?? "",
	// 	chain_id: projectDetail?.chain_id ?? "",
	// 	created_at:
	// 		projectDetail?.created_at?.toISOString() ??
	// 		new Date().toISOString(),
	// 	owner_id: projectDetail?.owner_id ?? "",
	// 	pools: Array.isArray(pools)
	// 		? pools.map((pool) => ({
	// 				id: Number(pool.id),
	// 				name: pool.pool_id,
	// 				amount: pool.total_staked.toNumber(),
	// 				v_asset_address: pool.v_asset_address,
	// 				percentage: 0,
	// 			}))
	// 		: [],
	// 	socials: {
	// 		website: (projectDetail as any)?.socials?.website ?? "",
	// 		twitter: (projectDetail as any)?.socials?.twitter ?? "",
	// 		telegram: (projectDetail as any)?.socials?.telegram ?? "",
	// 		discord: (projectDetail as any)?.socials?.discord ?? "",
	// 		github: (projectDetail as any)?.socials?.github ?? "",
	// 	},
	// };
	// // console.log("projectDetails", projectDetails);

	return NextResponse.json(
		{
			success: true,
			// projectDetails,
			// uniqueInvestors,
		},
		{
			status: 200,
		}
	);
}
