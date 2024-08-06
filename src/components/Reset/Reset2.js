import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Reset/Reset2.css';

const colors = [
    { name: 'Red', code: '#FF0000' },
    { name: 'Green', code: '#00FF00' },
    { name: 'Blue', code: '#0000FF' },
    { name: 'Yellow', code: '#FFFF00' },
    { name: 'Orange', code: '#FFA500' },
    { name: 'Purple', code: '#800080' },
    { name: 'Cyan', code: '#00FFFF' },
    { name: 'Magenta', code: '#FF00FF' },
    { name: 'Lime', code: '#00FF00' },
    { name: 'Teal', code: '#008080' },
    { name: 'Pink', code: '#FFC0CB' },
    { name: 'Brown', code: '#A52A2A' }
];

const Reset2 = () => {
    const { id } = useParams(); // Retrieve user ID from URL parameters
    const navigate = useNavigate(); // Initialize useNavigate
    const [selectedColor, setSelectedColor] = useState('');
    const [colorButtons, setColorButtons] = useState(Array(6).fill('#FFFFFF'));
    const [colorNames, setColorNames] = useState([]);
    const [showInputText, setShowInputText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [nextButtonIndex, setNextButtonIndex] = useState(0);
    const [userName, setUserName] = useState('');

    const handleColorSelection = (e) => {
        const selected = e.target.value;
        setSelectedColor(selected);
        if (nextButtonIndex < colorButtons.length) {
            const updatedButtons = [...colorButtons];
            updatedButtons[nextButtonIndex] = selected;
            setColorButtons(updatedButtons);
            setNextButtonIndex(nextButtonIndex + 1);
        }
    };

    const handleButtonSelect = (colorCode) => {
        const colorName = colors.find(color => color.code === colorCode)?.name;
        if (colorName && !colorNames.includes(colorName)) {
            const updatedColorNames = [...colorNames];
            if (updatedColorNames.length < 3) {
                updatedColorNames.push(colorName);
            } else {
                updatedColorNames.shift();
                updatedColorNames.push(colorName);
            }
            setColorNames(updatedColorNames);
            setInputText(updatedColorNames.join(', '));
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!id || isNaN(id)) {
            alert('User ID is missing or invalid');
            return;
        }

        const buttons = colorButtons;
        const selectedColors = colorNames.join(', ');

        try {
            await axios.post('http://localhost:3001/level2/reset', {
                user_id: id,
                buttons,
                selectedColors
            });
            alert('Level-02 Reset Successfully');
            navigate(`/reset/level3/${id}`); // Navigate to Reset3 after submission
        } catch (error) {
            console.error('Error updating data:', error);
            alert('There was an error updating the data!');
        }
    };

    const handleRefresh = () => {
        setColorButtons(Array(6).fill('#FFFFFF'));
        setColorNames([]);
        setInputText('');
        setNextButtonIndex(0);
        setSelectedColor('');
    };

    return (
        <div className="reset2-container">
            <div className="left-section">
                <div className="skyhook-text">SkyHook!</div>
                <img src="/images/Reset2.png" alt="Vector" className="vector-img" />
            </div>
            <div className="right-section">
                <h1>Reset Password</h1>
                <h2>Level-02</h2>
                <h2>Enter your new password, <span className="username">{userName}</span></h2>
                <div className="color-picker-container">
                    <label>Select Color:</label>
                    <select value={selectedColor} onChange={handleColorSelection}>
                        <option value="" disabled>Select a color</option>
                        {colors.map(color => (
                            <option key={color.code} value={color.code}>
                                {color.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="buttons-container">
                    {colorButtons.map((color, index) => (
                        <button
                            key={index}
                            className="color-button"
                            onClick={() => handleButtonSelect(color)}
                            style={{ backgroundColor: color }}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="input-container">
                    <label>Selected Colors:</label>
                    <div className="input-with-icon">
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
                    <button onClick={handleSubmit}>Reset</button>
                </div>
                <div className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Reset2;
