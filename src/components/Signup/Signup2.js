import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useParams, useNavigate } from 'react-router-dom';

// Define the fixed set of 12 colors and their names
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

const Signin2 = () => {
    const { id } = useParams(); // Retrieve user ID from URL parameters
    const navigate = useNavigate(); // Initialize useNavigate
    const [selectedColor, setSelectedColor] = useState(colors[0].code); // Initialize with the first color
    const [colorButtons, setColorButtons] = useState(Array(6).fill(colors[0].code));
    const [colorNames, setColorNames] = useState([]);
    const [showInputText, setShowInputText] = useState(false);
    const [inputText, setInputText] = useState('');
    const [nextButtonIndex, setNextButtonIndex] = useState(0);

    useEffect(() => {
        if (!id || isNaN(id)) {
            alert('User ID is missing or invalid');
            return;
        }

        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/level2/data/${id}`);
                const { button1, button2, button3, button4, button5, button6, selected_colors } = response.data;
                setColorButtons([button1, button2, button3, button4, button5, button6]);
                setColorNames(selected_colors.split(', '));
                setInputText(selected_colors);
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Error fetching data');
            }
        };

        fetchData();
    }, [id]);

    const handleColorSelection = (e) => {
        const selected = colors.find(color => color.code === e.target.value);
        setSelectedColor(selected.code);
    };

    const handleButtonClick = () => {
        if (selectedColor && nextButtonIndex < colorButtons.length) {
            const updatedButtons = [...colorButtons];
            updatedButtons[nextButtonIndex] = selectedColor;
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

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!id || isNaN(id)) {
            alert('User ID is missing or invalid');
            return;
        }

        const buttons = colorButtons;
        const selectedColors = colorNames.join(', ');

        try {
            await axios.post('http://localhost:3001/level2/signup', {
                user_id: id,
                buttons,
                selectedColors
            });
            alert('Data updated successfully');
            navigate(`/signup/level3/${id}`); // Navigate to Signup3 after submission
        } catch (error) {
            console.error('Error updating data:', error);
            alert('There was an error updating the data!');
        }
    };

    const handleRefresh = () => {
        setColorButtons(Array(6).fill(colors[0].code));
        setColorNames([]);
        setInputText('');
        setNextButtonIndex(0);
    };

    return (
        <div className="signin2-container">
            <h2>Signup Level - 02</h2>
            <div className="color-picker-container">
                <label>Select Color:</label>
                <select value={selectedColor} onChange={handleColorSelection}>
                    {colors.map(color => (
                        <option key={color.code} value={color.code} style={{ backgroundColor: color.code }}>
                            {color.name}
                        </option>
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
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default Signin2;
