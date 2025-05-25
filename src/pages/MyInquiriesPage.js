import React from 'react';
import Header from '../components/Header';

function MyInquiriesPage() {
  return (
    <>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>내 문의내역 페이지</h2>
        <p>지금까지 작성한 문의 목록입니다.</p>
      </div>
    </>
  );
}

export default MyInquiriesPage;