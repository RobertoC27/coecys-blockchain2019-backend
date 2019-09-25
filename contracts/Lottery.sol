pragma solidity ^0.5;

contract Lottery {
    uint public prize;
    address payable[] public players;
    address public owner;

    event createdLottery(address owner);
    event playerEntered(address player);
    event winningPlayer(uint index);

    modifier onlyOwner() {
        require(msg.sender == owner, "only owner can pick winner");
        _;
    }

    modifier minimumAmount() {
        require(msg.value >= 1 ether, "at least 1 ether must be sent");
        _;
    }

    constructor() public {
        owner = msg.sender;
        emit createdLottery(msg.sender);
    }

    function enterLottery() public minimumAmount payable {
        players.push(msg.sender);
        emit playerEntered(msg.sender);
    }

    function pickWinner() public onlyOwner payable{
        uint index = random() % players.length;
        players[index].transfer(address(this).balance);
        players = new address payable[](0);
        emit winningPlayer(index);
    }

    function random() internal view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.timestamp, players.length, block.difficulty)));
    }
}