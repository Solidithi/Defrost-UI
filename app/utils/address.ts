import { ZeroAddress } from "ethers";
import { Address } from "viem";

export function normalizeAddress(
	address: Address | undefined
): Address | undefined {
	if (address) {
		return address.toLowerCase() as `0x${string}`;
	}
	return address;
}

export function isValidAddressFormat(address: Address): boolean {
	// Check if the address exists and is not the zero address
	if (!address || address === ZeroAddress) {
		return false;
	}
	return /^0x[a-fA-F0-9]{40}$/.test(address);
}
