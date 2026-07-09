/*import React, { useState } from 'react';
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
    <form className="max-w-[400px] mx-auto mt-[90px] bg-white p-8 rounded-[10px] shadow-lg" onSubmit={handleVerify}>
      <h1 className="text-2xl font-bold mb-4">Verify OTP</h1>
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
*/
/*import React, { useState, useRef, useEffect } from 'react';

//const VerifyOTP = ({ phone, setUser, length = 6, onComplete }) => {
  //const [otp, setOtp] = useState(Array(6).fill(''));
  //const inputs = useRef([]);
const OTPInput = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!value.match(/^\d?$/)) return; // Single digit or empty

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputs.current[index - 1].focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    const newOtp = pastedData.padEnd(length, '').split('');
    setOtp(newOtp);
    inputs.current[length - 1]?.focus();
    if (newOtp.every(digit => digit !== '')) {
      onComplete?.(newOtp.join(''));
    }
  };

  return (
    <div 
      style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}
      onPaste={handlePaste}
    >
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputs.current[index] = el)}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="\d{1}"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          style={{
            width: '3rem',
            height: '3rem',
            textAlign: 'center',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            border: '2px solid #ddd',
            borderRadius: '0.5rem',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
};

const App = () => {
  const handleOtpComplete = (otpValue) => {
    console.log('OTP Entered:', otpValue); // Verify with backend API
    alert(`OTP: ${otpValue}`);
  };

  return (
    <div style={{ padding: '2rem', textAlign: 'center', maxWidth: '400px', margin: '0 auto' }}>
      <h1 className="text-2xl">Enter OTP</h1>
      <p>Check your phone for a 6-digit code</p>
      <OTPInput length={6} onComplete={handleOtpComplete} />
      <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>
        Use arrow keys or backspace to navigate
      </div>
    </div>
  );
};

export default App;
*/
import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function VerifyOTP({ phone, setUser, length = 6 }) {
  const [otp, setOtp] = useState(Array(length).fill(""));
  const [loading, setLoading] = useState(false);

  const inputs = useRef([]);
  const navigate = useNavigate();

  // Auto focus first input
  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  // Verify OTP with backend
  const verifyOTP = async (otpValue) => {
    try {
      setLoading(true);

      const res = await axios.post("/api/auth/verify-otp", {
        phone,
        otp: otpValue,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({username: res.data.user.username, email: res.data.user.email}));
      setUser(res.data.user);

      alert(res.data.message);

      setTimeout(() => {
        navigate('/home');
      }, 1500);
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification failed");

      // Clear OTP if invalid
      setOtp(Array(length).fill(""));

      // Focus first input again
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // Handle input change
  const handleChange = (e, index) => {
    const value = e.target.value;

    // Allow only digits
    if (!value.match(/^\d?$/)) return;

    const newOtp = [...otp];
    newOtp[index] = value;

    setOtp(newOtp);

    // Move to next box
    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    // Auto submit when all digits entered
    if (newOtp.every((digit) => digit !== "")) {
      const finalOtp = newOtp.join("");

      verifyOTP(finalOtp);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1].focus();
    }

    if (e.key === "ArrowRight" && index < length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  // Handle paste OTP
  const handlePaste = (e) => {
    e.preventDefault();

    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    const newOtp = pastedData.split("");

    while (newOtp.length < length) {
      newOtp.push("");
    }

    setOtp(newOtp);

    // Auto verify if full OTP pasted
    if (newOtp.every((digit) => digit !== "")) {
      verifyOTP(newOtp.join(""));
    }
  };

  return (
    <div className="max-w-[500px] mx-auto mt-[90px] bg-white p-8 rounded-[10px] shadow-lg text-center">
      <h1 className="text-2xl font-bold mb-2">
        Verify OTP
      </h1>

      <p className="text-gray-500 mb-6">
        OTP sent to {phone}
      </p>

      {/* OTP BOXES */}
      <div
        className="flex justify-center gap-3"
        onPaste={handlePaste}
      >
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={digit}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={(e) => e.target.select()}
            disabled={loading}
            className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded focus:border-blue-500 focus:outline-none transition"
          />
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p className="mt-4 text-blue-500">
          Verifying OTP...
        </p>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Use arrow keys or backspace to navigate
      </div>
    </div>
  );
}

export default VerifyOTP;
