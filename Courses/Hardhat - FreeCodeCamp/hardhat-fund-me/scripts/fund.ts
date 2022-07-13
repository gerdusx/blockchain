import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { deployments, ethers, network } from "hardhat";
import { FundMe } from "../typechain";

async function main() {
    const accounts = await ethers.getSigners();
    const deployer: SignerWithAddress = accounts[0];
    const fundMe: FundMe = await ethers.getContract("FundMe", deployer);

    console.log("Funding contract...");
    const transactionResponse = await fundMe.fund({value: ethers.utils.parseEther("0.1")});
    await transactionResponse.wait(1);
    console.log("Funded");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    });
