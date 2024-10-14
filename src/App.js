import React from 'react';
import ManagerPage from './components/ManagerPage';
import CustomerPage from './components/CustomerPage';
import Nav from './components/Nav';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';

import contractABI from './constants/contractABI';

const CONTRACT_ADDRESS = "0xE9c394B18bb02404afEe0D6d222D9dAe578E45Ac"; // Replace with your deployed contract address
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
          deleteRoom={deleteRoom} // Pass the delete function to the ManagerPage
        />
      ) : (
        <CustomerPage rooms={rooms} />
      )}
    </div>
  );
}

export default App;
