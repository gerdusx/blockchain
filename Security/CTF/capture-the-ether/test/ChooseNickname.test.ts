import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { assert, expect } from 'chai';
import { Contract } from "ethers";
import { ethers } from 'hardhat';
// import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { chooseNickname_cte_Address, chooseNickname_cte_abi } from '../constants';
import 'dotenv/config';

const TEST_ADDRESS = process.env.TEST_ADDRESS;

describe('Choose a Nickname', async () => {
	let deployer: SignerWithAddress;
	let contract: Contract;

	beforeEach(async () => {
		const accounts = await ethers.getSigners();
		deployer = accounts[0];
		contract = new ethers.Contract(chooseNickname_cte_Address, chooseNickname_cte_abi, deployer);
	});

	it('should change your nickname', async () => {
		const txResponse = await contract.setNickname('0x6765726475737800000000000000000000000000000000000000000000000000');
		await txResponse.wait(1);
		const nicknameOf = await contract.nicknameOf(TEST_ADDRESS);
		assert.equal(nicknameOf, '0x6765726475737800000000000000000000000000000000000000000000000000');
	});
});