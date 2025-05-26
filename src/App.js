import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Knowledge from './pages/Knowledge';
import FAQPage from './pages/FAQPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Knowledge" element={<Knowledge />} />
        <Route path="/faq" element={<FAQPage />} />
        <Route path="/my-inquiries" element={<MyInquiriesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
