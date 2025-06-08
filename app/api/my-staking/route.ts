import { NextRequest } from "next/server";
import { prismaClient } from "@/app/lib/prisma";
import { normalizeAddress } from "@/app/utils/address";
import { stringify } from "superjson";
import { Address } from "viem";
import "@/app/lib/superjson-init";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const userID = searchParams.get("user-id");
	const chainID = Number(searchParams.get("chain-id"));

	if (!userID || !chainID) {
		return Response.json(
			{ message: "Missing user ID or chain ID" },
			{ status: 400 }
		);
	}

	if (Number.isNaN(chainID)) {
		return Response.json({ message: "Invalid chain ID" }, { status: 400 });
	}

	try {
		const launchpoolRows = await prismaClient.launchpool_stake.findMany({
			where: {
				user_id: normalizeAddress(userID as Address),
				launchpool: {
					chain_id: chainID,
				},
			},
			select: {
				launchpool_id: true,
				launchpool: true,
			},
		});

		// Transform ouput
		const launchpools = launchpoolRows.map((row) => row.launchpool);
		const responseData = {
			launchpools,
		};

		return Response.json(stringify(responseData));
	} catch (e) {
		console.error("Error fetching launchpool stake:", e);
		return Response.json(
			{ message: "Error fetching user stake" },
			{ status: 500 }
		);
	}
}
