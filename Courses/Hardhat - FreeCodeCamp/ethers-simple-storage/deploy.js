const ethers = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');
    const contract = await contractFactory.deploy();
    await contract.deployTransaction.wait(1);

    // console.log(contract.deployTransaction);

    // const nonce = await wallet.getTransactionCount();

    // console.log('Let\'s deploy with only tx data');
    // const tx = {
    //     nonce,
    //     gasPrice: "0x04a817c800",
    //     gasLimit: "0x071342",
    //     to: null,
    //     value: "0x0",
    //     data: `0x${binary}`,
    //     chainId: 1337
    // };

    // const sentTxResponse = await wallet.sendTransaction(tx);
    // await sentTxResponse.wait(1);
    // console.log(sentTxResponse);

    const currentFavouriteNumber = await contract.retrieve();
    console.log('currentFavouriteNumber', currentFavouriteNumber.toString());

    const transactionResponse = await contract.store("17");
    const transactionReceipt = await transactionResponse.wait(1);
    const newCurrentFavouriteNumber = await contract.retrieve();
    console.log('newCurrentFavouriteNumber', newCurrentFavouriteNumber.toString());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })