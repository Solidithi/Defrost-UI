import { NextResponse } from "next/server";

export async function POST() {
	const response = NextResponse.json({ ok: true });
	response.headers.set(
		"Set-Cookie",
		"siwe-session=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0"
	);
	return response;
}
