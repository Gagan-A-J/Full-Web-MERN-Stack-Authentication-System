import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VerifyOTP from './Verifyotp';
import GoogleLoginButton from "./Components/GoogleLoginButton";

import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '', phone: '+91 ' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.phone.length < 10) {
      alert('Please fill in all valid fields');
      return;
    }
    try {
      const res = await axios.post('/api/auth/login', form);
      //localStorage.setItem('token', res.data.token);
      alert(res.data.message);
      setShowOTP(true);
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
      setShowOTP(false);
    }
  };

  return (
    <div className="containers">
      {!showOTP && (
        <form className="max-w-[400px] mx-auto mt-[90px] bg-white p-8 rounded-[10px] shadow-lg" onSubmit={handleSubmit}>
          <h1 className="text-2xl font-bold mb-4">Login</h1>
          <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} required />
          <br />
          <div className="relative mb-4">
            <input placeholder="Password" type={showPassword ? "text" : "password"} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-blue-600">
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </span>
          </div>
          <br />
          <input placeholder="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <br />
          <button type="submit">Send OTP</button>
          <br />
          {/*showOTP && <VerifyOTP phone={form.phone}/>*/}
          <Link className="block text-center mt-1 text-blue-500 no-underline hover:underline" to="/forgot-password">Forgot Password</Link>
          <br />
          <Link className="block text-center mt-1 text-blue-500 no-underline hover:underline" to="/signup">Don't have an account? Sign up</Link>
          <hr className='mt-2' />

          <p className='text-center mt-2'>
            OR
          </p>

          <GoogleLoginButton
            setUser={setUser}
          />
        </form>
      )}
      {showOTP && <VerifyOTP phone={form.phone} setUser={setUser} />}
    </div>
  );
}