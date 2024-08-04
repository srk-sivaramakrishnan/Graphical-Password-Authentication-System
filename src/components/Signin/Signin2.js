import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/Signin/Signin2.css';

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

const MAX_ATTEMPTS = 3;

const Signin2 = () => {
    const { id } = useParams();
    const [buttons, setButtons] = useState(Array(6).fill('#ffffff'));
    const [selectedColors, setSelectedColors] = useState([]);
    const [inputText, setInputText] = useState('');
    const [username, setUsername] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [isDisabled, setIsDisabled] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchButtonColorsAndName = async () => {
            try {
                const buttonResponse = await axios.post('http://localhost:3001/level2/signin', { user_id: id });
                console.log('Button Response:', buttonResponse.data); // Debugging line
                const buttonData = buttonResponse.data[0];
                setButtons([buttonData.button1, buttonData.button2, buttonData.button3, buttonData.button4, buttonData.button5, buttonData.button6]);
    
                const userResponse = await axios.post('http://localhost:3001/level1/getUserName', { user_id: id });
                console.log('User Response:', userResponse.data); // Debugging line
                setUsername(userResponse.data);
            } catch (error) {
                console.error('Error fetching button colors or user name:', error);
                alert('Error fetching data');
            }
        };
    
        fetchButtonColorsAndName();
    }, [id]);
    

    const handleButtonClick = (colorCode) => {
        if (selectedColors.length < 3) {
            const color = colors.find(c => c.code === colorCode);
            if (color && !selectedColors.includes(color.name)) {
                setSelectedColors(prev => [...prev, color.name]);
                setInputText(prev => (prev ? prev + ', ' + color.name : color.name));
            }
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (selectedColors.length !== 3) {
            alert('Please select exactly 3 unique colors.');
            return;
        }

        if (attempts >= MAX_ATTEMPTS) {
            alert('Maximum number of attempts reached.');
            setIsDisabled(true);
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
            alert('Incorrect password please try again');
            setInputText(''); // Clear the input field
            setSelectedColors([]); // Optionally clear selected colors if needed
            setAttempts(prev => prev + 1); // Increment the attempt counter
        }
    };

    return (
        <div className="signin2-container">
            <div className="left-section">
                <div className="skyhook-text">Skyhook!</div>
                <img src="/images/Signin2.png" alt="Vector" className="vector-img" />
            </div>
            <div className="right-section">
                <h2 className="level-heading">Level-02</h2>
                <h1>Hello, <span className="username">{username}</span></h1>
                <div className="buttons-container">
                    {buttons.map((colorCode, index) => (
                        <button
                            key={index}
                            style={{ backgroundColor: colorCode }}
                            onClick={() => handleButtonClick(colorCode)}
                        >
                            {index + 1}
                        </button>
                    ))}
                </div>
                <div className="input-container">
                    <label>Selected Colors:</label>
                    <div className="input-with-icon">
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            value={inputText}
                            readOnly
                        />
                        <i
                            className={`fa ${passwordVisible ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                            onClick={() => setPasswordVisible(prev => !prev)}
                        />
                    </div>
                </div>
                <div className="button-actions">
                    <button onClick={handleSubmit} disabled={isDisabled}>Submit</button>
                    <div className="forgot-password">
                        <a href="/forgot-password">Forgotten Password?</a>
                    </div>
                </div>
                <div className="footer">
                    <p>&copy; 2024 SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Signin2;
