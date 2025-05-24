import React from 'react';
import './RelatedQuestions.css';

function RelatedQuestions() {
  const questions = [
    '비밀번호 찾기 방법은 어떻게 되나요?',
    '계정 잠금 해제 방법',
    '2단계 인증 설정하기',
    '프로필 사진 변경 방법',
    '이메일 주소 변경하기',
  ];

  return (
    <div className="related-questions">
      <h2 className="related-title">
        <i className="fas fa-link icon-blue"></i> 관련 질문
      </h2>
      <ul className="related-list">
        {questions.map((q, index) => (
          <li key={index}>
            <a href="#" className="related-link">
              {q}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RelatedQuestions;
