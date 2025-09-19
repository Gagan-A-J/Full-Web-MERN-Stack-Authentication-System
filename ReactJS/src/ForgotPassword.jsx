import React, { useState } from 'react';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');

  const sendReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/forgot-password', { email });
      localStorage.setItem('resetToken', res.data.token);
      setMsg(res.data.message);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error sending reset link');
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <input placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
      <button onClick={sendReset}>Send Reset Link</button>
      <p>{msg}</p>
    </div>
  );
}