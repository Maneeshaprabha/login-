import axios from 'axios';
import React, { useState } from 'react'

function  Register  ()  {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:5000/register", { email, password });
      alert("Registration successful!");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };
 
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-sm p-6 bg-white border rounded shadow">
        <h1 className="text-2xl font-bold text-center text-gray-700">Register</h1>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 py-2 px-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 py-2 px-4 border rounded"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-green-600 text-white py-2 rounded"
        >
          Register
        </button>
      </div>
    </div>
  );
}

export default Register;
  

