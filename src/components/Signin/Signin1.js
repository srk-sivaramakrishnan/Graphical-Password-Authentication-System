import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin1.css';

const Signin1 = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const credentials = {
            username,
            password
        };

        try {
            const response = await axios.post('http://localhost:3001/level1/signin', credentials);
            const { userId } = response.data; // Extract userId from the response data
            navigate(`/signin/level2/${userId}`);
        } catch (error) {
            console.error('There was an error signing in!', error);
            alert('Incorrect username or password');
        }
    };

    return (
        <div className="signin1-container">
            <div className="left-section">
                <div className="skyhook-text">SkyHook</div>
                <img src="/images/Signin1.png" alt="Vector" className="vector-img" />
            </div>
            <div className="right-section">
                <h1>Level-01</h1>
                <h2>Sign In</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="password-container">
                        <label>Password:</label>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <i
                            className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'} password-icon`}
                            onClick={() => setPasswordVisible(!passwordVisible)}
                        ></i>
                    </div>
                    <button type="submit" className="signin1-button">Sign In</button>
                </form>
                <div className="forgot-password1">
                    <a href="/forgot-password">Forgot password?</a>
                </div>
                <footer className="footer">
                    <p>© 2024 SkyHook. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Signin1;
