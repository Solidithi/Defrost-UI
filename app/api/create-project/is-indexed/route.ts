import { prismaClient } from "@/app/lib/prisma";

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url);
	const txHash = searchParams.get("txHash");

	if (!txHash) {
		return new Response(
			"Transaction hash of project creation is required",
			{ status: 400 }
		);
	}

	try {
		// Count project with the given tx hash
		const projectCount = await prismaClient.project.count({
			where: {
				tx_hash: txHash,
			},
		});

		return Response.json(
			{
				isIndexed: projectCount > 0,
			},
			{ status: 200 }
		);
	} catch (error) {
		console.error("Error checking project indexed status:", error);
		return new Response("Internal Server Error", { status: 500 });
	}
}
