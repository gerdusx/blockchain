const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleSTorage", function () {

  let simpleStorageFactory, simpleStorage;

  beforeEach(async () => {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  })


  it("Should start with a favourite number of 0", async function () {
    const currentValue = await simpleStorage.retrieve();

    assert.equal(currentValue.toString(), "0");
  });

  //yarn hardhat test --grep store
  //it.only(...)
  it("Should update when we call store", async function () {
    const expctedValue = "17";

    const transactionResponse = await simpleStorage.store(expctedValue);
    await transactionResponse.wait(1);
    const currentValue = await simpleStorage.retrieve();

    assert.equal(currentValue.toString(), expctedValue);
  });
});
