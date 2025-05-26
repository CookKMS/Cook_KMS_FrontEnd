import React from 'react';
import Header from '../components/Header';

function Knowledge() {
  return (
    <>
      <Header />
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>지식 관리 페이지</h2>
        <p>문의하실 내용을 작성해주세요.</p>
      </div>
    </>
  );
}

export default Knowledge;