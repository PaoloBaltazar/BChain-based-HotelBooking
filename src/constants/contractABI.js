// src/constants/contractABI.js

const contractABI = [
  {
    "inputs": [],
    "name": "getRooms",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "id", "type": "uint256" },
          { "internalType": "uint256", "name": "price", "type": "uint256" },
          { "internalType": "bool", "name": "isBooked", "type": "bool" },
          { "internalType": "address", "name": "bookedBy", "type": "address" }
        ],
        "internalType": "struct HotelBooking.Room[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_price", "type": "uint256" }],
    "name": "addRoom",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_roomId", "type": "uint256" }],
    "name": "bookRoom",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  }
];

export default contractABI;
