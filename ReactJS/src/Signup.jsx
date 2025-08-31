import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', form);
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <input placeholder="Username" onChange={e => setForm({ ...form, username: e.target.value })} />
      <br />
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <br />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <br />
      <button type="submit">Sign Up</button>
      <br />
      <Link className="link" to="/login">Already have an account? Login</Link>
    </form>
  );
}