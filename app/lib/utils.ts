import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "ethers";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function shortenStr(str: string, start = 6, end = 4) {
	if (!str) return "";
	return `${str.slice(0, start)}...${str.slice(-end)}`;
}

export function normalizeAddress(
	address: `0x${string}` | string
): `0x${string}` {
	if (!address) return "0x00";
	return address.toLowerCase() as `0x${string}`;
}

export const fileToBase64 = (file: File): Promise<string> =>
	new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file); // base64 + mimetype
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (error) => reject(error);
	});
