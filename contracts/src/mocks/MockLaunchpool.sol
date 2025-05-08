// SPDX-License-Identifier: MIT
/* solhint-disable */

pragma solidity ^0.8.26;

import { Launchpool } from "@src/non-upgradeable/Launchpool.sol";
import { IXCMOracle } from "@src/interfaces/IXCMOracle.sol";
import { MockXCMOracle } from "@src/mocks/MockXCMOracle.sol";
import { DeployMockXCMOracle } from "../..//test/testutils/DeployMockXCMOracle.sol";

contract MockLaunchpool is Launchpool {
	constructor(
		address _projectOwner,
		address _projectToken,
		address _acceptedVAsset,
		address _acceptedNativeAsset,
		uint128 _startBlock,
		uint128 _endBlock,
		uint256 _maxVAssetPerStaker,
		uint128[] memory _changeBlocks,
		uint256[] memory _emissionRateChanges
	)
		// Get hard-coded XCMOracle address for local testing
		Launchpool(
			0xEF81930Aa8ed07C17948B2E26b7bfAF20144eF2a,
			_projectOwner,
			_projectToken,
			_acceptedVAsset,
			_acceptedNativeAsset,
			_startBlock,
			_endBlock,
			_maxVAssetPerStaker,
			_changeBlocks,
			_emissionRateChanges
		)
	{}

	// Wildcard setters for testing (beware when testing)
	function wild_setTickBlock(uint128 _tickBlock) external {
		tickBlock = _tickBlock;
	}

	function wild_setLastNativeExRate(uint256 _lastNativeExRate) external {
		lastNativeExRate = _lastNativeExRate;
	}

	function wild_setAvgNativeExRateGradient(
		uint256 _avgNativeExRateGradient
	) external {
		avgNativeExRateGradient = _avgNativeExRateGradient;
	}

	function wild_setNativeExRateSampleCount(
		uint128 _nativeExRateSampleCount
	) external {
		nativeExRateSampleCount = _nativeExRateSampleCount;
	}

	function wild_updateNativeTokenExchangeRate(
		uint256 _nativeAmount,
		uint256 _vTokenAmount
	) external {
		_updateNativeTokenExchangeRate(_nativeAmount, _vTokenAmount);
	}

	function wild_setLastNativeExRateUpdateBlock(
		uint128 _lastNativeExRateUpdateBlock
	) external {
		lastNativeExRateUpdateBlock = _lastNativeExRateUpdateBlock;
	}

	function wild_setPlatformAdminAddress(
		address _platformAdminAddress
	) external {
		platformAdminAddress = _platformAdminAddress;
	}

	function wild_setOwnerShareOfInterest(
		uint128 _ownerShareOfInterest
	) external {
		ownerShareOfInterest = _ownerShareOfInterest;
	}

	// Expose internal methods for testing
	function exposed_getVTokenByTokenWithoutFee(
		uint256 _nativeAmount
	) public view returns (uint256) {
		return _getVTokenByTokenWithoutFee(_nativeAmount);
	}

	function exposed_getTokenByVTokenWithoutFee(
		uint256 _vTokenAmount
	) public view returns (uint256) {
		return _getTokenByVTokenWithoutFee(_vTokenAmount);
	}

	function exposed_getEstimatedNativeExRateAtEnd()
		public
		view
		returns (uint256)
	{
		return _getEstimatedNativeExRateAtEnd();
	}

	function exposed_getTokenDecimals(
		address _tokenAddress
	) public view returns (uint8) {
		return _getTokenDecimals(_tokenAddress);
	}

	function exposed_getActiveBlockDelta(
		uint256 from,
		uint256 to
	) public view returns (uint256) {
		return _getActiveBlockDelta(from, to);
	}

	function exposed_getPlatformAndOwnerClaimableVAssets()
		public
		view
		returns (uint256 ownerClaims, uint256 platformFee)
	{
		(ownerClaims, platformFee) = _getPlatformAndOwnerClaimableVAssets();
	}

	function exposed_getPendingExchangeRate() public view returns (uint256) {
		return _getPendingExchangeRate();
	}

	function exposed_getClaimableProjectToken() public view returns (uint256) {
		return exposed_getClaimableProjectToken();
	}

	// function _getVTokenByTokenWithoutFee(
	// 	uint256 _nativeAmount
	// ) internal view override returns (uint256 vAssetAmount) {
	// 	return
	// 		// Temporary solution
	// 		xcmOracle.getVTokenByToken(
	// 			address(acceptedNativeAsset),
	// 			_nativeAmount
	// 		);
	// }

	// function _getTokenByVTokenWithoutFee(
	// 	uint256 _vAssetAmount
	// ) internal view override returns (uint256 nativeAmount) {
	// 	// Temporary solution
	// 	return
	// 		xcmOracle.getTokenByVToken(
	// 			address(acceptedNativeAsset),
	// 			_vAssetAmount
	// 		);
	// }

	// function _preInit() internal override {
	// 	// Set platform admin address for testing
	// 	platformAdminAddress = address(0x868);
	// 	xcmOracle = IXCMOracle(0xEF81930Aa8ed07C17948B2E26b7bfAF20144eF2a);
	// }
}
/* solhint-enable */
