import React, { useState } from 'react';
import api from "../services/api";

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    // Логика регистрации
    try {
      const response = await api.post('/api/users/', {
        email,
        password
      });
     // return response.data;
     console.log('User created succesfully', response.data);
     alert("Registration complete")
    } catch (error) {
      console.error("Registration ERROR", error.response?.data);
      alert(`Registration error ${error.response?.data?.detail || error.message}`)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 shadow-md rounded">
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full mb-4"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
