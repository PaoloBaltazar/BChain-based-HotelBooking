// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelBooking {
    address public owner;
    address public managerWallet;  // Address to receive the booking payments
    mapping(address => bool) public managers;

    struct Room {
        uint256 id;
        uint256 roomNum;
        uint256 price;
        bool isBooked;
        address bookedBy;
        string category;
    }

    Room[] public rooms;
    uint256 public nextRoomId = 0; // Internal room ID for indexing

    constructor(address _managerWallet) {
        owner = msg.sender;
        managerWallet = _managerWallet;  // Setting manager's wallet during contract deployment
        managers[owner] = true;

        // Initialize rooms with unique room numbers and prices
        rooms.push(Room(nextRoomId++, 201, 0.01 ether, false, address(0), "Premium"));
        rooms.push(Room(nextRoomId++, 202, 0.01 ether, false, address(0), "Premium"));
        rooms.push(Room(nextRoomId++, 203, 0.02 ether, false, address(0), "Premium"));
        rooms.push(Room(nextRoomId++, 204, 0.02 ether, false, address(0), "Prestige"));
        rooms.push(Room(nextRoomId++, 205, 0.02 ether, false, address(0), "Prestige"));
        rooms.push(Room(nextRoomId++, 206, 0.02 ether, false, address(0), "Prestige"));
        rooms.push(Room(nextRoomId++, 207, 0.03 ether, false, address(0), "Presidential"));
        rooms.push(Room(nextRoomId++, 208, 0.03 ether, false, address(0), "Presidential"));
    }

    modifier onlyManager() {
        require(managers[msg.sender], "Only managers can perform this action");
        _;
    }

    function addManager(address _manager) public {
        require(msg.sender == owner, "Only the owner can add managers");
        managers[_manager] = true;
    }

    function isManager(address account) public view returns (bool) {
        return managers[account];
    }

    function removeManager(address _manager) public {
        require(msg.sender == owner, "Only the owner can remove managers");
        managers[_manager] = false;
    }

    // Add a room (only for managers)
    function addRoom(uint _price, uint _roomNum, string memory _category) public onlyManager {
        rooms.push(Room(nextRoomId, _roomNum, _price, false, address(0), _category));
        nextRoomId++; // Increment the room ID for internal indexing
    }

    // Helper function to find a room by room number
    function findRoomByNumber(uint _roomNum) internal view returns (uint256) {
        for (uint256 i = 0; i < rooms.length; i++) {
            if (rooms[i].roomNum == _roomNum) {
                return i;
            }
        }
        revert("Room not found");
    }

    // Book a room and transfer the payment to the manager's wallet
    function bookRoom(uint _roomNum) public payable {
        uint256 roomId = findRoomByNumber(_roomNum);
        Room storage room = rooms[roomId];
        
        require(msg.value == room.price, "Incorrect price");
        require(!room.isBooked, "Room already booked");

        room.isBooked = true;
        room.bookedBy = msg.sender;

        // Transfer the booking payment to the manager's wallet
        (bool sent, ) = managerWallet.call{value: msg.value}("");
        require(sent, "Failed to send Ether to manager");
    }

    // Function to get rooms list
    function getRooms() public view returns (Room[] memory) {
        return rooms;
    }

    // Withdraw function for owner (if needed)
    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        payable(owner).transfer(address(this).balance);
    }

    // Update manager's wallet (if needed)
    function updateManagerWallet(address _managerWallet) public {
        require(msg.sender == owner, "Only owner can update the manager's wallet");
        managerWallet = _managerWallet;
    }
}
