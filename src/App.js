 

// import ParticleNetwork from "./components/ParticleNetwork.tsx"
import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import Login from './components/Login.tsx';
import Register from './components/Register.jsx';



export default function Page() {
  return (
  
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>

  );
}

  
  // <ParticleNetwork />
