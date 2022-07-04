const {ethers} = require("hardhat");


async function main() {
  const simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying contract");
  const simpleStorage = await simpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log(`Deployed contract to: ${simpleStorage.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
