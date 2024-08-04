import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup/level1');
  };

  const handleSignin = () => {
    navigate('/signin/level1');
  };

  return (
    <div className="home-container">
      <div className="left-section">
        <div className="skyhook-text">SkyHook</div>
        <img src="/images/Home.png" alt="Vector" className="vector-img" />
      </div>
      <div className="right-section">
        <h1>Welcome to the Graphical Password Authentication System</h1>
        <button onClick={handleSignup}>Signup</button>
        <button onClick={handleSignin}>Signin</button>
        <footer className="footer">
          <p>© 2024 All rights reserved to SkyHook</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
