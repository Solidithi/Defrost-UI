export function shortenStr(str: string, start = 6, end = 4) {
	if (!str) return "";
	return `${str.slice(0, start)}...${str.slice(-end)}`;
}
