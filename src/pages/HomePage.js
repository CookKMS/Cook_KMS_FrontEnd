import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import '../styles/HomePage.css';

function HomePage() {
  const navigate = useNavigate();

  const handleStartClick = () => {
    navigate('/Knowledge');
  };

  return (
    <>
      <Header />
      <div className="home-container">
        <div className="home-content">
          <h1 className="home-title">쉽고 빠른 지식관리 시스템</h1>
          <p className="home-description">모든 문의와 답변, 지식 자료를 한 곳에서 관리하세요.</p>
          <button className="start-button" onClick={handleStartClick}>지식 검색 시작하기</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
