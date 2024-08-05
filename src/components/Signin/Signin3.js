import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin3.css'; // Adjust the path as needed

const Signin3 = () => {
    const { id } = useParams();
    const [username, setUsername] = useState('');
    const [imageGrid, setImageGrid] = useState([]); // Store image URLs
    const [dropGrid, setDropGrid] = useState(Array(9).fill(null)); // Initialize with 9 null values
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

                // Fetch image grid (fetch once)
                const imageGridResponse = await axios.post('http://localhost:3001/level3/signin', { user_id: id });
                setImageGrid(imageGridResponse.data);
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
        try {
            const response = await axios.post('http://localhost:3001/level3/verifyDropGrid', { user_id: id, drop_grid: dropGrid });
            if (response.data.success) {
                alert('Login Successfully');
                navigate('/nextPage');
            } else {
                alert('Incorrect arrangement, please try again.');
            }
        } catch (error) {
            console.error('Error verifying drop grid:', error);
            alert('An error occurred. Please try again.');
        }
    };

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className="signin3-container">
            <div className="left-section">
                <div className="skyhook-text">SkyHook!</div>
                <img src="/images/Signin3.png" alt="Skyhook promotional graphic" className="vector-img" />
            </div>
            <div className="right-section">
                <div className="header">
                    <h1>Level-03</h1>
                    <div className="header-hello"><h2>Sign In</h2></div>
                    <h1>Hello, <span className="username">{username}</span></h1>
                </div>
                <div className="right-section-content">
                    <div className="image-grid-container">
                        {imageGrid.map((image, index) => (
                            <div
                                key={index}
                                className="image-grid-item"
                                style={{ backgroundImage: `url(${image})` }}
                                draggable
                                onDragStart={(e) => handleDragStart(e, image)}
                            >
                            </div>
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
                <div className="button-container">
                    <button onClick={handleRefresh} className="refresh-button">Refresh</button>
                    <button onClick={handleVerify}>Signin</button>
                </div>
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
