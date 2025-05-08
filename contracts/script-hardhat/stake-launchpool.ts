import { ethers } from "hardhat";

interface StakeLaunchpoolConfig {
	launchpoolAddress: string;
	vAssetAddress: string;
	amountToStake: string; // String representation of the amount in wei
}

async function main(config?: StakeLaunchpoolConfig) {
	console.log("Staking vTokens in a Launchpool...");

	// Get signer
	const signers = await ethers.getSigners();
	const signer = signers[0];
	console.log("Using signer address:", signer.address);

	// If no config is provided, try to get from command line arguments
	if (!config) {
		const args = process.argv.slice(2);
		if (args.length < 2) {
			console.error(
				"Please provide launchpool address and vAsset address as command line arguments, e.g.:"
			);
			console.error(
				"npx hardhat run script-hardhat/stake-launchpool.ts --network moonbase 0x123... 0x456... 100000000000000000000"
			);
			process.exit(1);
		}

		config = {
			launchpoolAddress: args[0],
			vAssetAddress: args[1],
			amountToStake: args[2] || "1000000000000000000", // Default to 1 token if not provided
		};
	}

	console.log("Staking Configuration:");
	console.log("  Launchpool Address:", config.launchpoolAddress);
	console.log("  vAsset Address:", config.vAssetAddress);
	console.log("  Amount to stake:", config.amountToStake);

	// Get contract instances
	const launchpool = await ethers.getContractAt(
		"Launchpool",
		config.launchpoolAddress,
		signer
	);

	const vAsset = await ethers.getContractAt(
		"IERC20",
		config.vAssetAddress,
		signer
	);

	// Get vAsset balance of signer
	const vAssetBalance = await vAsset.balanceOf(signer.address);
	console.log(
		"Current vAsset balance:",
		ethers.formatEther(vAssetBalance.toString())
	);

	const amountToStake = ethers.toBigInt(config.amountToStake);

	// Check if balance is sufficient
	if (vAssetBalance < amountToStake) {
		console.error("Insufficient vAsset balance.");
		console.log("You need to get more vAssets first.");
		console.log(
			"Try minting some vAssets using the deploy-mock-erc20.ts script."
		);
		process.exit(1);
	}

	// Check allowance
	const allowance = await vAsset.allowance(
		signer.address,
		config.launchpoolAddress
	);
	console.log("Current allowance:", ethers.formatEther(allowance.toString()));

	// Approve vAssets if needed
	if (allowance < amountToStake) {
		console.log("Approving vAssets for the launchpool...");
		const approveTx = await vAsset.approve(
			config.launchpoolAddress,
			ethers.MaxUint256 // Approve max amount
		);
		await approveTx.wait();
		console.log("vAssets approved successfully!");
	}

	// Get launchpool information
	try {
		const poolInfo = await launchpool.getPoolInfo();
		console.log("Pool Information:");
		console.log("  Start block:", poolInfo[0]);
		console.log("  End block:", poolInfo[1]);
		console.log(
			"  Total project tokens:",
			ethers.formatEther(poolInfo[2].toString())
		);
		console.log(
			"  Emission rate:",
			ethers.formatEther(poolInfo[3].toString())
		);

		// Check if pool is active
		const currentBlock = await ethers.provider.getBlockNumber();
		console.log("Current block:", currentBlock);

		if (currentBlock < poolInfo[0]) {
			console.error(
				"Pool has not started yet. Cannot stake at this time."
			);
			console.log("Start block:", poolInfo[0]);
			process.exit(1);
		}

		if (currentBlock > poolInfo[1]) {
			console.error("Pool has already ended. Cannot stake at this time.");
			process.exit(1);
		}
	} catch (error) {
		console.error("Error fetching pool information:", error);
		process.exit(1);
	}

	// Check pool maxVTokensPerStaker
	const maxVTokensPerStaker = await launchpool.maxVAssetPerStaker();
	if (amountToStake > maxVTokensPerStaker) {
		console.error(
			`Amount to stake exceeds maxVTokensPerStaker (${ethers.formatEther(
				maxVTokensPerStaker.toString()
			)})`
		);
		process.exit(1);
	}

	// Stake vTokens
	console.log(`Staking ${ethers.formatEther(amountToStake)} vTokens...`);
	try {
		const stakeTx = await launchpool.stake(amountToStake);
		await stakeTx.wait();
		console.log("Staking successful!");

		// Get updated staker information
		const stakerInfo = await launchpool.stakers(signer.address);
		console.log("Updated Staker Information:");
		console.log(
			"  Native Amount:",
			ethers.formatEther(stakerInfo.nativeAmount.toString())
		);
		console.log(
			"  Claim Offset:",
			ethers.formatEther(stakerInfo.claimOffset.toString())
		);

		// Get claimable project tokens
		const claimable = await launchpool.getClaimableProjectToken(
			signer.address
		);
		console.log(
			"Claimable project tokens:",
			ethers.formatEther(claimable.toString())
		);

		// Get updated vAsset balance
		const updatedVAssetBalance = await vAsset.balanceOf(signer.address);
		console.log(
			"Remaining vAsset balance:",
			ethers.formatEther(updatedVAssetBalance.toString())
		);
	} catch (error) {
		console.error("Error staking vTokens:", error);
		console.log("Error details:", error);
		process.exit(1);
	}
}

// This handles running the script directly or being imported by another module
if (require.main === module) {
	main({
		amountToStake: ethers.parseUnits("1000", 18).toString(),
		launchpoolAddress: "0xfbe66a07021d7cf5bd89486abe9690421dcc649b",
		vAssetAddress: "0xD02D73E05b002Cb8EB7BEf9DF8Ed68ed39752465",
	})
		.then(() => process.exit(0))
		.catch((error) => {
			console.error(error);
			process.exit(1);
		});
} else {
	module.exports = main;
}
