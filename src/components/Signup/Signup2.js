import React, { useState } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import '../../css/Signup/Signup2.css';

const colorOptions = ['Red', 'Green', 'Blue', 'Yellow', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Black'];

const Signup2 = () => {
    const [selectedColor, setSelectedColor] = useState('');
    const [colorButtons, setColorButtons] = useState(Array(6).fill('#ffffff'));
    const [colorNames, setColorNames] = useState([]);
    const [showInputText, setShowInputText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [nextButtonIndex, setNextButtonIndex] = useState(0);

    const handleColorSelection = (color) => {
        setSelectedColor(color);
    };

    const handleButtonClick = () => {
        if (selectedColor && nextButtonIndex < colorButtons.length) {
            const updatedButtons = [...colorButtons];
            updatedButtons[nextButtonIndex] = selectedColor;
            setColorButtons(updatedButtons);
            setNextButtonIndex(nextButtonIndex + 1);
        }
    };

    const handleButtonSelect = (color) => {
        if (!colorNames.includes(color)) {
            const updatedColorNames = [...colorNames];
            if (updatedColorNames.length < 3) {
                updatedColorNames.push(color);
            } else {
                updatedColorNames.shift();
                updatedColorNames.push(color);
            }
            setColorNames(updatedColorNames);
            setInputText(updatedColorNames.join(', '));
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    const handleSubmit = async () => {
        try {
            // Replace `userId` with the actual user ID if you have it
            const userId = 5; // Example user ID, replace with dynamic value as needed
            const response = await axios.post('http://localhost:3001/level2/signup', {
                user_id: userId,
                colorButtons,
                colorNames
            });
            alert(response.data);
        } catch (error) {
            console.error('There was an error submitting the data!', error);
            alert('Error submitting data, please try again');
        }
    };

    const handleRefresh = () => {
        setColorButtons(Array(6).fill('#ffffff'));
        setColorNames([]);
        setInputText('');
        setNextButtonIndex(0);
    };

    return (
        <div className="signup2-container">
            <h2>Level - 02</h2>
            <div className="dropdown-container">
                <label>Select Color:</label>
                <select onChange={(e) => handleColorSelection(e.target.value)} value={selectedColor}>
                    <option value="">--Select Color--</option>
                    {colorOptions.map(color => (
                        <option key={color} value={color}>{color}</option>
                    ))}
                </select>
                <button onClick={handleButtonClick}>Apply Color</button>
            </div>
            <div className="buttons-container">
                {colorButtons.map((color, index) => (
                    <button
                        key={index}
                        style={{ backgroundColor: color, borderRadius: '50%' }}
                        onClick={() => handleButtonSelect(color)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="input-container">
                <label>Selected Colors:</label>
                <div className="input-eye-container">
                    <input
                        type={showInputText ? 'text' : 'password'}
                        value={inputText}
                        onChange={handleInputChange}
                        readOnly
                    />
                    <span
                        className="eye-icon"
                        onClick={() => setShowInputText(!showInputText)}
                    >
                        {showInputText ? <FaEyeSlash /> : <FaEye />}
                    </span>
                </div>
            </div>
            <div className="button-actions">
                <button onClick={handleRefresh}>Refresh</button>
                <button onClick={handleSubmit}>Save</button>
            </div>
        </div>
    );
};

export default Signup2;