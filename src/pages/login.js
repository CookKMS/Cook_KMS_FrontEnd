import React from 'react';
import Header from '../components/Header';

function MyPage() {
  return (
    <>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>마이페이지</h2>
        <p>회원 정보를 확인하세요.</p>
      </div>
    </>
  );
}

export default MyPage;