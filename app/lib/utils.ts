import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function shortenStr(str: string, start = 6, end = 4) {
	if (!str) return "";
	return `${str.slice(0, start)}...${str.slice(-end)}`;
}
