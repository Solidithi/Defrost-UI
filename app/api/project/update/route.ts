import { NextRequest } from "next/server";
import { prismaClient } from "@/app/lib/prisma";
import { Address } from "viem";
import { isAddressAuthorized } from "@/app/lib/auth/authorization";

export async function PATCH(req: NextRequest) {
	const { id: projectID, ...data } = await req.json();

	console.log("Updating project with ID:", projectID, "Data:", data);

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
		where: { id: projectID },
		select: { owner_id: true },
	});
	const { owner_id: projectOwnerAddr } = project || {};
	if (!project || !projectOwnerAddr) {
		return Response.json({ message: "Project not found" }, { status: 404 });
	}
	if (!isAddressAuthorized(req, projectOwnerAddr as Address)) {
		return Response.json(
			{ message: "Unauthorized: You are not the owner of this project" },
			{ status: 403 }
		);
	}

	const updatedProject = await prismaClient.project.update({
		where: {
			id: projectID,
		},
		data,
	});

	if (!updatedProject) {
		return Response.json({ message: "Update failed" }, { status: 500 });
	}

	return Response.json({ message: "Success", project: updatedProject });
}
