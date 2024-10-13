// components/CustomerPage.js

import React from 'react';
import { ethers } from 'ethers';
import './CustomerPage'

const CustomerPage = ({ rooms, bookRoom }) => {
  return (
    <div>
      <p>Welcome, valued customer! Browse rooms below and make a booking.</p>
      <h2>Available Rooms</h2>
      <ul>
        {rooms.map((room, index) => (
          <li key={index}>
            Room {room.id} - Price: {ethers.formatEther(room.price.toString())} ETH - 
            {room.isBooked 
              ? "Booked" 
              : (
                  <button onClick={() => bookRoom(room.id, ethers.formatEther(room.price))}>
                    Book
                  </button>
                )
            }
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerPage;
