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

    modifier onlyOwner() {
        require(msg.sender == owner);
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

    function min(uint a, uint b) pure internal returns(uint) {
        if (a < b) {
            return a;
        }

        return b;
    }

    function cancelAuction() public onlyOwner {
        auctionState = State.Cancelled;
    }

    function placebBid() public notOwner afterStart beforeEnd payable{
        require(auctionState == State.Running);
        require(msg.value >= 100);

        uint currentBid = bids[msg.sender] + msg.value;
        require (currentBid > highestBindingBid);

        bids[msg.sender] = currentBid;

        if (currentBid <= bids[highestBidder]) {
            highestBindingBid = min(currentBid + bidIncrement, bids[highestBidder]);
        } 
        else {
            highestBindingBid = min(currentBid, bids[highestBidder] + bidIncrement);
            highestBidder = payable(msg.sender);
        }
    }

    function finalizeAuction() public {
        require(auctionState == State.Cancelled || block.number > endBlock);
        require(msg.sender == owner || bids[msg.sender] > 0); //The owner or any bidder can finalize the auction

        address payable recipient;
        uint value;

        if (auctionState == State.Cancelled) {
            recipient = payable(msg.sender);
            value = bids[msg.sender];
        }
        else {
            if (msg.sender == owner) {
                recipient = owner;
                value = bids[msg.sender];
            } else {
                if (msg.sender == highestBidder) {
                    recipient = highestBidder;
                    value = bids[highestBidder] - highestBindingBid;
                }
                else {
                    recipient = payable(msg.sender);
                    value = bids[msg.sender];
                }
            }
        }

        bids[recipient] = 0;
        recipient.transfer(value);
    }

}