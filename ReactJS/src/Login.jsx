import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import VerifyOTP from './Verifyotp';

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: '', password: '', phone: '+91 ' });
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
        <form className="container" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} required />
          <br />
          <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} required />
          <br />
          <input placeholder="Phone Number" type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required />
          <br />
          <button type="submit">Send OTP</button>
          <br />
          {/*showOTP && <VerifyOTP phone={form.phone}/>*/}
          <Link className="link" to="/forgot-password">Forgot Password</Link>
          <br />
          <Link className="link" to="/signup">Don't have an account? Sign up</Link>
        </form>
      )}
      {showOTP && <VerifyOTP phone={form.phone} setUser={setUser} />}
    </div>
  );
}