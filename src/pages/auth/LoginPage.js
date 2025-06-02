import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/auth/LoginPage.css';


function LoginPage() {
  return (
    <div className="login-container">
      {/* 글자 로고 클릭 시 홈으로 이동 */}
      <Link to="/" className="text-logo">
        지식관리
      </Link>

      <form className="auth-form">
        <input type="text" placeholder="아이디" />
        <input type="password" placeholder="비밀번호" />
        <button type="submit" className="login-button">로그인</button>
      </form>

      <div className="auth-links">
        <a href="/find-id">아이디 찾기</a>
        <span>|</span>
        <a href="/find-password">비밀번호 찾기</a>
        <span>|</span>
        <a href="/register">회원가입</a>
      </div>
    </div>
  );
}

export default LoginPage;
