// src/pages/employee/EmployeeHome.js

import React from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeHeader from './EmployeeHeader'; // 사원용 헤더 컴포넌트
import '../../styles/HomePage.css'; // 스타일은 그대로 사용

function EmployeeHome() {
  const navigate = useNavigate();

  // 🔹 시작하기 버튼 클릭 시 사원용 지식관리 페이지로 이동
  const handleStartClick = () => {
    navigate('/employee-knowledge');
  };

  return (
    <>
      {/* 🔹 사원용 헤더 렌더링 */}
      <EmployeeHeader />

      {/* 🔹 홈 콘텐츠 영역 */}
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">사원을 위한 지식 포털</h1>
          <p className="home-description">
            사내 공유 지식과 문서를 한 곳에서 관리하세요.
          </p>
          <button className="start-button" onClick={handleStartClick}>
            지식 문서 확인하기
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployeeHome;
