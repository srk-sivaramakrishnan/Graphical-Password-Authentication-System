import React, { useState, useEffect, useRef } from 'react';
import '../../css/Signup/Signup3.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

const imageCategories = {
    Cat: '/images/cat.jpg',
    Dog: '/images/dog.jpg',
    Car: '/images/car.jpg',
    Flower: '/images/flower.jpg',
    Chocolate: '/images/chocolate.jpg',
};

const Signup3 = () => {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [croppedImages, setCroppedImages] = useState([]);
    const [dropPosition, setDropPosition] = useState(Array(9).fill(null));
    const [droppedImages, setDroppedImages] = useState(Array(9).fill(null));
    const [loading, setLoading] = useState(false);
    const gridRef = useRef(null);

    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    };

    const getCroppedImages = (img) => {
        if (!img || !(img instanceof HTMLImageElement)) return [];
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
        return croppedImagesArray;
    };

    useEffect(() => {
        if (selectedCategory) {
            loadImage(imageCategories[selectedCategory])
                .then(img => {
                    setCroppedImages(getCroppedImages(img));
                })
                .catch(err => {
                    console.error("Image loading failed", err);
                });
        } else {
            setCroppedImages([]);
        }
    }, [selectedCategory]);

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
            setDroppedImages(prevImages => {
                const updatedImages = [...prevImages];
                updatedImages[cellIndex] = draggedImage;
                return updatedImages;
            });
        }
    };

    const handleFileDrop = (event) => {
        event.preventDefault();
        const file = event.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const uploadedSrc = reader.result;
                loadImage(uploadedSrc)
                    .then(img => {
                        const newCroppedImages = getCroppedImages(img);
                        setCroppedImages(prevImages => [...prevImages, ...newCroppedImages]);
                    })
                    .catch(err => {
                        console.error("Image loading failed", err);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleFileClick = () => {
        document.getElementById('fileInput').click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const uploadedSrc = reader.result;
                loadImage(uploadedSrc)
                    .then(img => {
                        const newCroppedImages = getCroppedImages(img);
                        setCroppedImages(prevImages => [...prevImages, ...newCroppedImages]);
                    })
                    .catch(err => {
                        console.error("Image loading failed", err);
                    });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSignup = async () => {
        setLoading(true);
        try {
            const userId = 1;
            await axios.post('http://localhost:3001/api/signup3', {
                user_id: userId,
                imageGrid: croppedImages,
                dropGrid: dropPosition.map((src, index) => ({
                    src,
                    cropped: droppedImages[index] ? getCroppedImages(droppedImages[index]) : []
                }))
            });
            alert('Signup successful');
        } catch (error) {
            alert('Error during signup');
            console.error('Error during signup', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = () => {
        setSelectedCategory('');
        setCroppedImages([]);
        setDropPosition(Array(9).fill(null));
        setDroppedImages(Array(9).fill(null));
    };

    return (
        <div className="signup3-container">
            <div className="left-section">
                <h1 className="skyhook-text">Skyhook!</h1>
                <img className="vector-img" src="/images/Signup3.png" alt="Vector Graphic" />
            </div>

            <div className="right-section">
                <div className="header">
                    <h2>Level-03</h2>
                </div>
                <div className="header-hello">
                    <h3>Sign Up</h3>
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

                <div
                    className="upload-box"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={handleFileClick}
                >
                    <FontAwesomeIcon icon={faPlus} className="fa-plus" />
                    <p>Drag & Drop or Click here to upload an image</p>
                </div>
                <input
                    type="file"
                    id="fileInput"
                    style={{ display: 'none' }}
                    onChange={handleFileChange}
                />

                <div className="grid-container">
                    <div className="image-grid-container">
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
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                            >
                                {imageSrc && <img src={imageSrc} alt={`Dropped ${index}`} />}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="button-actions">
                    <button className="refresh-button" onClick={handleRefresh}>
                        Refresh
                    </button>
                    <button className="signup-button" onClick={handleSignup} disabled={loading}>
                        {loading ? 'Loading...' : 'Sign Up'}
                    </button>
                </div>
                <div className="signin-link">
                    <p>Already have an account? <a href="/signin/level1">Sign In</a></p>
                </div>
                <div className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Signup3;
