import { ethers } from "ethers";

export interface networkConfigItem {
    name: string;
    blockConfirmations?: number;
    vrfCoordinator?: string;
    raffleEntranceFee?: string;
}

export interface networkConfigInfo {
    [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
    4: {
        name: "rinkby",
        blockConfirmations: 6,
        vrfCoordinator: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
        raffleEntranceFee: ethers.utils.parseEther("0.01").toString(),
    },
    31337: {
        name: "hardhat",
        blockConfirmations: 1,
        raffleEntranceFee: ethers.utils.parseEther("0.01").toString(),
    },
};

export const developmentChains = [31337];