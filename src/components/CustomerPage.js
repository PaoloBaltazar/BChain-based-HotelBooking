// src/components/CustomerPage.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './CustomerPage.css'; // Add custom CSS here for styling
import hero from '../assets/hero-image.jpg'
import premium from '../assets/premium.jpg'
import prestige from '../assets/prestige.jpg'
import presidential from '../assets/presidential.jpg'

const CustomerPage = () => {
  return (
    <div className="customer-page">
      {/* Hero Section */}
      <div className="hero-section">
        <img 
          src={hero}
          alt="Hero accommodation" // Add meaningful alt text
          className="hero-image" 
        />
        <div className="hero-text">
          <h3>Welcome, Valued Customer!</h3>
          <h1>Accommodation</h1>
        </div>
      </div>

      <div className="room-categories-section">
        <div className="room-heading">
          <h1>Explore Our Rooms</h1>
          <p>Discover our exclusive rooms and make your booking today.</p>
        </div>
        <div className="room-category-cards">
          <Link to="/rooms/premium" className="room-category-card">
            <img src={premium} alt="Premium Room" className="category-image" /> {/* Add alt text */}
            <h3 className="category-text">Premium Rooms</h3>
            <p className="category-description">Experience the ultimate blend of luxury and comfort in our Premium rooms.</p>
          </Link>

          <Link to="/rooms/prestige" className="room-category-card">
            <img src={prestige} alt="Prestige Room" className="category-image" /> {/* Add alt text */}
            <h3 className="category-text">Prestige Rooms</h3>
            <p className="category-description">Experience luxury and comfort in our Prestige rooms.</p>
          </Link>

          <Link to="/rooms/presidential" className="room-category-card">
            <img src={presidential} alt="Presidential Room" className="category-image" /> {/* Add alt text */}
            <h3 className="category-text">Presidential Rooms</h3>
            <p className="category-description">Experience the ultimate luxury in our Presidential rooms.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
