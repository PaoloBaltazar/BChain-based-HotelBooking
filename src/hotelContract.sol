// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HotelBooking {
    address public owner;
    address public managerWallet;
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
    uint256 public nextRoomId = 0; 

    constructor(address _managerWallet) {
        owner = msg.sender;
        managerWallet = _managerWallet;
        managers[owner] = true;

        // Initialize rooms
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

    function addRoom(uint _price, uint _roomNum, string memory _category) public onlyManager {
        rooms.push(Room(nextRoomId++, _roomNum, _price, false, address(0), _category));
    }

    // Delete a room by ID (only for managers)
    function deleteRoom(uint256 _roomId) public onlyManager {
        require(_roomId < rooms.length, "Room does not exist");
        
        // Remove the room by shifting the array elements
        rooms[_roomId] = rooms[rooms.length - 1]; // Copy last element into the current index
        rooms.pop(); // Remove the last element
    }

    function getRooms() public view returns (Room[] memory) {
        return rooms;
    }

    function bookRoom(uint _roomId) public payable {
        require(_roomId < rooms.length, "Room does not exist");
        Room storage room = rooms[_roomId];
        require(msg.value == room.price, "Incorrect price");
        require(!room.isBooked, "Room already booked");

        room.isBooked = true;
        room.bookedBy = msg.sender;

        (bool sent, ) = managerWallet.call{value: msg.value}("");
        require(sent, "Failed to send Ether to manager");
    }
}
