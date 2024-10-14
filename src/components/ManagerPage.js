import React, { useState } from 'react';
import { formatEther } from 'ethers';
import './ManagerPage.css'; // Import your CSS file

const ManagerPage = ({ rooms, addRoom, setPrice, price, setRoomNum, roomNum, setCategory, category }) => {
  return (
    <div className="manager-page-container">
      <div className='add-room-container'>
        <h2>Add a Room</h2>
        <div className="form-container">
          <input 
            type="text" 
            placeholder="Enter room number" 
            value={roomNum}
            className="room-num-input"
            onChange={(e) => setRoomNum(e.target.value)} 
          />
          <input 
            type="text" 
            placeholder="Enter room price in ETH" 
            value={price}
            className="room-num-input"
            onChange={(e) => setPrice(e.target.value)} 
          />
          <select 
            value={category} 
            className="category-select"
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="" disabled>Select Category</option>
            <option value="Premium">Premium</option>
            <option value="Prestige">Prestige</option>
            <option value="Presidential">Presidential</option>
          </select>
          <button onClick={addRoom} className='add-room-button'>Add Room</button>
        </div>
      </div>

      <div className='room-container'>
        <h2>Room List</h2>
        <table>
          <thead>
            <tr>
              <th>Room</th>
              <th>Price (ETH)</th>
              <th>Status</th>
              <th>Category</th>
              <th>User Address</th>
            </tr>
          </thead>
          <tbody>
            {rooms && rooms.length > 0 ? rooms.map((room, index) => (
              <tr key={index} className="room-item">
                <td>Room {room?.roomNum ? room.roomNum.toString() : 'N/A'}</td> {/* Ensure roomNum is defined */}
                <td>{room?.price ? formatEther(room.price.toString()) : 'N/A'}</td> {/* Ensure price is defined */}
                <td>{room?.isBooked ? "Booked" : "Not Booked"}</td>
                <td>{room?.category || 'N/A'}</td>
                <td>{room?.isBooked ? room.bookedBy : 'N/A'}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5">No rooms available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPage;
