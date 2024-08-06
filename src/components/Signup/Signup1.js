import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Signup/Signup1.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Import eye icons from react-icons

const Signup1 = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            name,
            username,
            email,
            phone,
            password
        };

        try {
            const response = await axios.post('http://localhost:3001/level1/signup', newUser);
            const userId = response.data.userId;
            navigate(`/signup/level2/${userId}`);
        } catch (error) {
            console.error('There was an error signing up!', error);
            alert('Already username or email exists');
        }
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <div className="signup1-container">
            <div className="left-section">
                <h1 className="skyhook-text">Skyhook</h1>
                <img className="vector-img" src="/images/Signup1.png" alt="Decorative vector graphic" />
            </div>
            <div className="right-section">
                <h1>Level-01</h1>
                <h2>Sign Up</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Username:</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Phone Number:</label>
                        <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
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
                        <span className="password-icon" onClick={togglePasswordVisibility}>
                            {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <button type="submit">Sign Up</button>
                </form>
                <div className="signin-link">
                    <p>Already have an account? <a href="/signin">Sign In</a></p>
                </div>
                <div className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Signup1;
