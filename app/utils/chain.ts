import chains from "@/app/config/chains.json";
import { normalizeAddress } from "@/app/utils/address";
import { Address } from "viem";

export function getChainName(chainID: number): string {
	const chainIDKey = chainID.toString() as keyof typeof chains;
	return chains[chainIDKey]?.chainName || "Unknown Chain";
}

export function getChainFromConfig(
	chainID: number
): (typeof chains)[keyof typeof chains] {
	const chainIDKey = chainID.toString() as keyof typeof chains;
	return chains[chainIDKey];
}

export function getTokenInfoFromConfig(
	chainID: number | string,
	tokenAddress: string | undefined
):
	| {
			symbol: string;
			decimals: number;
			address: string;
			name: string;
			icon: string;
			alias?: string;
	  }
	| undefined {
	if (!tokenAddress) {
		return undefined;
	}

	if (typeof chainID === "number") {
		chainID = chainID.toString();
	}
	const token = chains[chainID as keyof typeof chains].tokens.find(
		(token) =>
			normalizeAddress(token.address as Address) ===
			normalizeAddress(tokenAddress as Address)
	);
	return token;
}

export function openTransactionInExplorerOfChain(
	chainID: number,
	txHash: string
): void {
	const chain = getChainFromConfig(chainID);
	if (chain && chain.explorerUrl) {
		let explorerUrl = chain.explorerUrl;
		if (!explorerUrl.endsWith("/")) {
			explorerUrl = explorerUrl.slice(0, -1);
		}
		let txExplorerUrl = "";
		switch (chainID) {
			default:
				txExplorerUrl = `${chain.explorerUrl}/tx/${txHash}`;
		}
		window.open(txExplorerUrl, "_blank");
	} else {
		console.error("Chain not found or explorer URL is not defined.");
	}
}
