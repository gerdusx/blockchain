import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { Contract } from "ethers";
import { ethers } from 'hardhat';
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { contractAddress, abi } from "../constants"

describe('Call Me', async () => {
	let deployer: SignerWithAddress;
	let contract: Contract;

	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		deployer = accounts[0];
		contract = new ethers.Contract(contractAddress, abi, deployer);
	});

	it('should call the call me function', async () => {
		const txResponse =  await contract.callme();
		await txResponse.wait(1);
		const isComplete = await contract.isComplete();
		assert.equal(isComplete, true);
	});
});
