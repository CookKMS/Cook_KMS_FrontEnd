import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Knowledge from './pages/Knowledge';
import FAQPage from './pages/FAQPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// ✅ 관리자 대시보드 import 추가
import AdminDashboard from './pages/admin/AdminDashboard';

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

        {/* ✅ 관리자 페이지 경로 */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
