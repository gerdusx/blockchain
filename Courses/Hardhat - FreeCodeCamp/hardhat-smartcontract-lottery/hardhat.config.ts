import "@typechain/hardhat";
import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-ethers";
import "hardhat-gas-reporter";
import "dotenv/config";
import "solidity-coverage";
import "hardhat-deploy";
import "solidity-coverage";
import "hardhat-contract-sizer";
import { HardhatUserConfig } from "hardhat/config";

module.exports = {
    solidity: "0.8.9",
};
