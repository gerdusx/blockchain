// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

contract Lottery {
    address payable[] public players;
    address public manager;

    constructor() {
        manager = msg.sender;
    }

    receive() external payable {
        require(msg.sender != manager, "Manager not allowed to enter");
        require(msg.value == 0.1 ether, "Please deposit 0.1 ether");
        players.push(payable(msg.sender));
    }

    function getBalance() public view returns(uint) {
        require(msg.sender == manager, "Unauthorized");
        return address(this).balance;
    }

    function random() public view returns(uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players.length)));
    }

    function pickWinner() public {
        require(msg.sender == manager, "Unauthorized");
        require(players.length >= 3, "Mininum of 3 players required");

        uint randomNumber = random();
        address payable winner;

        uint index = randomNumber % players.length;
        winner = players[index];
        winner.transfer(getBalance());
        players = new address payable[](0); //resetting the lottering
    }

}