import React from 'react';
import './DetailContent.css';

function DetailContent({ onBack }) {
  return (
    <div className="detail-content">
      <div className="card">
        <div className="card-header">
          <div>
            <span className="badge">계정 관리</span>
            <h2 className="card-title">비밀번호 변경 방법</h2>
          </div>
          <button onClick={onBack} className="back-button">
            <i className="fas fa-arrow-left"></i> 뒤로가기
          </button>
        </div>

        <div className="card-body">
          <h3>비밀번호 변경 절차</h3>
          <ol>
            <li>로그인 후 우측 상단의 프로필 아이콘 클릭</li>
            <li>"계정 설정" 선택</li>
            <li>비밀번호 변경 섹션으로 이동</li>
            <li>현재 비밀번호 입력</li>
            <li>새 비밀번호 입력 (8자 이상, 영문+숫자)</li>
            <li>비밀번호 확인 입력</li>
            <li>"변경하기" 클릭</li>
          </ol>

          <h3>주의사항</h3>
          <ul>
            <li>비밀번호는 대소문자 구분</li>
            <li>이전 비밀번호 재사용 불가</li>
            <li>변경 시 모든 기기 로그아웃</li>
            <li>분실 시 "비밀번호 찾기" 이용</li>
          </ul>

          <div className="warning-box">
            <i className="fas fa-exclamation-circle"></i>
            보안을 위해 주기적으로 비밀번호를 변경하는 것을 권장합니다.
          </div>
        </div>

        <div className="card-footer">
          <h3>이 문서가 도움이 되셨나요?</h3>
          <div className="feedback-buttons">
            <button className="helpful">
              <i className="far fa-thumbs-up"></i> 도움됨
            </button>
            <button className="not-helpful">
              <i className="far fa-thumbs-down"></i> 도움안됨
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailContent;
