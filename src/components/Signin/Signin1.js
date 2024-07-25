import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../css/Signin/Signin1.css';

const Signin1 = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/level1/signin', { username, password });
            const { id } = response.data;
            navigate(`/signin2/${id}`); // Navigate to Signin2 with user ID
        } catch (error) {
            console.error('Error signing in:', error);
            alert('Invalid username or password');
        }
    };

    return (
        <div className="signin1-container">
            <h2>Signin</h2>
            <form onSubmit={handleSubmit}>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default Signin1;
