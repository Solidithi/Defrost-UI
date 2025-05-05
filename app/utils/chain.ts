import chains from "@/app/config/chains.json";
import { normalizeAddress } from "@/app/utils/address";

export function getChainName(chainID: number): string {
	const chainIDKey = chainID.toString() as keyof typeof chains;
	return chains[chainIDKey]?.chainName || "Unknown Chain";
}

export function getTokenInfoFromConfig(
	chainID: number,
	tokenAddress: string | undefined
): { symbol: string; decimals: number } | undefined {
	// Check if tokenAddress is defined and not empty
	if (!tokenAddress) {
		return undefined;
	}

	const token = chains[chainID.toString() as keyof typeof chains].tokens.find(
		(token) =>
			normalizeAddress(token.address) === normalizeAddress(tokenAddress)
	);
	return token
		? { symbol: token.symbol, decimals: token.decimals }
		: undefined;
}
