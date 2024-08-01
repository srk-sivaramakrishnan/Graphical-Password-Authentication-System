import React, { useState, useRef, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Cropper from 'cropperjs';
import 'cropperjs/dist/cropper.min.css';
import '../../css/Signup/Signup3.css';

const Signup3 = () => {
    const [image, setImage] = useState(null);
    const [croppedImages, setCroppedImages] = useState([]);
    const cropperRef = useRef(null);
    const cropperInstance = useRef(null);
    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            const url = URL.createObjectURL(file);
            setImage(url);
        },
    });

    useEffect(() => {
        if (image && cropperRef.current) {
            cropperInstance.current = new Cropper(cropperRef.current, {
                aspectRatio: 1,
                viewMode: 1,
                autoCropArea: 1,
                cropBoxResizable: false,
            });
        }
        return () => {
            if (cropperInstance.current) {
                cropperInstance.current.destroy();
            }
        };
    }, [image]);

    const handleCrop = () => {
        if (cropperInstance.current) {
            const cropper = cropperInstance.current;
            const canvas = cropper.getCroppedCanvas();
            const croppedImagesArray = [];

            // Calculate crop width and height
            const cropWidth = canvas.width / 3;
            const cropHeight = canvas.height / 3;

            // Create a 3x3 grid of cropped images
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    const croppedCanvas = document.createElement('canvas');
                    const ctx = croppedCanvas.getContext('2d');
                    croppedCanvas.width = cropWidth;
                    croppedCanvas.height = cropHeight;

                    ctx.drawImage(
                        canvas,
                        j * cropWidth, i * cropHeight, cropWidth, cropHeight,
                        0, 0, cropWidth, cropHeight
                    );

                    const croppedImage = croppedCanvas.toDataURL('image/png');
                    croppedImagesArray.push(croppedImage);
                }
            }

            setCroppedImages(croppedImagesArray);
        }
    };

    return (
        <div className="signup3-container">
            <h2>Signup Level - 03</h2>
            <div className="main-content">
                <div className="image-upload-section">
                    <div className="image-upload-container" {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="upload-icon-container">
                            <div className="upload-icon">
                                <p>Drag 'n' drop an image here, or click to select one</p>
                            </div>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <label>Select Image:</label>
                        <select onChange={(e) => setImage(`public/images/${e.target.value}.jpg`)}>
                            <option value="">--Select Image--</option>
                            <option value="cat">Cat</option>
                            <option value="dog">Dog</option>
                            <option value="chocolate">Chocolate</option>
                            <option value="car">Car</option>
                            <option value="flower">Flower</option>
                        </select>
                    </div>
                </div>
                {image && (
                    <div className="image-display-container">
                        <img
                            ref={cropperRef}
                            src={image}
                            alt="Selected"
                            className="uploaded-image"
                        />
                    </div>
                )}
            </div>
            <div className="button-actions">
                <button onClick={handleCrop}>Crop</button>
            </div>
            {croppedImages.length > 0 && (
                <div className="cropped-images-container">
                    {croppedImages.map((src, index) => (
                        <img
                            key={index}
                            src={src}
                            alt={`Cropped ${index}`}
                            className="cropped-image"
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Signup3;
