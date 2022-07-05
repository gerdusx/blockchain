
import { DeployOptions } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { networkConfig } from "../helper-hardhat-config";

//const deployFundMe: DeployOptions = async (hre: HardhatRuntimeEnvironment) => {
const deployFundMe = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    //const ethUsdPriceFeed = networkConfig[chainId!].ethUsdPriceFeed

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [],
        log: true
    });
};

export default deployFundMe;