import { prismaClient } from "@/app/lib/prisma";

export async function POST(request: Request) {
	try {
		const {
			txHash,
			name,
			shortDescription,
			longDescription,
			logo,
			images,
		} = await request.json();

		const affected = await prismaClient.project.updateMany({
			where: { tx_hash: txHash },
			data: {
				short_description: shortDescription,
				long_description: longDescription,
				name,
				logo,
				images,
			},
		});

		if (affected.count < 1) {
			return Response.json(
				`Project with txHash ${txHash} is not indexed`,
				{
					status: 400,
				}
			);
		}

		return Response.json(
			{
				message: "Project detail updated",
			},
			{ status: 200 }
		);
	} catch (err) {
		console.error("Error updating project detail:", err);
		return new Response("Internal Server Error", { status: 500 });
	}
}
