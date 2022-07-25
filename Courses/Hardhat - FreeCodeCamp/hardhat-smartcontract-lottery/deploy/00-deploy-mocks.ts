import { ethers } from "ethers";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

const BASE_FEE = ethers.utils.parseEther("0.25"); //0.25 is the premium. It costs 0.25 Link per request
const GAS_PRICE_LINK = 1e9; // 1000000000 //calculated value based on the gas price of the chain

const deployMocks = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    const args = [BASE_FEE, GAS_PRICE_LINK];

    if (developmentChains.includes(chainId!)) {
        console.log("Local network detected! Deploying mocks...");
        await deploy("VRFCoordinatorV2Mock", {
            contract: "VRFCoordinatorV2Mock",
            from: deployer,
            log: true,
            args,
        });
        console.log("Mocks deployed!");
        console.log("------------------------------------------------");
    }
};

export default deployMocks;
deployMocks.tags = ["all", "mocks"];
