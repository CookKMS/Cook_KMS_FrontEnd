import React from 'react';
import './MainContent.css';

function MainContent({ onSelectDetail }) {
  return (
    <div className="main-content">
      {/* 검색창 */}
      <div className="search-box">
        <div className="search-input-wrapper">
          <input
            type="text"
            placeholder="궁금한 내용을 검색해보세요..."
            className="search-input"
          />
          <i className="fas fa-search search-icon"></i>
        </div>
      </div>

      {/* FAQ */}
      <div className="faq-section">
        <h2 className="section-title">
          <i className="fas fa-question-circle icon-blue"></i> 자주 묻는 질문
        </h2>
        <div className="faq-list">
          <div className="faq-item">
            <a href="#" className="faq-question">비밀번호를 변경하고 싶어요</a>
            <p className="faq-answer">계정 관리 &gt; 비밀번호 변경에서 가능합니다.</p>
          </div>
          <div className="faq-item">
            <a href="#" className="faq-question">결제 취소는 어떻게 하나요?</a>
            <p className="faq-answer">마이페이지 &gt; 결제 내역에서 취소 가능합니다.</p>
          </div>
          <div className="faq-item">
            <a href="#" className="faq-question">파일 업로드가 안 돼요</a>
            <p className="faq-answer">파일 크기 제한을 확인해주세요 (최대 50MB).</p>
          </div>
          <div className="faq-item">
            <a href="#" className="faq-question">회원 탈퇴 방법이 궁금해요</a>
            <p className="faq-answer">설정 &gt; 계정 관리에서 탈퇴 가능합니다.</p>
          </div>
        </div>
      </div>

      {/* 검색 결과 */}
      <div className="results-section">
        <h2 className="section-title">검색 결과</h2>
        <div className="result-card" onClick={onSelectDetail}>
          <div className="result-header">
            <div>
              <h3 className="result-title">비밀번호 변경 방법</h3>
              <span className="badge blue">계정 관리</span>
            </div>
            <span className="result-date">2023.05.12</span>
          </div>
          <p className="result-summary">
            마이페이지 &gt; 계정 설정에서 비밀번호 변경이 가능합니다. 기존 비밀번호 입력 후 새로운 비밀번호를 설정해주세요.
          </p>
        </div>

        <div className="result-card">
          <div className="result-header">
            <div>
              <h3 className="result-title">결제 오류 해결 방법</h3>
              <span className="badge green">결제/환불</span>
            </div>
            <span className="result-date">2023.04.28</span>
          </div>
          <p className="result-summary">
            결제 시 오류가 발생하는 경우, 먼저 카드 잔액을 확인해주세요. 그래도 해결되지 않으면 고객센터로 문의 바랍니다.
          </p>
        </div>

        <div className="result-card">
          <div className="result-header">
            <div>
              <h3 className="result-title">회원가입 오류 시 확인사항</h3>
              <span className="badge purple">계정 관리</span>
            </div>
            <span className="result-date">2023.03.15</span>
          </div>
          <p className="result-summary">
            회원가입 시 오류가 발생하면 이미 가입된 이메일 주소는 아닌지, 비밀번호 요구사항을 충족했는지 확인해주세요.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MainContent;
