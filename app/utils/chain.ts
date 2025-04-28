import chains from "@/app/config/chains.json";

export function getChainName(chainID: number): string {
	const chainIDKey = chainID.toString() as keyof typeof chains;
	return chains[chainIDKey]?.chainName || "Unknown Chain";
}
