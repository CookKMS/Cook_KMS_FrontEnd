import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import Knowledge from './pages/Knowledge';
import FAQPage from './pages/FAQPage';
import MyInquiriesPage from './pages/MyInquiriesPage';
import MyPage from './pages/MyPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminLoginPage from './pages/auth/AdminLoginPage';
import AdminRegisterPage from './pages/auth/AdminRegisterPage';
import EmployeeLoginPage from './pages/auth/EmployeeLoginPage';
import EmployeeRegisterPage from './pages/auth/EmployeeRegisterPage';

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
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin-register" element={<AdminRegisterPage />} />
        <Route path="/employee-login" element={<EmployeeLoginPage />} />
        <Route path="/employee-register" element={<EmployeeRegisterPage />} />

        {/* ✅ 관리자 페이지 경로 */}
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
