"use client";

import { cookieStorage, createStorage, http } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
	moonbeam,
	moonbaseAlpha,
	moonriver,
	sepolia,
} from "@reown/appkit/networks";

// Get projectId from https://cloud.reown.com
export const reownProjectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID;

if (!reownProjectId) {
	throw new Error("Project ID is not defined");
}

// Include all commonly used networks
export const supportedChains = [
	moonbeam,
	moonbaseAlpha,
	moonriver,
	sepolia,
] as [typeof moonbeam, typeof moonbaseAlpha, typeof moonriver, typeof sepolia];

export const defaultChain = moonbaseAlpha;

// Set up the Wagmi Adapter with more options
export const wagmiAdapter = new WagmiAdapter({
	projectId: reownProjectId,
	networks: supportedChains,
	storage: createStorage({
		storage: cookieStorage,
	}),
	ssr: false,
	connectors: [
		// walletConnect({ projectId }),
		// injected(),
		// coinbaseWallet({ appName: "Defrost Finance" }),
	],
	transports: {
		// Add a transport for each network
		[moonbeam.id]: http(),
		[moonbaseAlpha.id]: http(),
		[moonriver.id]: http(),
		[sepolia.id]: http(),
	},
});

export const config = {
	wagmiConfig: wagmiAdapter.wagmiConfig,
	networks: wagmiAdapter.networks,
};
