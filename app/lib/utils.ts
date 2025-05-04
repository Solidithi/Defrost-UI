import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatUnits } from "ethers";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}
