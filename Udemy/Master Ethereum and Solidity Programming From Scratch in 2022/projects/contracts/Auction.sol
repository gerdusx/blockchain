// SPDX-License-Identifier: GPL-3.0
pragma solidity 0.8.14;

contract Auction {
    address payable public owner;

    uint public startBlock;
    uint public endBlock;
    string public ipfsHash;

    enum State {Started, Running, Ended, Cancelled}
    State public auctionState;

    uint public highestBindingBid;
    address payable public highestBidder;

    mapping(address => uint) public bids;

    uint bidIncrement;

    constructor() {
        owner = payable(msg.sender);
        auctionState = State.Running;
        startBlock = block.number;
        endBlock = startBlock + 40320;
        ipfsHash = "";
        bidIncrement = 100;
    }

    modifier notOwner() {
        require(msg.sender != owner);
        _;
    }

    modifier afterStart() {
        require(block.number >= startBlock);
        _;
    }

    modifier beforeEnd() {
        require(block.number <= endBlock);
        _;
    }

    function placebBid() public notOwner afterStart beforeEnd payable{
        require(auctionState == State.Running);
        require(msg.value >= 100);

        uint currentBid = bids[msg.sender] + msg.value;
    }

}