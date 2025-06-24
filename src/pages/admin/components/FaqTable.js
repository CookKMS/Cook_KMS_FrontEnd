import React, { useState } from 'react';
import '../../../styles/Admin/FaqTable.css';
import { faqData } from '../../../data/faqData'; // ✅ 개발 초기 더미 데이터

// ✅ FAQ 카테고리는 공통 코드 테이블로 대체 가능 (예: code_type='faq_category')
const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function FaqTable() {
  // 🔹 FAQ 목록 상태
  const [faqs, setFaqs] = useState(faqData); // ✅ 백엔드 연동 시 API 데이터로 교체
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // 🔹 필터 및 검색 상태
  const [filter, setFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');

  // 🔹 모달 상태
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [currentFaq, setCurrentFaq] = useState(null);
  const [file, setFile] = useState(null); // 첨부파일

  // 🔹 필터링 & 검색 처리
  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = filter === '전체' || faq.category === filter;
    const matchSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  // 🔹 페이지네이션 처리
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ 등록 or 수정 저장 처리
  // Flask 연동 시 POST /api/faqs, PUT /api/faqs/:id
  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;

    const newFaq = {
      id: modalType === 'add' ? Date.now() : currentFaq.id,
      question: form.question.value,
      answer: form.answer.value,
      category: form.category.value,
      file: file ? file.name : currentFaq?.file || '',
    };

    if (modalType === 'add') {
      setFaqs([newFaq, ...faqs]);
    } else {
      setFaqs(faqs.map(f => f.id === newFaq.id ? newFaq : f));
    }

    setModalType(null);
    setFile(null);
  };

  // ✅ 삭제 처리 (DELETE /api/faqs/:id)
  const handleDelete = () => {
    setFaqs(faqs.filter(f => f.id !== currentFaq.id));
    setModalType(null);
  };

  return (
    <div className="faq-table-wrapper">
      {/* 🔹 상단 필터/검색/추가 */}
      <div className="table-header">
        <h2>FAQ 관리</h2>
        <div className="filter-section">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {categories.map(category => <option key={category}>{category}</option>)}
          </select>
          <input
            type="text"
            placeholder="검색..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
          <button className="add-button" onClick={() => { setModalType('add'); setCurrentFaq(null); }}>
            + 새 FAQ 추가
          </button>
        </div>
      </div>

      {/* 🔹 FAQ 테이블 목록 */}
      <table className="faq-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {paginatedFaqs.map(faq => (
            <tr key={faq.id}>
              <td>{faq.question}</td>
              <td>{faq.category}</td>
              <td>
                <button className="icon-btn" onClick={() => { setModalType('edit'); setCurrentFaq(faq); }}>✏️</button>
                <button className="icon-btn" onClick={() => { setModalType('delete'); setCurrentFaq(faq); }}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 🔹 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* 🔹 등록 / 수정 모달 */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{modalType === 'add' ? '새 FAQ 추가' : 'FAQ 수정'}</h3>

            <div className="modal-row">
              <label>제목</label>
              <div className="input-area">
                <input name="question" defaultValue={currentFaq?.question || ''} placeholder="FAQ 제목을 입력하세요" required />
              </div>
            </div>

            <div className="modal-row">
              <label>내용</label>
              <div className="input-area">
                <textarea name="answer" defaultValue={currentFaq?.answer || ''} placeholder="FAQ 내용을 입력하세요" required />
              </div>
            </div>

            <div className="modal-row">
              <label>카테고리</label>
              <div className="input-area">
                <select name="category" defaultValue={currentFaq?.category || ''} required>
                  <option value="">카테고리 선택</option>
                  {categories.slice(1).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="modal-row">
              <label>첨부 파일</label>
              <div className="input-area">
                <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => setFile(e.target.files[0])} />
                {currentFaq?.file && (
                  <div className="file-preview">
                    첨부 파일: {currentFaq.file}
                  </div>
                )}
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="cancel" onClick={() => setModalType(null)}>취소</button>
              <button type="submit" className="primary">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* 🔹 삭제 확인 모달 */}
      {modalType === 'delete' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 <strong>"{currentFaq.question}"</strong> FAQ를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button className="cancel" onClick={() => setModalType(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
