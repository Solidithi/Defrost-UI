export function shortenStr(str: string, start = 6, end = 4) {
	if (!str) return "";
	return `${str.slice(0, start)}...${str.slice(-end)}`;
}

/**
 * Formats a large number to a more readable format
 * @param value The number to format (can be string, number, or BigInt)
 * @param options Formatting options
 * @returns Formatted string
 */
export function formatTokenAmount(
	value: string | number | bigint,
	options: {
		decimals?: number;
		maxDecimals?: number;
		minDecimals?: number;
		maxChars?: number;
		symbol?: string;
		abbreviate?: boolean;
	} = {}
) {
	// Default options
	const {
		decimals = 18,
		maxDecimals = 4,
		minDecimals = 2,
		maxChars = 12,
		symbol = "",
		abbreviate = true,
	} = options;

	// Convert to string if BigInt
	let valueStr =
		typeof value === "bigint"
			? formatUnits(value, decimals)
			: String(value);

	// If the value is already formatted with decimals, use it directly
	if (typeof value === "string" && value.includes(".")) {
		valueStr = value;
	}

	// Parse the number
	let num = parseFloat(valueStr);

	// Handle NaN case
	if (isNaN(num)) return "0";

	// Format using abbreviations for large numbers if required
	if (abbreviate) {
		const absNum = Math.abs(num);
		if (absNum >= 1e12) {
			return `${(num / 1e12).toFixed(minDecimals)}T${symbol ? " " + symbol : ""}`;
		} else if (absNum >= 1e9) {
			return `${(num / 1e9).toFixed(minDecimals)}B${symbol ? " " + symbol : ""}`;
		} else if (absNum >= 1e6) {
			return `${(num / 1e6).toFixed(minDecimals)}M${symbol ? " " + symbol : ""}`;
		} else if (absNum >= 1e3) {
			return `${(num / 1e3).toFixed(minDecimals)}k${symbol ? " " + symbol : ""}`;
		}
	}

	// For smaller numbers, format with appropriate decimals
	let formatted = num.toLocaleString(undefined, {
		maximumFractionDigits: maxDecimals,
		minimumFractionDigits: minDecimals,
	});

	// If the formatted string is too long, trim the decimals further
	if (formatted.length > maxChars) {
		const parts = formatted.split(".");
		if (parts.length === 2) {
			const intPart = parts[0];
			const decPart = parts[1];

			// Calculate how many decimal places we can keep
			const maxDecimalsToKeep = Math.max(
				0,
				maxChars - intPart.length - 1
			);

			if (maxDecimalsToKeep <= 0) {
				// If we can't keep any decimals, just return the integer part
				formatted = intPart;
			} else {
				// Keep as many decimals as possible
				formatted = `${intPart}.${decPart.substring(0, maxDecimalsToKeep)}`;
			}
		}
	}

	// Add symbol if provided
	return symbol ? `${formatted} ${symbol}` : formatted;
}

/**
 * Formats a USD value
 * @param value The number to format
 * @param options Formatting options
 * @returns Formatted USD string
 */
export function formatUsdValue(
	value: string | number | bigint,
	options: {
		decimals?: number;
		maxDecimals?: number;
		minDecimals?: number;
		prefix?: string;
		abbreviate?: boolean;
	} = {}
) {
	const {
		decimals = 18,
		maxDecimals = 2,
		minDecimals = 2,
		prefix = "$",
		abbreviate = true,
	} = options;

	const formatted = formatTokenAmount(value, {
		decimals,
		maxDecimals,
		minDecimals,
		maxChars: 10,
		abbreviate,
	});

	return `${prefix}${formatted}`;
}
