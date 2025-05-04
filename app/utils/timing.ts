/**
 *
 * @param func - The function to be executed
 * @param waitMs - The time to wait in milliseconds before executing the function
 * @returns A function that, when called, will wait for the specified time before executing the original function
 */
export function debounce<F extends (...args: any[]) => any>(
	func: F,
	waitMs: number
): (...args: Parameters<F>) => void {
	let timeout: NodeJS.Timeout | null = null;

	return (...args: Parameters<F>) => {
		if (timeout) {
			clearTimeout(timeout);
		}

		timeout = setTimeout(() => {
			func(...args);
			timeout = null;
		}, waitMs);
	};
}

// export function throttle()
// export function delay()
