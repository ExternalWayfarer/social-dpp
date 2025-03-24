import React, { useState } from 'react';
import api from "../services/api";

const RegisterForm = () =>{
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/api/users');
            return response.data;
          } catch (error) {
            console.error("Registration error", error);
          }
    }
}

