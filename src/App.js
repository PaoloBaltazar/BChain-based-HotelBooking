import React from 'react';
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import contractABI from './constants/contractABI';

const CONTRACT_ADDRESS = "0x6c095D2B2D734A72a06902e882291E80690D506a"; // Replace with your deployed contract address
const MANAGER_ADDRESS = "0xA5f8CB40B12B582844F4d7FD7B554F911bF35bDc"; // Replace with the actual manager's address

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [price, setPrice] = useState("");  // To manage room price input
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
      <Nav userAddress={userAddress} provider={provider} />
      {isManager ? (
        <ManagerPage rooms={rooms} addRoom={addRoom} setPrice={setPrice} price={price} bookRoom={bookRoom} />
      ) : (
        <CustomerPage rooms={rooms} bookRoom={bookRoom} />
      )}
    </div>
  );
}

export default App;
