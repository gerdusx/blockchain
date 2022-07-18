import 'dotenv/config';

import { HardhatUserConfig, task } from 'hardhat/config';
import '@nomiclabs/hardhat-etherscan';
import '@nomiclabs/hardhat-waffle';


const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL || '';
const PRIVATE_KEY = process.env.PRIVATE_KEY;

//import '@nomicfoundation/hardhat-toolbox';
// import '@nomiclabs/hardhat-waffle';

const config: HardhatUserConfig = {
	solidity: '0.8.9',
	defaultNetwork: 'ropsten',
	networks: {
		localhost: {
			url: 'http://127.0.0.1:8545',
			chainId: 31337,
		},
		ropsten: {
			url: ROPSTEN_RPC_URL,
			accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
			chainId: 3,
		},
	},
};

export default config;
