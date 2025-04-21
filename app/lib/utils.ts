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

// /**
//  * Calculates the percentage of the total staked amount that a user's stake represents.
//  *
//  * @param userStake - The amount staked by the user, represented as a bigint.
//  * @param totalStaked - The total amount staked in the pool, represented as a bigint.
//  * @param tokenDecimals - The number of decimal places for the token.
//  * @returns The user's stake percentage relative to the total staked amount, or 0 if totalStaked is zero or inputs are invalid.
//  */
// export function calculateStakePercentage(
// 	userStake: bigint,
// 	totalStaked: bigint,
// 	tokenDecimals: number
// ): number {
// 	if (
// 		!totalStaked ||
// 		!userStake ||
// 		!(BigInt(totalStaked.toString()) > BigInt(0))
// 	)
// 		return 0;
// 	const userStakeNum = Number(formatUnits(userStake, tokenDecimals));
// 	const totalStakedNum = Number(formatUnits(totalStaked, tokenDecimals));

// 	return (userStakeNum / totalStakedNum) * 100;
// }

// /** How many tokens am I earning per block?
//  * @param emissionRate - The emission rate of the token in on-chain number format
//  * @param stakePercentage - The percentage of the total stake that belongs to the user
//  */
// export const calculatePersonalEearningRate = (
// 	emissionRate: bigint | string,
// 	stakePercentage: number
// ) => {
// 	if (!emissionRate || !stakePercentage) return 0;

// 	const emissionRateNum = Number(
// 		formatUnits((emissionRate as bigint) ?? "0", 18)
// 	);

// 	return (emissionRateNum * stakePercentage) / 100;
// };
