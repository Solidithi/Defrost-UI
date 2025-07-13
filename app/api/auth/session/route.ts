// Parse the cookie and return the session if present.
import { cookies } from "next/headers";

export async function GET() {
	const cookieStore = cookies();
	const sessionCookie = cookieStore.get("siwe-session");
	if (!sessionCookie) {
		return Response.json({}, { status: 401 });
	}
	try {
		const session = JSON.parse(
			Buffer.from(sessionCookie.value, "base64").toString()
		);
		if (
			typeof session.address === "string" &&
			typeof session.chainId === "number"
		) {
			return Response.json(session);
		}

		return Response.json({}, { status: 401 });
	} catch {
		return Response.json({}, { status: 401 });
	}
}
