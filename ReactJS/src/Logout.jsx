
import React from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

export default function Logout({ setUser }) {
  //const navigate = useNavigate();
  const out = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('token');
      setUser(null);
      alert('Logged out');
      //navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="container">
      <button onClick={out}>Logout</button>
    </div>
  );
}