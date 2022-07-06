import { HardhatRuntimeEnvironment } from "hardhat/types";

import { developmentChains, DECIMALS, INITIAL_ANSWER } from "../helper-hardhat-config";

const deployMocks = async (hre: HardhatRuntimeEnvironment) => {
    //const { getNamedAccounts, deployments, network } = hre;
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;
    
    if (developmentChains.includes(chainId!)) {
        console.log("Local network detected! Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from: deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER]
        });
        console.log("Mocks deployed!");
        console.log("------------------------------------------------");
    }
};

export default deployMocks;

deployMocks.tags = ["all", "mocks"];