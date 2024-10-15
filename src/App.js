// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import RoomDetailPage from './components/RoomDetailPage'; 
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import contractABI from './constants/contractABI';

const CONTRACT_ADDRESS = "0xa32899d4A9C28099Ed5db361FbB2F589f5E3A3f3"; 
const MANAGER_ADDRESS = "0xA5f8CB40B12B582844F4d7FD7B554F911bF35bDc"; 

function App() {
  const [rooms, setRooms] = useState([]);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState("");
  const [isManager, setIsManager] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const loadBlockchainData = async (provider) => {
    try {
      const signer = await provider.getSigner();
      const hotelBookingContract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);
      
      const rooms = await hotelBookingContract.getRooms();
      setRooms(rooms);

      const userAddress = await signer.getAddress();
      setUserAddress(userAddress);

      // Check if the current user is the manager
      const managerCheck = userAddress.toLowerCase() === MANAGER_ADDRESS.toLowerCase();
      setIsManager(managerCheck);

      if (managerCheck) {
        navigate("/manager"); // Redirect to Manager page if the user is a manager
      } else {
        navigate("/"); // Redirect to Customer page if the user is a customer
      }

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
    // Room addition logic
  };

  const deleteRoom = async (roomNum) => {
    // Room deletion logic
  };

  return (
    <div className="App">
      <Nav userAddress={userAddress} provider={provider} />
      <Routes>
        <Route path="/" element={isManager ? (
          <ManagerPage 
            rooms={rooms} 
            addRoom={addRoom} 
            deleteRoom={deleteRoom} 
          />
        ) : (
          <CustomerPage />
        )} />
        <Route path="/rooms/:category" element={<RoomDetailPage contract={contract} userAddress={userAddress} isManager={isManager} />} />
        <Route path="/manager" element={<ManagerPage rooms={rooms} addRoom={addRoom} deleteRoom={deleteRoom} />} />
      </Routes>
    </div>
  );
}

const AppWithRouter = () => (
  <Router>
    <App />
  </Router>
);

export default AppWithRouter;
