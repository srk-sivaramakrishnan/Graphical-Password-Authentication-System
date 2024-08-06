import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import '../../css/Reset/Reset3.css';

const imageCategories = {
    Cat: '/images/cat.jpg',
    Dog: '/images/dog.jpg',
    Car: '/images/car.jpg',
    Flower: '/images/flower.jpg',
    Chocolate: '/images/chocolate.jpg',
};

const Reset3 = () => {
    const { id } = useParams(); // Retrieve user_id from URL parameter
    const [selectedCategory, setSelectedCategory] = useState('');
    const [image, setImage] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const [dropPosition, setDropPosition] = useState(Array(9).fill(null));
    const [loading, setLoading] = useState(false);
    const [userName, setUserName] = useState('');
    const [draggedImage, setDraggedImage] = useState(null);
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
      // Fetch user name when component mounts
      const fetchUserName = async () => {
          try {
              const response = await axios.post('http://localhost:3001/level1/getUserName', { user_id: id });
              setUserName(response.data); // Assuming the response is just the name
          } catch (error) {
              console.error('Error fetching user name:', error.response?.data || error.message);
              alert('An error occurred while fetching the user name.');
          }
      };
      fetchUserName();
    }, [id]); 

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
                    croppedImagesArray.push(canvas.toDataURL('image/webp'));
                }
            }

            setCroppedImages(croppedImagesArray);
        }
    }, [image]);

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
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
            setDraggedImage(null); // Clear the dragged image
        }
    };

    const handleReset = async () => {
        if (!id) {
            alert('User ID is not set.');
            return;
        }
        try {
            await axios.post(`http://localhost:3001/level3/reset/${id}`, {
                imageGrid: croppedImages,
                dropGrid: dropPosition
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            alert('Images reset successful!');
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
            alert('Error resetting images. Please try again.');
        }
    };

    return (
        <div className="reset3-container">
            <div className="left-section">
                <div className="skyhook-text">SkyHook</div>
                <img src="/images/Reset3.png" alt="Vector" className="vector-img" />
            </div>

            <div className="right-section">
                <div className="header">
                    <h1>Reset Password</h1>
                </div>
                <h2>Level-03</h2>
                <h2>Choose your new Images, <span className="username">{userName}</span></h2>
                <div className="dropdown-section">
                    <label htmlFor="category">Select Image Category:</label>
                    <select
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        <option value="">--Select--</option>
                        {Object.keys(imageCategories).map(category => (
                            <option key={category} value={category}>{category}</option>
                        ))}
                    </select>
                </div>

                <div
                    className="upload-box"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                >
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
                    <button className="signup-button" onClick={handleReset}>Reset</button>
                </div>
                <div className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Reset3;
