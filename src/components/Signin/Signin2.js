import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin2.css';

const Signin2 = () => {
    const { id } = useParams(); // Retrieve user ID from URL parameters
    const [buttons, setButtons] = useState(Array(6).fill('#ffffff'));
    const [selectedColors, setSelectedColors] = useState([]);
    const [inputText, setInputText] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch stored button colors and user name from the database for the given user ID
        const fetchButtonColorsAndName = async () => {
            try {
                const buttonResponse = await axios.post('http://localhost:3001/level2/signin', { user_id: id });
                const buttonData = buttonResponse.data[0];
                setButtons([buttonData.button1, buttonData.button2, buttonData.button3, buttonData.button4, buttonData.button5, buttonData.button6]);

                const userResponse = await axios.post('http://localhost:3001/level1/getUserName', { user_id: id });
                const userData = userResponse.data;
                setUsername(userData.name);
            } catch (error) {
                console.error('Error fetching button colors or user name:', error);
                alert('Error fetching data');
            }
        };

        fetchButtonColorsAndName();
    }, [id]);

    const handleButtonClick = (color) => {
        if (selectedColors.length < 3) {
            setSelectedColors((prev) => [...prev, color]);
            setInputText((prev) => (prev ? prev + ', ' + color : color));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Verify the selected colors (this could be customized based on your needs)
        const allSelectedColors = buttons.filter((button) => selectedColors.includes(button));
        if (selectedColors.length !== 3 || selectedColors.length !== allSelectedColors.length) {
            alert('Please select exactly 3 unique colors.');
            return;
        }

        try {
            await axios.post('http://localhost:3001/level2/verify', {
                user_id: id,
                selectedColors: inputText
            });
            navigate(`/signin/level3/${id}`);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    return (
        <div className="signin2-container">
            <div className="header">
                <h2>Hello, {username}</h2>
            </div>
            <div className="buttons-container">
                {buttons.map((color, index) => (
                    <button
                        key={index}
                        style={{ backgroundColor: color, borderRadius: '50%', width: '50px', height: '50px' }}
                        onClick={() => handleButtonClick(color)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <div className="input-container">
                <label>Selected Colors:</label>
                <input
                    type="text"
                    value={inputText}
                    readOnly
                />
            </div>
            <div className="button-actions">
                <button onClick={handleSubmit}>Submit</button>
            </div>
        </div>
    );
};

export default Signin2;
