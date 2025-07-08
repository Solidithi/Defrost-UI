import { getChainFromConfig } from "./chain";

export function getAvailableVTokensOfChain(chainID: number | string) {
	const chainIDStr = Number(chainID);

	const chain = getChainFromConfig(chainIDStr);
	if (!chain || !chain.tokens) {
		return [];
	}

	return chain.tokens.filter((token) => token.type === "vToken");
}
