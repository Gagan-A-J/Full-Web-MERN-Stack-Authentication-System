import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

import Login from './Login';
import Signup from './Signup';
import Home from './Home';

import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';

// Add to <Routes>


function App() {
  const token = localStorage.getItem('token');
  const [user, setUser] = useState(token ? { token } : null);

  return (
    <Routes>
      <Route path="/home" element={user ? <Home user={user} setUser={setUser} /> : <Navigate to="/login" />} />
      <Route path="/login" element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Default route */}
      <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />

    </Routes>
  );
}

export default App;