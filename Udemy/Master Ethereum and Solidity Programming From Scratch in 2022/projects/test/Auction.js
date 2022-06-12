const { expect } = require('chai');
const { ethers, waffle } = require("hardhat");

describe("Auction", () => {
    let Auction;
    let auctionContract;
    let owner;
    let addr1;
    let addr2;
    let addr3;

    beforeEach(async () => {
        Auction = await ethers.getContractFactory("Auction");
        [owner, addr1, addr2, addr3] = await ethers.getSigners();
        auctionContract = await Auction.deploy();
        await auctionContract.deployed();
    })

});