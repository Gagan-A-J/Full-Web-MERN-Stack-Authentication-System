import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function ResetPassword() {
  const resetToken = localStorage.getItem('resetToken');
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  const reset = async (e) => {
    e.preventDefault();
    if(!resetToken){
      setMsg('No reset token found. Please request a new password reset.');
      return;
    }
    try {
      const res = await axios.post(`/api/auth/reset-password/${token}`, { password }, {
        headers: { Authorization: `Bearer ${resetToken}` }
      });

      if (!passwordRegex.test(password)) {
        alert(res.data.message)
        return;
      }
      localStorage.removeItem('resetToken');
      setMsg(res.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setMsg('Invalid or expired token');
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New password" onChange={e => setPassword(e.target.value)} />
      <button onClick={reset}>Reset Password</button>
      <p>{msg}</p>
    </div>
  );
}