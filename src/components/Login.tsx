import React, { useEffect, useState } from "react";
import {  useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

    const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("user-info")) {
      navigate("/add");
    }
  }, [navigate]);

  async function login() {
    console.warn(email, password);
    let item = { email, password };
    let result = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      
      },
      body: JSON.stringify(item),
    });
    result = await result.json();
    localStorage.setItem("user-info", JSON.stringify(result));
    navigate("/add");
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl font-bold py-2 text-center text-gray-700">
          Login
        </h1>
        {/* <input type="text" placeholder="Username" className="w-full mb-4 py-2 px-4 border border-gray-300 rounded focus:ring-red-400" />{" "} */}
        <br />
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 py-2 px-4 border border-gray-300 rounded focus:ring-red-400"
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 py-2 px-4 border border-gray-300 rounded focus:ring-blue-400"
        />
        <br />
        <button
          type="submit"
          onClick={login}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
