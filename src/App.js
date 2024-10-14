import React from 'react';
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import contractABI from './constants/contractABI';

const CONTRACT_ADDRESS = "0x177CF8D8d37492b2EF2623C13bc2CC5D0B5a3eE4"; // Replace with your deployed contract address
const MANAGER_ADDRESS = "0xA5f8CB40B12B582844F4d7FD7B554F911bF35bDc"; // Replace with the actual manager's address

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [price, setPrice] = useState("");  // To manage room price input
  const [roomNum, setRoomNum] = useState("");  // To manage room number input
  const [category, setCategory] = useState("");  // To manage room category input
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
    if (!price || isNaN(price) || !roomNum || isNaN(roomNum) || !category) {
      alert("Please enter valid room number, price, and select a category.");
      return;
    }

    try {
      const transaction = await contract.addRoom(
        ethers.parseEther(price),  // Price in ETH
        parseInt(roomNum),         // Room number as integer
        category                   // Selected category
      );
      await transaction.wait();
      alert("Room added successfully!");
      window.location.reload(); // Reload the page to show updated rooms list
    } catch (error) {
      console.error("Room addition failed", error);
    }
  };

  return (
    <div className="App">
      <Nav userAddress={userAddress} provider={provider} />
      {isManager ? (
        <ManagerPage 
          rooms={rooms} 
          addRoom={addRoom} 
          setPrice={setPrice} 
          price={price} 
          setRoomNum={setRoomNum} 
          roomNum={roomNum} 
          setCategory={setCategory} 
          category={category} 
        />
      ) : (
        <CustomerPage rooms={rooms} />
      )}
    </div>
  );
}

export default App;
