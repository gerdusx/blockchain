const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("Lottery", () => {
    let Lottery;
    let lotteryContract;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async () => {
        Lottery = await ethers.getContractFactory("Lottery");
        [owner, addr1, addr2] = await ethers.getSigners();
        lotteryContract = await Lottery.deploy();
    })

    describe("Deployement", async () => {
        it("Should assign the correct manager", async () => {
            console.log('dsfsdf');
            expect(await lotteryContract.manager()).to.equal(owner.address);
        })
    })
})