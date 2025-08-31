import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', form);
      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      alert('Logged in');
      navigate('/home');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} />
      <br />
      <input placeholder="Password" type="password" onChange={e => setForm({ ...form, password: e.target.value })} />
      <br />
      <button type="submit">Log In</button>
      <br />
      <Link className="link" to="/signup">Don't have an account? Sign up</Link>
    </form>
  );
}