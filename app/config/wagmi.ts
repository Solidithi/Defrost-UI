import { cookieStorage, createStorage, http } from "wagmi";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import {
	moonbeam,
	moonbaseAlpha,
	moonriver,
	sepolia,
} from "@reown/appkit/networks";
import { walletConnect, injected, coinbaseWallet } from "wagmi/connectors";

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_PROJECT_ID;

if (!projectId) {
	throw new Error("Project ID is not defined");
}

// Include all commonly used networks
export const networks = [moonbeam, moonbaseAlpha, moonriver, sepolia];

// Set up the Wagmi Adapter with more options
export const wagmiAdapter = new WagmiAdapter({
	projectId: projectId,
	networks: networks,
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
