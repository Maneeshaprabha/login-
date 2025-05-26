import { useState } from "react";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
//   const [error, setError] = useState("");

const handleLogin = async () => {
  try {
    const response = await axios.post("http://localhost:5000/login", {
      email,
      password,
    
    });
    localStorage.setItem("token", response.data.token);
    alert("Login successful!");
  } catch (err) {
    console.error(err);
    alert("Error: " + (err.response?.data?.message || "Login failed"));
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow">
        <h1 className="text-2xl font-bold py-2 text-center text-gray-700">
          Login
        </h1>
        <input
          type="text"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 py-2 px-4 border border-gray-300 rounded focus:ring-red-400"
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 py-2 px-4 border border-gray-300 rounded focus:ring-blue-400"
        />
        <button
          type="submit"
          onClick={handleLogin}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Login
        </button>
        {/* {error && <p className="text-red-500 mt-2">{error}</p>} */}
      </div>
    </div>
  );
}

export default Login;
