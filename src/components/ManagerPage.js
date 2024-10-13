import React from 'react';
import { ethers } from 'ethers';
import './ManagerPage.css'; // Import your CSS file

const ManagerPage = ({ rooms, addRoom, setPrice, price, bookRoom }) => {
  return (
    <div className="manager-page-container">
      <div className='add-room-container'>
        <h2>Add a Room</h2>
        <div className="form-container">
          <input 
            type="text" 
            placeholder="Enter room price in ETH" 
            value={price}
            className="price-input"
            onChange={(e) => setPrice(e.target.value)} 
          />
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
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index} className="room-item">
                <td>Room {room.id.toString()}</td>
                <td>{ethers.formatEther(room.price.toString())}</td>
                <td>
                  {room.isBooked ? `Booked by: ${room.bookedBy || 'Unknown'}` : "Not Booked"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManagerPage;
