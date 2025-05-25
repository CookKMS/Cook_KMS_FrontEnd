import React from 'react';
import Header from '../components/Header';

function HomePage() {
  return (
    <>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>홈 페이지</h2>
        <p>여기는 홈입니다.</p>
      </div>
    </>
  );
}

export default HomePage;
