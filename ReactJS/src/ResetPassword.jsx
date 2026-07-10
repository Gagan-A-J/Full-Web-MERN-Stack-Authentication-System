import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const resetToken = localStorage.getItem('resetToken');
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const reset = async (e) => {
    e.preventDefault();
    if (!resetToken) {
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
      <br />
      <div className="relative mb-4">
        <input type={showPassword ? "text" : "password"} placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })
        } required />

        <span
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </span>
      </div>
      <button onClick={reset}>Reset Password</button>
      <p>{msg}</p>
    </div>
  );
}