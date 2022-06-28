const ethers = require("ethers");
const fs = require("fs-extra");

async function main() {
    const provider = new ethers.providers.JsonRpcProvider("HTTP://0.0.0.0:8545");
    const wallet = new ethers.Wallet('d9cdb2c9ac001da10a1c9217db2857f787ca62c35805a97981552fb5cb6a07fa', provider);

    const abi = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.abi", "utf-8");
    const binary = fs.readFileSync("./SimpleStorage_sol_SimpleStorage.bin", "utf-8");

    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log('Deploying, please wait...');
    const contract = await contractFactory.deploy();
    const transactionReceipt = await contract.deployTransaction.wait(1);

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

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.log(error);
        process.exit(1);
    })