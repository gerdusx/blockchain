const { expect } = require('chai');
const { ethers } = require("hardhat");

describe("Token contract", function () {

    let Token;
    let hardhatToken;
    let owner;
    let addr1;
    let addr2;

    beforeEach(async () => {
        Token = await ethers.getContractFactory("Token");

        [owner, addr1, addr2] = await ethers.getSigners();

        hardhatToken = await Token.deploy();
    });

    describe("Deployment", () => {
        it ("Should assign the correct owner", async () => {
            expect(await hardhatToken.owner()).to.equal(owner.address);
        });

        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await hardhatToken.balanceOf(owner.address);
            expect(await hardhatToken.totalSupply()).to.equal(ownerBalance);
        })
    });
})