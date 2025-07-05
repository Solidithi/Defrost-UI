/**
 * Format large numbers with appropriate suffixes (K, M, B, T)
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string with suffix
 */
export function formatNumber(num: number, decimals: number = 1): string {
	if (num === 0) return "0";

	const suffixes = ["", "K", "M", "B", "T"];
	const tier = Math.floor(Math.log10(Math.abs(num)) / 3);

	if (tier === 0) return num.toString();

	const suffix = suffixes[tier];
	const scale = Math.pow(10, tier * 3);
	const scaled = num / scale;

	return scaled.toFixed(decimals).replace(/\.0$/, "") + suffix;
}

/**
 * Format currency with appropriate suffixes
 * @param amount - The amount to format
 * @param currency - Currency symbol (default: '$')
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted currency string
 */
export function formatCurrency(
	amount: number,
	currency: string = "$",
	decimals: number = 1
): string {
	return `${currency}${formatNumber(amount, decimals)}`;
}

/**
 * Format percentage with sign and color indication
 * @param percentage - The percentage to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Object with formatted string and color class
 */
export function formatPercentage(
	percentage: number,
	decimals: number = 1
): { text: string; colorClass: string; isPositive: boolean } {
	const sign = percentage > 0 ? "+" : "";
	const text = `${sign}${percentage.toFixed(decimals)}%`;
	const isPositive = percentage > 0;
	const colorClass =
		percentage > 0
			? "text-emerald-400"
			: percentage < 0
				? "text-red-400"
				: "text-gray-400";

	return { text, colorClass, isPositive };
}
