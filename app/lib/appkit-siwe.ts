"use client";

import {
	type SIWESession,
	type SIWEVerifyMessageArgs,
	type SIWECreateMessageArgs,
	createSIWEConfig,
	formatMessage,
} from "@reown/appkit-siwe";

/* Function that returns the user's session - this should come from your SIWE backend */
async function getSession() {
	const baseUrl = window.location.origin;
	const res = await fetch(baseUrl + "/session", {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
		},
		credentials: "include",
	});
	if (!res.ok) {
		throw new Error("Network response was not ok");
	}

	const data = await res.json();

	const isValidData =
		typeof data === "object" &&
		typeof data.address === "string" &&
		typeof data.chainId === "number";

	return isValidData ? (data as SIWESession) : null;
}

/* Use your SIWE server to verify if the message and the signature are valid */
const verifyMessage = async ({ message, signature }: SIWEVerifyMessageArgs) => {
	try {
		const baseUrl = window.location.origin;
		const response = await fetch(baseUrl + "/api/auth/verify", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			mode: "cors",
			body: JSON.stringify({ message, signature }),
			credentials: "include",
		});

		if (!response.ok) {
			return false;
		}

		const { isValidMessage } = await response.json();
		return isValidMessage === true;
	} catch (error) {
		return false;
	}
};

const signOut = async (): Promise<boolean> => {
	try {
		const baseUrl = window.location.origin;
		await fetch(baseUrl + "/api/auth/signout", {
			method: "POST",
		});
		return true;
	} catch (e) {
		console.error("Error during sign out:", e);
		return false;
	}
};

const getNonce = async () => {
	const baseUrl = window.location.origin;
	const res = await fetch(baseUrl + "/api/auth/nonce");
	const { nonce } = await res.json();
	if (!nonce) {
		throw new Error("Invalid nonce received from server!");
	}
	return nonce;
};

const createMessage = ({ address, ...args }: SIWECreateMessageArgs) =>
	formatMessage(args, address);

/* Create a SIWE configuration object */
export const createSiweConfig = (chainIDs: number[]) =>
	createSIWEConfig({
		getMessageParams: async () => ({
			domain: window.location.host,
			uri: window.location.origin,
			chains: chainIDs,
			statement: "Please sign with your account",
		}),
		createMessage,
		getNonce,
		getSession,
		verifyMessage,
		signOut,
	});
