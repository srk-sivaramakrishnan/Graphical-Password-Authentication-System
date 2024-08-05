import React, { useState, useEffect, useRef } from 'react';
import '../../css/Signup/Signup3.css';
import axios from 'axios';

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
    const [draggedImage, setDraggedImage] = useState(null);
    const [dropPosition, setDropPosition] = useState(Array(9).fill(null));
    const [loading, setLoading] = useState(false);
    const imageRef = useRef(null);
    const gridRef = useRef(null);

    useEffect(() => {
        if (selectedCategory) {
            setLoading(true);
            const img = new Image();
            img.src = imageCategories[selectedCategory];
            img.onload = () => {
                setImage(img.src);
                setLoading(false);
            };
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
                    croppedImagesArray.push(canvas.toDataURL('image/webp')); // Use WebP format
                }
            }

            setCroppedImages(croppedImagesArray);
        }
    }, [image]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleDragStart = (src) => {
        setDraggedImage(src);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const cellIndex = e.target.getAttribute('data-index');
        if (draggedImage && cellIndex !== null) {
            const newGrid = [...dropPosition];
            newGrid[cellIndex] = draggedImage;
            setDropPosition(newGrid);
        }
    };

    const handleSignup = async () => {
        try {
            await axios.post('http://localhost:3001/level3/signup', {
                imageGrid: croppedImages,
                dropGrid: dropPosition
            });
            alert('Signup successful!');
        } catch (error) {
            alert('Error during signup. Please try again.');
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="signup3-container">
            <div className="left-section">
                <h1 className="skyhook-text">Skyhook</h1>
                <img className="vector-img" src="/images/Signup3.png" alt="Vector" />
            </div>
            <div className="right-section">
                <div className="header">
                    <h1>Level-03</h1>
                </div>
                <div className="header-hello">
                    <h2>Sign Up</h2>
                </div>

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

                <div className="upload-box">
                    <i className="fa fa-plus"></i>
                    <label htmlFor="file-input" style={{ cursor: 'pointer' }}>Drag & Drop images or Click here to select the images</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleFileChange}
                        style={{ display: 'none' }} 
                        id="file-input" 
                    />
                </div>

                {loading && <p>Loading...</p>}

                {!loading && image && (
                    <div className="grid-container">
                        <div className="image-grid-container">
                            <img src={image} alt="Selected" ref={imageRef} style={{ display: 'none' }} />
                            {croppedImages.map((src, index) => (
                                <div
                                    key={index}
                                    className="image-grid-cell"
                                    draggable
                                    onDragStart={() => handleDragStart(src)}
                                >
                                    <img src={src} alt={`Cropped ${index}`} loading="lazy" />
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
                )}

                <div className="button-actions">
                    <button className="refresh-button" onClick={() => window.location.reload()}>Refresh</button>
                    <button className="signup-button" onClick={handleSignup}>Signup</button>
                </div>
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

export default Signup3;
