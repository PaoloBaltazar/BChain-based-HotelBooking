import React from 'react';
import "./Nav.css";

const Nav = () => {
  return (
    <div className="nav-container">
      <nav className="navbar">
        <div>Home</div>

        <div className="logo-container">
          <p>Blockchain-based Hotel System</p>
        </div>

        <div>User</div>
      </nav>
    </div>
  );
};

export default Nav;
