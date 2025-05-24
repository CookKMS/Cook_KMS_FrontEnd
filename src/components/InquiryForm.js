import React from 'react';
import './InquiryForm.css';

function InquiryForm({ onBack }) {
  return (
    <div className="inquiry-form fade-in">
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">1:1 문의 작성</h2>
          <button onClick={onBack} className="back-btn">
            <i className="fas fa-arrow-left"></i> 뒤로가기
          </button>
        </div>

        <form>
          <div className="form-group">
            <label htmlFor="title">제목</label>
            <input type="text" id="title" placeholder="문의 제목을 입력해주세요" />
          </div>

          <div className="form-group">
            <label htmlFor="category">카테고리</label>
            <select id="category">
              <option value="">카테고리 선택</option>
              <option value="account">계정 관리</option>
              <option value="payment">결제/환불</option>
              <option value="usage">시스템 사용법</option>
              <option value="error">오류 해결</option>
              <option value="etc">기타 문의</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="content">내용</label>
            <textarea id="content" rows="8" placeholder="문의 내용을 상세히 입력해주세요"></textarea>
          </div>

          <div className="form-group">
            <label>파일 첨부</label>
            <div className="file-upload">
              <label htmlFor="file-upload" className="upload-label">
                파일 선택
                <input type="file" id="file-upload" className="sr-only" />
              </label>
              <p className="file-note">PNG, JPG, PDF, DOCX 파일 (최대 10MB)</p>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox">
              <input type="checkbox" /> 개인정보 수집 및 이용에 동의합니다
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onBack}>취소</button>
            <button type="submit" className="submit-btn">문의 등록</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InquiryForm;
