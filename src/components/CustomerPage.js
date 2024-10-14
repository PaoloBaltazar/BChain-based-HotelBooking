import React from 'react';
import { ethers } from 'ethers';
import './CustomerPage.css'; // Add custom CSS here for styling
import hero from '../assets/hero-image.jpg'
import premium from '../assets/premium.jpg'
import prestige from '../assets/prestige.jpg'
import presidential from '../assets/presidential.jpg'


const CustomerPage = ({ rooms, bookRoom }) => {
  return (
    <div className="customer-page">
      {/* Hero Section */}
      <div className="hero-section">
        <img 
          src={hero}
          alt="Hero" 
          className="hero-image" 
        />
        <div className="hero-text">
          <h3>Welcome, Valued Customer!</h3>
          <h1>Accomodation</h1>
          
        </div>
      </div>


      <div className="room-categories-section">
        <div className="room-heading">
          <h1>Explore Our Rooms</h1>
          <p>Discover our exclusive rooms and make your booking today.</p>
        </div>
        <div className="room-category-cards">
          <div 
            className="room-category-card" 
          >
            <img 
              src={premium} 
              className="category-image" 
            />
            <h3 className="category-text">Premium Rooms</h3>
            <p className="category-description">Experience the ultimate blend of luxury and comfort in our Premium rooms, designed to cater to your every need. Whether you're here for business or leisure, enjoy modern amenities, elegant interiors, and a peaceful ambiance that ensures a perfect and memorable stay.</p>
            <p>Book Now</p>
          </div>

          <div 
            className="room-category-card" 
          >
            <img 
              src={prestige} 
              className="category-image" 
            />
            <h3 className="category-text">Prestige Rooms</h3>
            <p className="category-description">Experience the ultimate blend of luxury and comfort in our Prestige rooms, designed to cater to your every need. Whether you're here for business or leisure, enjoy modern amenities, elegant interiors, and a peaceful ambiance that ensures a perfect and memorable stay.</p>
            <p>Book Now</p>
          </div>

          <div 
            className="room-category-card" 
          >
            <img 
              src={presidential} 
              className="category-image" 
            />
            <h3 className="category-text">Presidential Rooms</h3>
            <p className="category-description">Experience the ultimate blend of luxury and comfort in our Presidential rooms, designed to cater to your every need. Whether you're here for business or leisure, enjoy modern amenities, elegant interiors, and a peaceful ambiance that ensures a perfect and memorable stay.</p>
            <p>Book Now</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
