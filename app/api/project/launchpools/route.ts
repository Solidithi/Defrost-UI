import { NextRequest } from "next/server";
import { prismaClient } from "@/app/lib/prisma";
import { stringify } from "superjson";
import "@/app/lib/superjson-init";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const projectID = searchParams.get("project-id");
	const offset = Number(searchParams.get("offset")) || 0;
	const limit = Number(searchParams.get("limit")) || 10;

	const launchpools = await prismaClient.launchpool.findMany({
		where: {
			project_id: projectID?.toString().trim() || "",
		},
		skip: offset,
		take: limit,
	});
	console.log("Launchpools fetched from db:", launchpools);

	return Response.json(stringify(launchpools));
}
