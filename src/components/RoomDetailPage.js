// src/components/RoomDetailPage.js

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Import useNavigate
import { ethers } from 'ethers';

const RoomDetailPage = ({ contract, userAddress, isManager }) => {
  const { category } = useParams();
  const [rooms, setRooms] = React.useState([]);
  const navigate = useNavigate(); // Initialize the navigate function

  // Redirect to Manager page if the user is a manager
  React.useEffect(() => {
    if (isManager) {
      navigate("/manager"); // Redirect to Manager page
    }
  }, [isManager, navigate]);

  const loadRoomsByCategory = async () => {
    if (contract) {
      const allRooms = await contract.getRooms();
      const filteredRooms = allRooms.filter(room => room.category.toLowerCase() === category.toLowerCase());
      setRooms(filteredRooms);
    }
  };

  React.useEffect(() => {
    loadRoomsByCategory();
  }, [contract, category]);

  const bookRoom = async (roomId, price) => {
    try {
      const transaction = await contract.bookRoom(roomId, { value: price });
      await transaction.wait();
      alert("Room booked successfully!");
      window.location.reload(); // Reload the page to reflect the booking
    } catch (error) {
      console.error("Booking failed", error);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <div className="room-detail-page">
      <h2>{category} Rooms</h2>
      {rooms.length > 0 ? (
        <ul>
          {rooms.map((room, index) => (
            <li key={index}>
              <p>Room Number: {room.roomNum.toString()}</p>
              <p>Price: {ethers.formatEther(room.price.toString())} ETH</p>
              <p>Status: {room.isBooked ? "Booked" : "Available"}</p>
              {!room.isBooked && (
                <button onClick={() => bookRoom(index, room.price)}>Book Room</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rooms available in this category.</p>
      )}
    </div>
  );
};

export default RoomDetailPage;
