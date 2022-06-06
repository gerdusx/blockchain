const { expect } = require('chai');
const { ethers, waffle } = require("hardhat");

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
        await lotteryContract.deployed();
    })

    describe("Deployment", async () => {
        it("Should assign the correct manager", async () => {
            expect(await lotteryContract.manager()).to.equal(owner.address);
        });

        it("Contract balance should be zero", async () => {
            expect(await lotteryContract.getBalance()).to.equal(0);
        });

        it("Only the manager should be able to view balance", async () => {
            await expect(lotteryContract.connect(addr1).getBalance()).to.be.revertedWith("Unauthorized");
        });
    });

    describe("Entering the lottery", async () => {
        
        it("Contract amount should be updated after a deposit", async () => {
            await addr1.sendTransaction({
                    to: lotteryContract.address,
                    value: ethers.utils.parseEther("0.1")
                })
    
            expect(await lotteryContract.getBalance()).to.equal(ethers.utils.parseEther("0.1"));
        });

        it("Contestant should be added to the list of players", async () => {
            await addr1.sendTransaction({
                    to: lotteryContract.address,
                    value: ethers.utils.parseEther("0.1")
                })
    
            expect(await lotteryContract.players([0])).to.equal(addr1.address);
        })

    })
})