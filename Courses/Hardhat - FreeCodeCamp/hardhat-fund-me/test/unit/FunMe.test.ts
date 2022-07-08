import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert, expect } from "chai";
import { deployments, ethers, network } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain";

import { developmentChains } from "../../helper-hardhat-config";

const chainId = network.config.chainId || 0;

!developmentChains.includes(chainId)
    ? describe.skip
    : describe("FundMe", async () => {
          let fundMe: FundMe;
          let mockV3Aggregator: MockV3Aggregator;
          let deployer: SignerWithAddress;

          const sendValue = ethers.utils.parseEther("1");

          beforeEach(async () => {
              const accounts = await ethers.getSigners();
              // const accountZero = accounts[0];
              deployer = accounts[0];
              await deployments.fixture(["all"]);
              fundMe = await ethers.getContract("FundMe", deployer);
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer);
          });

          describe("constructor", async () => {
              it("Set the aggregator addresses correctly", async () => {
                  const response = await fundMe.getPriceFeed();
                  assert.equal(response, mockV3Aggregator.address);
              });
          });

          describe("fund", async () => {
              it("fails if you don't send enough ETH", async () => {
                  await expect(fundMe.fund()).to.be.revertedWith("You need to spend more ETH!");
              });

              it("Updates the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue });
                  const response = await fundMe.getAddressToAmountFunded(deployer.address);
                  assert.equal(response.toString(), sendValue.toString());
              });

              it("adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue });
                  const funder = await fundMe.getFunder(0);
                  assert.equal(funder, deployer.address);
              });
          });

          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue });
              });

              it("withdraw ETH from a single funder", async () => {
                  const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString());
              });

              it("allows us to withdraw with multiple funders", async () => {
                  const accounts = await ethers.getSigners();
                  for (let index = 1; index < 6; index++) {
                      const fundMeConnectedContract = fundMe.connect(accounts[index]);
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }

                  await fundMe.fund({ value: sendValue });

                  const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  const transactionResponse = await fundMe.withdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString());

                  //Make sure the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (let index = 1; index < 6; index++) {
                      const funderBalance = await fundMe.getAddressToAmountFunded(accounts[index].address);
                      assert.equal(funderBalance.toString(), "0");
                  }
              });

              it("cheaperWithdraw....", async () => {
                  const accounts = await ethers.getSigners();
                  for (let index = 1; index < 6; index++) {
                      const fundMeConnectedContract = fundMe.connect(accounts[index]);
                      await fundMeConnectedContract.fund({ value: sendValue });
                  }

                  await fundMe.fund({ value: sendValue });

                  const startingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const startingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  const transactionResponse = await fundMe.cheaperWithdraw();
                  const transactionReceipt = await transactionResponse.wait(1);

                  const { gasUsed, effectiveGasPrice } = transactionReceipt;
                  const gasCost = gasUsed.mul(effectiveGasPrice);

                  const endingFundMeBalance = await fundMe.provider.getBalance(fundMe.address);
                  const endingDeployerBalance = await fundMe.provider.getBalance(deployer.address);

                  assert.equal(endingFundMeBalance.toString(), "0");
                  assert.equal(startingDeployerBalance.add(startingFundMeBalance).toString(), endingDeployerBalance.add(gasCost).toString());

                  //Make sure the funders are reset properly
                  await expect(fundMe.getFunder(0)).to.be.reverted;

                  for (let index = 1; index < 6; index++) {
                      const funderBalance = await fundMe.getAddressToAmountFunded(accounts[index].address);
                      assert.equal(funderBalance.toString(), "0");
                  }
              });

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners();
                  const attacker = accounts[1];
                  const attackerConnectedContract = await fundMe.connect(attacker);

                  await expect(attackerConnectedContract.withdraw()).to.be.revertedWith("FundMe__NotOwner");
              });
          });
      });
