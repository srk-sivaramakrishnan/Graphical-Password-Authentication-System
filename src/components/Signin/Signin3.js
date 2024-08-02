import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin3.css'; // Adjust the path as needed

const Signin3 = () => {
    const { id } = useParams(); // Retrieve user ID from URL parameters
    const [username, setUsername] = useState('');
    const [imageGrid, setImageGrid] = useState([]);
    const [dropGrid, setDropGrid] = useState(Array(9).fill(null)); // 3x3 grid
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
                setUsername(userResponse.data); // Ensure data is a string

                // Fetch image grid
                const imageGridResponse = await axios.post('http://localhost:3001/level3/signin', { user_id: id });
                setImageGrid(imageGridResponse.data);

                // Fetch drop grid from database
                const dropGridResponse = await axios.post('http://localhost:3001/level3/getDropGrid', { user_id: id });
                setStoredDropGrid(dropGridResponse.data); // Directly set JSON data
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
        // Compare dropGrid with storedDropGrid
        const isMatch = JSON.stringify(dropGrid) === JSON.stringify(storedDropGrid);

        if (isMatch) {
            alert('The drop grid matches the stored grid!');
            navigate('/nextPage'); // Redirect or handle as needed
        } else {
            alert('The drop grid does not match the stored grid. Please try again.');
        }
    };

    return (
        <div className="signin3-container">
            <div className="header">
                <h2>Hello, {username}</h2>
            </div>
            <div className="image-grid-container">
                {imageGrid && imageGrid.map((image, index) => (
                    <img
                        key={index}
                        src={image} // Assuming image grid contains URLs or paths to images
                        alt="" // Empty alt attribute as image context is clear
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
                        {image && <img src={image} alt="" />} {/* Empty alt attribute as image context is clear */}
                    </div>
                ))}
            </div>
            <button onClick={handleVerify}>Verify</button>
        </div>
    );
};

export default Signin3;
