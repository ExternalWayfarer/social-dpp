import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import api  from './services/api';
import Layout from './components/layout';
import UsersPage from './pages/UsersPage'; // Импортируем страницу пользователей
import HomePage from './pages/HomePage'; // Если есть главная страница
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import AccountPage from './pages/AccountPage';
import SearchPage from './pages/SearchPage';
import RegisterPage from './pages/RegisterPage';
import PostPage from './pages/PostPage';



//import './App.css'

interface User {
  id: number;
  name: string;
}

function App() {
  return (
    <Router>
      <Layout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/post/:id" element={<PostPage />} />
        <Route path="/users" element={<UsersPage />} /> {/* Маршрут для UsersPage */}
        <Route path="/about" element={<AboutPage />} /> 
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/contacts" element={<ContactsPage />} /> 
        <Route path="/account" element={<AccountPage />} /> 
        <Route path="/search" element={<SearchPage />} /> 
      </Routes>
      </Layout>
    </Router>
  );
}
  export default App;