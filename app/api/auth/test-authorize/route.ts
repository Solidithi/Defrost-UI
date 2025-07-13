import { cookies } from "next/headers";
import { prismaClient } from "@/app/lib/prisma";
import { NextRequest } from "next/server";
import { normalizeAddress } from "@/app/utils/address";

export async function GET(req: NextRequest) {
	const cookieStore = cookies();
	const searchParams = req.nextUrl.searchParams;
	const projectID = searchParams.get("projectID");

	if (!projectID) {
		return Response.json(
			{
				error: "Project ID is required",
				isAuthenticated: false,
				isAuthorized: false,
			},
			{ status: 400 }
		);
	}

	const project = await prismaClient.project.findUnique({
		where: { id: projectID },
		select: { owner_id: true },
	});
	if (!project) {
		return Response.json({ error: "Project not found" }, { status: 404 });
	}
	const { owner_id: projectOwnerAddr } = project;

	const sessionCookie = cookieStore.get("siwe-session");
	if (!sessionCookie) {
		return Response.json({
			isAuthenticated: false,
			isAuthorized: false,
		});
	}
	const session = JSON.parse(
		Buffer.from(sessionCookie.value, "base64").toString()
	);
	if (!session || !session.address || !session.chainId) {
		return Response.json(
			{
				error: "Missing session/session address/chainId",
				isAuthenticated: false,
				isAuthorized: false,
			},
			{ status: 401 }
		);
	}

	if (
		normalizeAddress(session.address) !==
		normalizeAddress(projectOwnerAddr as `0x${string}`)
	) {
		return Response.json(
			{
				error: "Unauthorized: You are not the owner of this project",
				isAuthenticated: true,
				isAuthorized: false,
				yourAddress: session.address,
				ownerAddress: projectOwnerAddr,
			},
			{ status: 403 }
		);
	}

	return Response.json({
		isAuthenticated: true,
		isAuthorized: true,
		projectOwnerAddr,
	});
}
