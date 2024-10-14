import { ethers } from 'ethers'; // Import ethers
import React, { useEffect, useState } from 'react';
import icon from '../assets/metamask-icon.png';
import logo from '../assets/bchain-logo.png'
import "./Nav.css";

const Nav = ({ userAddress, provider }) => {
  const [balance, setBalance] = useState('');

  // Fetch the balance when the provider or userAddress changes
  useEffect(() => {
    const getBalance = async () => {
      if (provider && userAddress) {
        const balance = await provider.getBalance(userAddress);
        const ethBalance = ethers.formatEther(balance); // Convert balance to ETH
        setBalance(parseFloat(ethBalance).toFixed(4)); // Show 4 decimal places
      }
    };

    getBalance();
  }, [provider, userAddress]);

  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="nav-left-section">
          <div className='logo-container'>
            <h3>Hotel DApp</h3>
          </div>

          <div className="nav-links">
            <p>Home</p>
            <p>About</p>
          </div>
          
        </div>
        

        <div className="user-info">
          <div className="user-avatar">
            <span className="user-address">0x{userAddress.slice(2, 6)}...{userAddress.slice(-4)}</span>
            <p className="eth-balance">{balance} ETH</p>
          </div>
          
          <img className="metamask-icon" src={icon}/>
        </div>
      </nav>
    </div>
  );
};

export default Nav;
