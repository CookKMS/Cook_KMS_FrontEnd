import React from 'react';
import './InquiryList.css';

function InquiryList() {
  const inquiries = [
    {
      id: 3,
      title: '비밀번호 변경이 안 돼요',
      category: '계정 관리',
      date: '2023.06.15',
      status: '답변 완료',
    },
    {
      id: 2,
      title: '결제 취소 문의',
      category: '결제/환불',
      date: '2023.06.10',
      status: '답변 완료',
    },
    {
      id: 1,
      title: '시스템 오류 문의',
      category: '오류 해결',
      date: '2023.06.05',
      status: '처리 중',
    },
  ];

  return (
    <div className="inquiry-list fade-in">
      <div className="list-header">
        <h2>내 문의 내역</h2>
      </div>

      <div className="table-wrapper">
        <table className="inquiry-table">
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>카테고리</th>
              <th>등록일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq.id}>
                <td>{inq.id}</td>
                <td>{inq.title}</td>
                <td>{inq.category}</td>
                <td>{inq.date}</td>
                <td>
                  <span className={`status ${inq.status === '답변 완료' ? 'complete' : 'pending'}`}>
                    {inq.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <p>총 {inquiries.length}건의 문의 내역이 있습니다.</p>
        <div className="page-buttons">
          <button>이전</button>
          <button>1</button>
          <button>다음</button>
        </div>
      </div>
    </div>
  );
}

export default InquiryList;
