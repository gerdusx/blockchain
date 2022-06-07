const { expect } = require('chai');
const { ethers, waffle } = require("hardhat");

describe("Lottery", () => {
    let Lottery;
    let lotteryContract;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async () => {
        Lottery = await ethers.getContractFactory("Lottery");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
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

        it("Should only accept 0.1 ether as entry", async () => {
            await expect(addr1.sendTransaction({
                to: lotteryContract.address,
                value: ethers.utils.parseEther("0.2")
            })).to.be.revertedWith("Please deposit 0.1 ether");
        });

        it("Contestant should be added to the list of players", async () => {
            await addr1.sendTransaction({
                    to: lotteryContract.address,
                    value: ethers.utils.parseEther("0.1")
                })
    
            expect(await lotteryContract.players([0])).to.equal(addr1.address);
        })

    });

    describe("Picking a winner", async () => {
        it ("Only manager should be able to pick a winner", async () => {
            await (expect(lotteryContract.connect(addr1).pickWinner()).to.be.revertedWith("Unauthorized"));
        });

        it ("Minimum of 3 players required", async () => {
            await (expect(lotteryContract.pickWinner()).to.be.revertedWith("Mininum of 3 players required"));
        });

        it ("Contract balance should be zero after winner is selected", async () => {
            await addr1.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })
            await addr2.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })
            await addr3.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })

            await lotteryContract.pickWinner();
            expect(await lotteryContract.getBalance()).to.equal(0);
        });

        it ("Users should be resetted after a winner is selected", async () => {
            await addr1.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })
            await addr2.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })
            await addr3.sendTransaction({ to: lotteryContract.address, value: ethers.utils.parseEther("0.1") })

            await lotteryContract.pickWinner();
            await (expect(lotteryContract.pickWinner()).to.be.revertedWith("Mininum of 3 players required"));
        });
    })
})