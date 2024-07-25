import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Signup/Signup1.css';

const Signup1 = () => {
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newUser = {
            name,
            username,
            password
        };

        try {
            const response = await axios.post('http://localhost:3001/level1/signup', newUser);
            const userId = response.data.userId; // Assuming the user ID is returned in the response
            navigate(`/signup2/${userId}`); // Navigate to Signup2 with user ID
        } catch (error) {
            console.error('There was an error signing up!', error);
            alert('Error signing up, please try again');
        }
    };

    return (
        <div className="signup1-container">
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
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup1;
