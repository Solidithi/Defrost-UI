import { normalizeAddress } from "@/app/utils/address";
import { Address } from "viem";
import { NextRequest } from "next/server";

// Read adress from request headers and check if it matches the authorized address.
// The user must already be authenticated via SIWE and have a valid session cookie to reach this point.
export const isAddressAuthorized = (
	req: NextRequest,
	authorizedAddress: Address,
	authorizedChainIds?: number[]
): boolean => {
	const addressFromSession = req.headers.get("x-user-address") as Address;
	const chainIdFromSession = req.headers.get("x-user-chain-id");

	if (
		authorizedChainIds &&
		!authorizedChainIds.includes(Number(chainIdFromSession))
	) {
		return false;
	}

	return (
		normalizeAddress(addressFromSession) ==
		normalizeAddress(authorizedAddress)
	);
};
