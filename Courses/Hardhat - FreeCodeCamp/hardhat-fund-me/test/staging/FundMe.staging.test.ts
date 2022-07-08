import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { FundMe } from "../../typechain";
import { deployments, ethers, network } from "hardhat";
import { assert, expect } from "chai";

import { developmentChains } from "../../helper-hardhat-config";

const chainId = network.config.chainId || 0;

developmentChains.includes(chainId)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: FundMe;
          let deployer: SignerWithAddress;

          const sendValue = ethers.utils.parseEther("1");

          beforeEach(async () => {
              const accounts = await ethers.getSigners();
              // const accountZero = accounts[0];
              deployer = accounts[0];
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
          });

          it("allows people to fund and withdraw", async () => {
            await fundMe.fund({ value: sendValue });
            await fundMe.withdraw();

            const endingBalance = await fundMe.provider.getBalance(fundMe.address);
            assert(endingBalance.toString(), "0");
          })
      });
