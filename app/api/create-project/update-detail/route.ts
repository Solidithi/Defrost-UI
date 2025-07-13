import { prismaClient } from "@/app/lib/prisma";

export async function POST(request: Request) {
	try {
		const {
			txHash,
			projectId,
			name,
			shortDescription,
			longDescription,
			logo,
			images,
			twitter,
			telegram,
			discord,
			website,
			github,
			chainId,
		} = await request.json();

		const affected = await prismaClient.project.upsert({
			where: { id: projectId },
			create: {
				id: projectId,
				short_description: shortDescription,
				long_description: longDescription,
				twitter,
				telegram,
				discord,
				website,
				github,
				name,
				logo,
				images,
				tx_hash: txHash,
				chain_id: chainId,
				created_at: new Date(),
				// owner_id: This will be filled by the indexer eventually (dont worry)
			},
			update: {
				short_description: shortDescription,
				long_description: longDescription,
				name,
				logo,
				images,
				twitter,
				telegram,
				discord,
				website,
				github,
				// owner_id: This will be filled by the indexer eventually (dont worry)
			},
		});

		if (!affected) {
			return Response.json(
				`Project with id ${projectId} not updated or created`,
				{
					status: 400,
				}
			);
		}

		return Response.json({
			message: "Project detail updated",
		});
	} catch (err) {
		console.error("Error updating project detail:", err);
		return new Response("Internal Server Error", { status: 500 });
	}
}
