import { NextResponse } from "next/server";
import {
	type SIWESession,
	verifySignature,
	getAddressFromMessage,
	getChainIdFromMessage,
} from "@reown/appkit-siwe";
import { createPublicClient, http } from "viem";

export async function POST(req: Request) {
	try {
		const { message, signature } = await req.json();
		const reownProjectID = process.env.REOWN_PROJECT_ID;
		if (!reownProjectID) {
			// Logging here
			return NextResponse.json(
				{ message: "Server is mis-configured, contact the admin" },
				{ status: 500 }
			);
		}

		if (!message) {
			return NextResponse.json(
				{ message: "SiweMessage is undefined" },
				{ status: 400 }
			);
		}

		const address = getAddressFromMessage(message) as `0x${string}`;
		let chainId: string | number = getChainIdFromMessage(message);
		const isSignatureValid = await verifySignature({
			address,
			message,
			signature,
			chainId,
			projectId: reownProjectID,
		});

		if (!isSignatureValid) {
			return NextResponse.json(
				{ isValidMessage: false, reason: "Invalid signature" },
				{ status: 401 }
			);
		}

		const publicClient = createPublicClient({
			transport: http(
				`https://rpc.walletconnect.org/v1/?chainId=${chainId}&projectId=${reownProjectID}`
			),
		});
		const isValidMessage = await publicClient.verifyMessage({
			message,
			address,
			signature,
		});
		if (!isValidMessage) {
			throw new Error("Invalid signature");
		}
		if (chainId.includes(":")) {
			chainId = chainId.split(":")[1];
		}

		chainId = Number(chainId);

		if (isNaN(chainId)) {
			throw new Error("Invalid chainId");
		}

		// Issue session cookie when after successful verification
		const session: SIWESession = { address, chainId };
		const cookieValue = Buffer.from(JSON.stringify(session)).toString(
			"base64"
		);
		const response = NextResponse.json({ isValidMessage });
		response.headers.set(
			"Set-Cookie",
			`siwe-session=${cookieValue}; Path=/; HttpOnly; SameSite=Lax; Secure Max-Age=3600` // persist for 1 hour in seconds
		);
		return response;
	} catch (e: any) {
		return NextResponse.json(
			{ isValidMessage: false, reason: e.message },
			{ status: 500 }
		);
	}
}
