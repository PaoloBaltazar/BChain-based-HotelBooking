// components/ManagerPage.js

import React from 'react';
import { ethers } from 'ethers';

const ManagerPage = ({ rooms, addRoom, setPrice, price, bookRoom }) => {
  return (
    <div>
      <nav>
        
      </nav>
      <h2>Add a Room</h2>
      <input 
        type="text" 
        placeholder="Enter room price in ETH" 
        value={price}
        onChange={(e) => setPrice(e.target.value)} 
      />
      <button onClick={addRoom}>Add Room</button>

      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>
            Room {room.id} - Price: {ethers.formatEther(room.price.toString())} ETH - 
            {room.isBooked 
              ? `Booked by: ${room.bookedBy || 'Unknown'}` 
              : (
                  <button onClick={() => bookRoom(room.id, ethers.formatEther(room.price))}>Book</button>
                )
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManagerPage;
