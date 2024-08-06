import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../css/Update/ForgotPassword.css'; // Adjust the path as needed

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [message, setMessage] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [otpResent, setOtpResent] = useState(false); // New state for OTP resent

    const navigate = useNavigate(); // Initialize useNavigate

    const handleSendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/forgot-password', { email });
            if (response.data.success) {
                setShowOtpInput(true);
                setOtpSent(true);
                setOtpResent(false); // Reset OTP resent state
                setMessage('OTP has been sent to your email.');
            } else {
                setMessage('Error sending OTP.');
            }
        } catch (error) {
            console.error('Error sending OTP:', error.response?.data || error.message);
            setMessage('Incorrect email, Enter a valid email address.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/verify-otp', { email, otp });
            if (response.data.success) {
                setMessage('OTP verified successfully. You can now reset your password.');
                navigate(`/update/level1/${response.data.id}`); // Navigate to the new route
            } else {
                setMessage('Invalid or expired OTP.');
            }
        } catch (error) {
            console.error('Error verifying OTP:', error.response?.data || error.message);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3001/forgot-password', { email });
            if (response.data.success) {
                setOtpResent(true);
                setMessage('OTP has been resent to your email.');
            } else {
                setMessage('Error resending OTP.');
            }
        } catch (error) {
            console.error('Error resending OTP:', error.response?.data || error.message);
            setMessage('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="forgot-password-container">
            <div className="left-section">
                <h1>SkyHook!</h1>
                <img src="/images/Forgotpassword.png" alt="Vector Illustration" className="vector-img" />
            </div>
            <div className="right-section">
                <h2>Forgot Password?</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    disabled={loading}
                />
                {!otpSent && (
                    <button onClick={handleSendOtp} disabled={loading}>
                        {loading ? 'Sending...' : 'Send OTP'}
                    </button>
                )}
                {showOtpInput && (
                    <>
                        <input
                            type="text"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            placeholder="Enter OTP"
                            disabled={loading}
                        />
                        <button onClick={handleVerifyOtp} disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </>
                )}
                {message && <p className="message">{message}</p>}
                {otpSent && !otpResent && (
                    <p className="resend-link" onClick={handleResendOtp}>
                        Resend OTP
                    </p>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
