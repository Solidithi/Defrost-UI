import { type SIWESession } from "@reown/appkit-siwe";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(req: NextRequest) {
	// const { nextUrl } = req;

	// // Check if it's an API route
	// const isApiRoute = nextUrl.pathname.startsWith("/api/");
	// const isAuthRoute = nextUrl.pathname.startsWith("/api/auth/");

	// // Skip auth routes (need to be accessible without authentication)
	// if (isAuthRoute) {
	// 	return NextResponse.next();
	// }

	// // Protect other API routes
	// if (isApiRoute) {
	const responseForUnauthenticated = NextResponse.json(
		{
			error: "Unauthorized",
		},
		{ status: 401 }
	);

	const sessionCookie = req.cookies.get("siwe-sessions");
	if (!sessionCookie) {
		return responseForUnauthenticated;
	}

	const session: SIWESession = JSON.parse(
		Buffer.from(sessionCookie.value, "base64").toString()
	);
	if (!session || !session.address || !session.chainId) {
		return responseForUnauthenticated;
	}

	// Add user info to headers for API routes for subsequent processing
	const response = NextResponse.next();
	response.headers.set("x-user-address", session.address);
	response.headers.set("x-user-chain-id", session.chainId.toString());
	return response;
	// }
}

// Apply middleware to all routes
export const config = {
	matcher: [
		// Match all request paths except for the ones starting with:
		// - _next/static (static files)
		// - _next/image (image optimization files)
		// - favicon.ico (favicon file)
		// '/((?!_next/static|_next/image|favicon.ico).*)',

		"/api/create-project/:path*", // Match routes under /api/create-project
		"/api/project/update/:path*",
	],
};
