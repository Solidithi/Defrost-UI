// SPDX-License-Identifier: MIT

pragma solidity ^0.8.26;

import { Upgrades } from "@openzeppelin-foundry-upgrades/Upgrades.sol";
import { Options } from "@openzeppelin-foundry-upgrades/Options.sol";
import { ProjectHubUpgradeable } from "@src/upgradeable/v1/ProjectHubUpgradeable.sol";
import { Context } from "@openzeppelin/contracts/access/Ownable.sol";
import { console } from "forge-std/console.sol";
import { Script } from "forge-std/Script.sol";
import { DeployMockXCMOracle } from "./DeployMockXCMOracle.sol";

contract DeployProjectHubProxy is Context, Script {
	address[] public vAssets;
	address[] public nativeAssets;
	DeployMockXCMOracle public oracleDeployer = new DeployMockXCMOracle();

	function setVAssets(address[] memory _vAssets) public {
		vAssets = _vAssets;
	}

	function setNativeAssets(address[] memory _nativeAssets) public {
		nativeAssets = _nativeAssets;
	}

	function deployProjectHubProxy() public returns (address proxyAddress) {
		vm.startBroadcast();
		address oracleAddr = oracleDeployer.deploy(1e18, 10, 80000, 6);

		Options memory opt;
		opt.unsafeAllow = "external-library-linking";
		proxyAddress = Upgrades.deployTransparentProxy(
			"ProjectHubUpgradeable.sol:ProjectHubUpgradeable",
			_msgSender(),
			abi.encodeCall(
				ProjectHubUpgradeable.initialize,
				(oracleAddr, _msgSender(), vAssets, nativeAssets)
			),
			opt
		);

		console.log(
			"Deployed UUPS ProjectHubUpgradable proxy at address: %s",
			proxyAddress
		);
		vm.stopBroadcast();
		return proxyAddress;
	}

	function run() public {
		deployProjectHubProxy();
	}
}
