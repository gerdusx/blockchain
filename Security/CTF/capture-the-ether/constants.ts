export const contractAddress = '0x83d854471D4770c364530A6CDb89Ac008F728517';
export const chooseNickname_cte_Address = '0x71c46Ed333C35e4E6c62D32dc7C8F00D125b4fee';

export const abi = [
	{ constant: false, inputs: [], name: 'callme', outputs: [], payable: false, stateMutability: 'nonpayable', type: 'function' },
	{ constant: true, inputs: [], name: 'isComplete', outputs: [{ name: '', type: 'bool' }], payable: false, stateMutability: 'view', type: 'function' },
];

export const chooseNickname_cte_abi = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "name": "nicknameOf",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "bytes32",
          "name": "nickname",
          "type": "bytes32"
        }
      ],
      "name": "setNickname",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]