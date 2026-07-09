import React from 'react';
import axios from 'axios';
//import { useNavigate } from 'react-router-dom';

export default function Logout({ setUser }) {
  //const navigate = useNavigate();
  const out = async () => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    try {
      await axios.post('/api/auth/logout', {}, {
        headers: { Authorization: `Bearer ${token} && ${userData}` }
      });
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      alert('Logged out');
      //navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message);
    }
  };

  return (
    <div className="max-w-[400px] mx-auto mt-[50px] bg-white p-8 rounded-[10px] shadow-md">
      <button onClick={out}>Logout</button>
    </div>
  );
}