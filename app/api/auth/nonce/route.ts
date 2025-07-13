import { NextResponse } from "next/server";

function generateNonce() {
	const nonce = Math.random().toString(36).substring(2, 15);
	return nonce;
}

export async function GET() {
	return NextResponse.json({ nonce: generateNonce() });
}
