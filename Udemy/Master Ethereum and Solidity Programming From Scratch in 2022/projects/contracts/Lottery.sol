// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

contract Lottery {
    address payable[] public players;
    address public manager;

    constructor() {
        manager = msg.sender;
    }
}