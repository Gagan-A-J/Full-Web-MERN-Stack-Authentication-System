import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function VerifyOTP({ phone, setUser }) {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length !== 6 && otp.type !== 'number') {
      alert('Please enter a valid 6-digit OTP');
      return;
    }
    try {
      const res = await axios.post('/api/auth/verify-otp', { phone, otp });
      localStorage.setItem('token', res.data.token);
      setUser(res.data.message);
      alert(res.data.message);
      setTimeout(() => {
        navigate('/home');
      }, 2000);
    } catch (err) {
      alert(err.response?.data?.message || 'OTP verification failed');
    }
  };

  return (
    <form className="container" onSubmit={handleVerify}>
      <h1>Verify OTP</h1>
      <input
        type="tel"
        value={phone} />
      <input
        type="text"
        maxLength={6}
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        required
      />
      <br />
      <button type="submit">Verify</button>
    </form>
  );
}

export default VerifyOTP;