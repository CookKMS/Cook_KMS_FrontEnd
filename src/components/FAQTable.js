import React from 'react';
import '../styles/FAQTable.css';

function FAQTable() {
  const faqData = [
    { no: 6, category: '교환반품', title: '배송 및 반품 안내', date: '2020-11-12' },
    { no: 5, category: '이용방법', title: '부자재가 불량이거나 없는 경우 요청 방법', date: '2017-11-22' },
    { no: 4, category: '이용방법', title: '묶음 배송 요청 방법', date: '2017-11-22' },
    { no: 3, category: '계정', title: '비밀번호 찾는 방법', date: '2017-11-22' },
    { no: 2, category: '이용방법', title: 'LINDA 쇼핑몰 이용방법', date: '2017-11-06' },
    { no: 1, category: '교환반품', title: '반품/교환 방법', date: '2017-11-03' },
  ];

  return (
    <table className="faq-table">
      <thead>
        <tr>
          <th>No</th>
          <th>카테고리</th>
          <th>제목</th>
          <th>작성시간</th>
        </tr>
      </thead>
      <tbody>
        {faqData.map((item) => (
          <tr key={item.no}>
            <td>{item.no}</td>
            <td>{item.category}</td>
            <td className="title">{item.title}</td>
            <td>{item.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default FAQTable;
