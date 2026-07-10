import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [form, setForm] = useState({ username: '', email: '', password: '', phone: '+91 ' });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

  const getStrength = (password) => {
    let score = 0;

    if (password.length >= 8 && password.length <= 20) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*#?&]/.test(password)) score++;

    return score;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/signup', form);
      if (!passwordRegex.test(form.password)) {
        alert(res.data.message);
        return;
      }
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form className="container" onSubmit={handleSubmit}>
      <h1>Signup</h1>
      <input placeholder="Username" type="text" onChange={e => setForm({ ...form, username: e.target.value })} required />
      <br />
      <input placeholder="Email" type="email" onChange={e => setForm({ ...form, email: e.target.value })} required />
      <br />
      <input placeholder="Password" type={showPassword ? "text" : "password"} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="text-blue-500 mt-2">
        {showPassword ? "Hide Password" : "Show Password"}
      </button>
      <div className="mt-2 font-bold">

        Password Strength :

        {getStrength(form.password) <= 2 && (
          <span className="text-red-500"> Weak</span>
        )}

        {getStrength(form.password) == 3 && (
          <span className="text-yellow-500"> Medium</span>
        )}

        {getStrength(form.password) >= 4 && (
          <span className="text-green-600"> Strong</span>
        )}

      </div>
      <div className="text-left mt-3 text-sm">

        <p className={
          form.password.length >= 8
            ? "text-green-600" : "text-red-500"
        }>
          ✔ Minimum 8 characters
        </p>

        <p className={
          /[A-Z]/.test(form.password)
            ? "text-green-600" : "text-red-500"
        }>
          ✔ One uppercase letter
        </p>

        <p className={
          /[a-z]/.test(form.password)
            ? "text-green-600" : "text-red-500"
        }>
          ✔ One lowercase letter
        </p>

        <p className={
          /\d/.test(form.password)
            ? "text-green-600" : "text-red-500"
        }>
          ✔ One number
        </p>

        <p className={
          /[@$!%*#?&]/.test(form.password)
            ? "text-green-600" : "text-red-500"
        }>
          ✔ One special character
        </p>
      </div>
      <br />
      <input placeholder="Phone Number" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
      <br />
      <button type="submit">Sign Up</button>
      <br />
      <Link className="link" to="/login">Already have an account? Login</Link>
    </form>
  );
}