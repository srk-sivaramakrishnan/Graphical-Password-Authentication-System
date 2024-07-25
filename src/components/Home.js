import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignup = () => {
    navigate('/signup');
  };

  const handleSignin = () => {
    navigate('/signin');
  };

  return (
    <div className="home-container">
      <h1>Welcome to the Graphical Password Authentication System</h1>
      <button onClick={handleSignup}>Signup</button>
      <button onClick={handleSignin}>Signin</button>
    </div>
  );
};

export default HomePage;
