import { NextRequest } from "next/server";
import { prismaClient } from "@/app/lib/prisma";

export async function GET(req: NextRequest) {
	// Access route parameter
	const projectID = req.nextUrl.searchParams.get("project-id");
	console.log("Project ID:", projectID);

	if (
		!projectID ||
		typeof projectID !== "string" ||
		Number.isNaN(Number(projectID))
	) {
		return Response.json(
			{ message: "Invalid project ID:" + projectID },
			{ status: 400 }
		);
	}

	const project = await prismaClient.project.findUnique({
		where: {
			id: projectID.toString().trim(),
		},
	});

	if (!project) {
		return Response.json({ message: "Project not found" }, { status: 404 });
	}

	return Response.json({ message: "Success", project });
}
