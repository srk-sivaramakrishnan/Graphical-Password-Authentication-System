import React, { useState, useEffect, useRef } from 'react';
import '../../css/Signup/Signup3.css';
import axios from 'axios'; // For making API requests

const imageCategories = {
    Cat: '/images/cat.jpg',
    Dog: '/images/dog.jpg',
    Car: '/images/car.jpg',
    Flower: '/images/flower.jpg',
    Chocolate: '/images/chocolate.jpg',
};

const Signup3 = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const [dropPosition, setDropPosition] = useState(Array(9).fill(null));
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const imageRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        if (selectedCategory) {
            setImage(imageCategories[selectedCategory]);
        } else {
            setImage(null);
        }
    }, [selectedCategory]);

    useEffect(() => {
        if (image && imageRef.current) {
            const img = imageRef.current;
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const numRows = 3;
            const numCols = 3;
            const cropWidth = img.naturalWidth / numCols;
            const cropHeight = img.naturalHeight / numRows;

            canvas.width = cropWidth;
            canvas.height = cropHeight;

            const croppedImagesArray = [];

            for (let row = 0; row < numRows; row++) {
                for (let col = 0; col < numCols; col++) {
                    ctx.clearRect(0, 0, cropWidth, cropHeight);
                    ctx.drawImage(
                        img,
                        col * cropWidth, row * cropHeight, cropWidth, cropHeight,
                        0, 0, cropWidth, cropHeight
                    );
                    croppedImagesArray.push(canvas.toDataURL('image/png'));
                }
            }

            setCroppedImages(croppedImagesArray);
        }
    }, [image]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleDragStart = (event, src) => {
        event.dataTransfer.setData('text/plain', src);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const cellIndex = event.target.getAttribute('data-index');
        const draggedImage = event.dataTransfer.getData('text/plain');
        if (draggedImage && cellIndex !== null) {
            const newGrid = [...dropPosition];
            newGrid[cellIndex] = draggedImage;
            setDropPosition(newGrid);
        }
    };

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userId = 1; // Replace with actual user ID logic

            await axios.post('http://localhost:3001/api/signup3', {
                user_id: userId,
                imageGrid: croppedImages,
                dropGrid: dropPosition
            });
            setMessage('Signup successful');
            alert('Signup successful');
        } catch (error) {
            setMessage('Error during signup');
            alert('Error during signup');
            console.error('Error during signup', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setSelectedCategory('');
        setImage(null);
        setCroppedImages([]);
        setDropPosition(Array(9).fill(null));
        setMessage('');
    };

    return (
        <div className="signup3-container">
            <h2>Signup Level - 03</h2>

            <div className="dropdown-section">
                <label htmlFor="category">Select Image Category:</label>
                <select
                    id="category"
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                >
                    <option value="">--Select--</option>
                    <option value="Cat">Cat</option>
                    <option value="Dog">Dog</option>
                    <option value="Car">Car</option>
                    <option value="Flower">Flower</option>
                    <option value="Chocolate">Chocolate</option>
                </select>
            </div>

            <div className="grid-container">
                <div className="image-grid-container">
                    <img src={image} alt="Selected" ref={imageRef} style={{ display: 'none' }} />
                    {croppedImages.map((src, index) => (
                        <div
                            key={index}
                            className="image-grid-cell"
                            draggable
                            onDragStart={(e) => handleDragStart(e, src)}
                        >
                            <img src={src} alt={`Cropped ${index}`} />
                        </div>
                    ))}
                </div>

                <div
                    className="drop-grid-container"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    ref={gridRef}
                >
                    {dropPosition.map((imageSrc, index) => (
                        <div
                            key={index}
                            className="drop-grid-cell"
                            data-index={index}
                        >
                            {imageSrc && <img src={imageSrc} alt={`Dropped ${index}`} />}
                        </div>
                    ))}
                </div>
            </div>

            <div className="button-actions">
                <button onClick={handleRefresh}>Refresh</button>
                <button onClick={handleSignup} disabled={loading}>
                    {loading ? 'Signing up...' : 'Signup'}
                </button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Signup3;
