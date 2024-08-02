import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin1.css';

const Signin1 = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
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
            alert('Error signing in, please try again');
        }
    };

    return (
        <div className="signin1-container">
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
                <div>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Sign In</button>
            </form>
        </div>
    );
};

export default Signin1;