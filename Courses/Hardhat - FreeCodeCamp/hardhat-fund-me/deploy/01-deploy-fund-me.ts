import { DeployOptions } from "hardhat-deploy/dist/types";
import { HardhatRuntimeEnvironment } from "hardhat/types";

import { networkConfig } from "../helper-hardhat-config";
import { verify } from "../utils/verify";

import {
    developmentChains,
    DECIMALS,
    INITIAL_ANSWER,
} from "../helper-hardhat-config";

import "dotenv/config";

//const deployFundMe: DeployOptions = async (hre: HardhatRuntimeEnvironment) => {
const deployFundMe = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    //const ethUsdPriceFeed = networkConfig[chainId!].ethUsdPriceFeed
    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(chainId!)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId!].ethUsdPriceFeed;
    }

    const args = [ethUsdPriceFeedAddress];

    const fundMe = await deploy("FundMe", {
        from: deployer,
        args,
        log: true,
        waitConfirmations: networkConfig[chainId!]?.blockConfirmations || 1
    });


    if (!developmentChains.includes(chainId!) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, args);
    }

    log("-----------------------------------------------------------");
    
};

export default deployFundMe;
deployFundMe.tags = ["all", "fundme"];
