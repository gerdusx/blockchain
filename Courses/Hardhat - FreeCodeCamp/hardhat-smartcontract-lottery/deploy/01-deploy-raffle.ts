import { HardhatRuntimeEnvironment } from "hardhat/types";
import { developmentChains, networkConfig } from "../helper-hardhat-config";

const deployRaffle = async (hre: HardhatRuntimeEnvironment) => {
    const { getNamedAccounts, deployments, network } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();

    const chainId = network.config.chainId;

    let vrfCoordinatorAddress;
    if (developmentChains.includes(chainId!)) {
        const vrfCoordinator = await deployments.get("VRFCoordinatorV2Mock");
        vrfCoordinatorAddress = vrfCoordinator.address;
    } else {
        vrfCoordinatorAddress = networkConfig[chainId!].vrfCoordinator;
    }

    const raffleEntranceFee = networkConfig[chainId!].raffleEntranceFee;

    const args = [vrfCoordinatorAddress, raffleEntranceFee];

    console.log("args", args);
    

    // const raffle = await deploy("Raffle", {
    //     from: deployer,
    //     args,
    //     log: true,
    //     waitConfirmations: networkConfig[chainId!].blockConfirmations || 1,
    // });
};

export default deployRaffle;
deployRaffle.tags = ["all", "raffle"];
