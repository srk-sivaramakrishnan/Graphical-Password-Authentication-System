import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; // Import useNavigate and useParams
import '../../css/Reset/Reset1.css'; // Correct CSS path
import '@fortawesome/fontawesome-free/css/all.min.css'; // Font Awesome import

const Reset1 = () => {
    const { id } = useParams(); // Get user_id from URL parameters
    const navigate = useNavigate(); // Initialize useNavigate
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [userName, setUserName] = useState('');

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
    }, [id]); // Use `id` as a dependency

    const handleResetPassword = async () => {
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const response = await axios.put(`http://localhost:3001/reset/level1/${id}`, { password });
            if (response.data.success) {
                alert('Password has been reset successfully.');
                // Navigate to the next level
                navigate(`/reset/level2/${id}`);
            } else {
                alert('Error resetting password.');
            }
        } catch (error) {
            console.error('Error resetting password:', error.response?.data || error.message);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset1-container">
            <div className="left-section">
                <h1 className="skyhook-text">SkyHook!</h1>
                <img src="/images/Reset1.png" alt="Vector Illustration" className="vector-img" />
            </div>
            <div className="right-section">
                <h1>Reset Password</h1>
                <h2>Level-01</h2>
                <h2>Enter your new password, <span className="username">{userName}</span></h2>
                <form>
                    <label htmlFor="password">New Password</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                        <span
                            className="password-icon"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <div className="password-container">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            disabled={loading}
                        />
                        <span
                            className="password-icon"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                        </span>
                    </div>
                    <button
                        type="button"
                        className="reset1-button"
                        onClick={handleResetPassword}
                        disabled={loading}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
                <div className="footer">
                    <p>&copy; {new Date().getFullYear()} SkyHook. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default Reset1;
