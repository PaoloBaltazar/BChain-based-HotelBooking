// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import RoomDetailPage from './components/RoomDetailPage'; // Import RoomDetailPage
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractABI from './constants/contractABI';

const CONTRACT_ADDRESS = "0xa32899d4A9C28099Ed5db361FbB2F589f5E3A3f3"; // Replace with your deployed contract address
const MANAGER_ADDRESS = "0xA5f8CB40B12B582844F4d7FD7B554F911bF35bDc"; // Replace with the actual manager's address

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [price, setPrice] = useState("");
  const [roomNum, setRoomNum] = useState("");
  const [category, setCategory] = useState("");
  const [isManager, setIsManager] = useState(false);

  const loadBlockchainData = async (provider) => {
    try {
      const signer = await provider.getSigner();
      const hotelBookingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const rooms = await hotelBookingContract.getRooms();
      setRooms(rooms);

      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);

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

  const deleteRoom = async (roomNum) => {
    if (!roomNum || isNaN(roomNum)) {
        alert("Please enter a valid room number.");
        return;
    }

    const roomId = rooms.findIndex(room => room.roomNum.toString() === roomNum);
    if (roomId === -1) {
        alert("Room not found.");
        return;
    }

    try {
        const transaction = await contract.deleteRoom(roomId);
        await transaction.wait();
        alert("Room deleted successfully!");
        window.location.reload(); // Reload the page to show updated rooms list
    } catch (error) {
        console.error("Room deletion failed", error);
    }
};

  return (
    <Router>
      <div className="App">
        <Nav userAddress={userAddress} provider={provider} />
        <Routes>
          <Route path="/" element={isManager ? (
            <ManagerPage 
              rooms={rooms} 
              addRoom={addRoom} 
              setPrice={setPrice} 
              price={price} 
              setRoomNum={setRoomNum} 
              roomNum={roomNum} 
              setCategory={setCategory} 
              category={category} 
              deleteRoom={deleteRoom} // Pass the delete function to the ManagerPage
            />
          ) : (
            <CustomerPage />
          )} />
          <Route path="/rooms/:category" element={<RoomDetailPage contract={contract} userAddress={userAddress} />} />
          <Route path="/manager" element={<ManagerPage rooms={rooms} addRoom={addRoom} setPrice={setPrice} price={price} setRoomNum={setRoomNum} roomNum={roomNum} setCategory={setCategory} category={category} deleteRoom={deleteRoom} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
