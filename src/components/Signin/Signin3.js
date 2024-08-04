import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin3.css'; // Adjust the path as needed

const Signin3 = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [imageGrid, setImageGrid] = useState([]);
    const [dropGrid, setDropGrid] = useState(Array(9).fill(null)); // Initialize with 9 null values
    const [storedDropGrid, setStoredDropGrid] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!id) {
            console.error('User ID is not provided');
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch username
                const userResponse = await axios.post('http://localhost:3001/level1/getUserName', { user_id: id });
                setUsername(userResponse.data);

                // Fetch image grid
                const imageGridResponse = await axios.post('http://localhost:3001/level3/signin', { user_id: id });
                setImageGrid(imageGridResponse.data);

                // Fetch drop grid from database
                const dropGridResponse = await axios.post('http://localhost:3001/level3/getDropGrid', { user_id: id });
                setStoredDropGrid(dropGridResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleDragStart = (e, image) => {
        e.dataTransfer.setData('text/plain', image);
    };

    const handleDrop = (e, index) => {
        e.preventDefault();
        const image = e.dataTransfer.getData('text/plain');
        setDropGrid((prev) => {
            const newGrid = [...prev];
            newGrid[index] = image;
            return newGrid;
        });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleVerify = async () => {
        const isMatch = JSON.stringify(dropGrid) === JSON.stringify(storedDropGrid);

        if (isMatch) {
            alert('Login Successfully');
            navigate('/nextPage');
        } else {
            alert('Incorrect password, please try again.');
        }
    };

    return (
        <div className="signin3-container">
            <div className="left-section">
                <div className="skyhook-text">Skyhook!</div>
                <img src="/images/Signin3.png" alt="Skyhook promotional graphic" className="vector-img" />
            </div>
            <div className="right-section">
                <div className="header">
                    <h1>Level-03</h1>
                    <h1>Hello, <span className="username">{username}</span></h1>
                </div>
                <div className="right-section-content">
                    <div className="image-grid-container">
                        {imageGrid && imageGrid.map((image, index) => (
                            <img
                                key={index}
                                src={image}
                                alt={`Draggable item ${index + 1}`}
                                className="image-grid-item"
                                draggable
                                onDragStart={(e) => handleDragStart(e, image)}
                            />
                        ))}
                    </div>
                    <div className="drop-grid-container">
                        {dropGrid.map((image, index) => (
                            <div
                                key={index}
                                className="drop-grid-item"
                                onDrop={(e) => handleDrop(e, index)}
                                onDragOver={handleDragOver}
                            >
                                {image && <img src={image} alt={`Dropped item ${index + 1}`} />}
                            </div>
                        ))}
                    </div>
                </div>
                <button onClick={handleVerify}>Signin</button>
                <div className="forgot-password">
                    <a href="/forgot-password">Forgotten password?</a>
                </div>
                <footer className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </footer>
            </div>
        </div>
    );
};

export default Signin3;
