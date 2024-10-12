import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

const CONTRACT_ADDRESS = "0xB122EAA0509B4B2cb39574B53F3C1245A5a4D8E4"; // Replace with your deployed contract address
const MANAGER_ADDRESS = "0x2FF3a151fb4F539d2BaDf69591032f69B9597b69"; // Replace with the actual manager's address

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

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [price, setPrice] = useState("");  // To store room price input
  const [userAddress, setUserAddress] = useState("");
  const [isManager, setIsManager] = useState(false);  // To track if current user is a manager

  const loadBlockchainData = async (provider) => {
    try {
      const signer = await provider.getSigner();
      const hotelBookingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const rooms = await hotelBookingContract.getRooms();
      setRooms(rooms);

      const userAddress = await signer.getAddress();  // Fetch the current user's address
      setUserAddress(userAddress);

      // Manually check if the user is the predefined manager
      setIsManager(userAddress.toLowerCase() === MANAGER_ADDRESS.toLowerCase());

      setProvider(provider);
      setContract(hotelBookingContract);
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        await loadBlockchainData(provider);

        // Listen for account changes and reload blockchain data
        window.ethereum.on('accountsChanged', async (accounts) => {
          await loadBlockchainData(provider);
        });
      }
    };

    initialize();
  }, []);

  const addRoom = async () => {
    if (!price || isNaN(price)) {
      alert("Please enter a valid price.");
      return;
    }

    try {
      const transaction = await contract.addRoom(ethers.parseEther(price));  // Adding room price in ETH
      await transaction.wait();
      alert("Room added successfully!");
      window.location.reload(); // Reload the page to show updated rooms list
    } catch (error) {
      console.error("Room addition failed", error);
    }
  };

  const bookRoom = async (roomId, price) => {
    try {
      const transaction = await contract.bookRoom(roomId, { value: ethers.parseEther(price.toString()) });
      await transaction.wait();
      alert("Room booked successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Booking failed", error);
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Hotel Booking DApp</h1>

      {/* Show the user's address */}
      <p>User Address: {userAddress}</p>

      {/* Conditional UI Rendering Based on User Role */}
      {isManager ? (
        // If the user is a manager, show the hotel manager's functionalities
        <div>
          <h2>Add a Room</h2>
          <input 
            type="text" 
            placeholder="Enter room price in ETH" 
            value={price}
            onChange={(e) => setPrice(e.target.value)} 
          />
          <button onClick={addRoom}>Add Room</button>
        </div>
      ) : (
        // If the user is not a manager, they are a customer, so show customer functionalities
        <div>
          <p>Welcome, valued customer! Browse rooms below and make a booking.</p>
        </div>
      )}

      {/* Display the list of rooms */}
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>
            Room {room.id} - Price: {ethers.formatEther(room.price.toString())} ETH - 
            {room.isBooked 
              ? `Booked by: ${room.bookedBy || 'Unknown'}` 
              : !isManager && (
                  // Only show the book button for customers (not managers)
                  <button onClick={() => bookRoom(room.id, ethers.formatEther(room.price))}>Book</button>
                )
            }
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
