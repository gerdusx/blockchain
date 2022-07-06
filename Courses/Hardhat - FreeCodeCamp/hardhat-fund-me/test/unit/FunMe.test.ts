import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { assert } from "chai";
import { deployments, ethers, getNamedAccounts } from "hardhat";
import { FundMe, MockV3Aggregator } from "../../typechain";

describe("FundMe", async () => {

    let fundMe : FundMe;
    let mockV3Aggregator: MockV3Aggregator;
    let deployer: SignerWithAddress;

    beforeEach(async () => {
        const accounts = await ethers.getSigners();
        // const accountZero = accounts[0];
        deployer = accounts[0];
        await deployments.fixture(["all"]);
        fundMe = await ethers.getContract("FundMe", deployer);
        mockV3Aggregator = await ethers.getContract(
            "MockV3Aggregator",
            deployer
        );
    });

    describe("constructor", async () => {
        it("Set the aggregator addresses correctly", async () => {
            const response = await fundMe.priceFeed();
            assert.equal(response, mockV3Aggregator.address);
        })
    })
    //
})