import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");

connectButton.onclick = connect;
fundButton.onclick = fund;

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        console.log("Connected");
        try {
            await window.ethereum.request({ method: "eth_requestAccounts" });
        } catch (error) {
            console.log(error);
        }

        connectButton.innerHTML = "Connected";
        const accounts = await ethereum.request({ method: "eth_accounts" });
        console.log(accounts);
    } else {
        console.log("No MetaMask!");
        connectButton.innerHTML = "Please install MetaMask";
    }
}

async function fund() {
    const ethAmount = "77";
    if (typeof window.ethereum !== "undefined") {
        console.log(`Funding with ${ethAmount}`);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        console.log("signer", signer);

        const contract = new ethers.Contract(contractAddress, abi, signer);

        try {
            const transactionResponse = await contract.fund({ value: ethers.utils.parseEther(ethAmount) });
            await listenForTransactionMine(transactionResponse, provider);
            console.log("Done!!");
        } catch (error) {
            console.log(error);
        }
    }
}

function listenForTransactionMine(transactionResponse, provider) {
    console.log(`Mining ${transactionResponse.hash}...`);

    return new Promise((resolve, reject) => {
        provider.once(transactionResponse.hash, (transactionReceipt) => {
            console.log(`Completed with ${transactionReceipt.confirmations} confirmations`);
            resolve();
        });
    })
}
