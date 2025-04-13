import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function GET(request: Request) {
	try {
		// Get the user address, status filter, and search query from the search params
		const { searchParams } = new URL(request.url);
		const userAddress = searchParams.get("address");
		const status = searchParams.get("status");
		const search = searchParams.get("search");
		const page = parseInt(searchParams.get("page") || "1");
		const limit = parseInt(searchParams.get("limit") || "10");

		if (!userAddress) {
			return NextResponse.json(
				{ error: "User address is required" },
				{ status: 400 }
			);
		}

		// Base query conditions
		const where: any = {
			project_owner: userAddress,
		};

		// Add search filter if provided
		if (search) {
			where.name = {
				contains: search,
				mode: "insensitive", // Case insensitive search
			};
		}

		// Add date filtering based on status
		const currentDate = new Date();

		if (status) {
			if (status === "upcoming") {
				// Projects that haven't started yet
				where.pool = {
					some: {
						start_date: {
							gt: currentDate,
						},
					},
				};
			} else if (status === "ongoing") {
				// Projects that have started but haven't ended
				where.pool = {
					some: {
						start_date: {
							lte: currentDate,
						},
						end_date: {
							gt: currentDate,
						},
					},
				};
			} else if (status === "ended") {
				// Projects that have ended
				where.pool = {
					some: {
						end_date: {
							lte: currentDate,
						},
					},
				};
			}
			// If status is 'all' or invalid, no additional filter is applied
		}

		// Calculate skip value for pagination
		const skip = (page - 1) * limit;

		// Find projects owned by the user address with optional status filtering and search
		const projects = await prisma.project.findMany({
			where,
			include: {
				pool: {
					select: {
						id: true,
						pool_type: true,
						start_date: true,
						end_date: true,
						total_staked: true,
						staker_apy: true,
						total_stakers: true,
						project_token_address: true,
						native_asset_address: true,
					},
				},
			},
			skip,
			take: limit,
			orderBy: {
				created_at: "desc", // Most recent projects first
			},
		});

		// Get total count for pagination
		const totalCount = await prisma.project.count({
			where,
		});

		return NextResponse.json({
			projects,
			pagination: {
				total: totalCount,
				page,
				limit,
				pages: Math.ceil(totalCount / limit),
			},
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		console.error("Error fetching projects:", error);
		return NextResponse.json(
			{
				error: "Failed to fetch projects",
				message:
					error instanceof Error ? error.message : "Unknown error",
			},
			{ status: 500 }
		);
	}
}
