import React, { useState } from 'react';
import '../../../styles/Admin/FaqTable.css';

/**
 * ✅ FAQ 관리 테이블 (관리자 전용)
 * - CRUD 기능 포함: 목록 조회, 등록, 수정, 삭제
 * - 추후 Flask 백엔드 연동 예정
 */

// ✅ 초기 더미 데이터 (백엔드 연결 전 임시 사용)
const initialFaqs = [
  { id: 1, question: '제품 등록은 어떻게 하나요?', answer: '등록 메뉴에서 가능합니다.', category: '문의', file: '' },
  { id: 2, question: '결제 오류 발생 시 해결 방법', answer: '브라우저 캐시 삭제 후 재시도.', category: '버그', file: '' },
  { id: 3, question: '비밀번호 재설정 방법', answer: '마이페이지에서 가능합니다.', category: '버그', file: '' },
  { id: 4, question: '제품 A 사양 확인 방법', answer: '제품 페이지를 참고하세요.', category: '문의', file: '' },
  { id: 5, question: '펌웨어 업데이트 주기', answer: '매월 첫째 주입니다.', category: '수정', file: '' },
];

const categories = ['전체', '새 기능', '수정', '버그', '문의', '장애', '긴급 지원'];

export default function FaqTable() {
  const [faqs, setFaqs] = useState(initialFaqs); // ✅ FAQ 목록 상태
  const [currentPage, setCurrentPage] = useState(1); // ✅ 현재 페이지
  const itemsPerPage = 5;
  const [filter, setFilter] = useState('전체'); // ✅ 카테고리 필터
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | 'delete'
  const [currentFaq, setCurrentFaq] = useState(null); // 현재 선택된 항목
  const [file, setFile] = useState(null); // 첨부 파일 상태

  // ✅ 필터 적용된 FAQ 목록
  const filteredFaqs = filter === '전체' ? faqs : faqs.filter(faq => faq.category === filter);
  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // ✅ FAQ 저장 (등록 또는 수정)
  // Flask 연동 시:
  // - 등록: POST /api/faqs
  // - 수정: PUT /api/faqs/:id
  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;

    const newFaq = {
      id: modalType === 'add' ? Date.now() : currentFaq.id, // ❗ 실제 백엔드에서는 자동 생성
      question: form.question.value,
      answer: form.answer.value,
      category: form.category.value,
      file: file ? file.name : currentFaq?.file || '',
    };

    if (modalType === 'add') {
      setFaqs([newFaq, ...faqs]);

      // ✅ POST 예시
      // const formData = new FormData();
      // formData.append('question', newFaq.question);
      // formData.append('answer', newFaq.answer);
      // formData.append('category', newFaq.category);
      // if (file) formData.append('file', file);
      // await fetch('/api/faqs', { method: 'POST', body: formData });

    } else {
      setFaqs(faqs.map(f => f.id === newFaq.id ? newFaq : f));

      // ✅ PUT 예시
      // await fetch(`/api/faqs/${newFaq.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(newFaq),
      // });
    }

    // ✅ 파일 업로드 API 호출 예시
    // if (file) {
    //   const formData = new FormData();
    //   formData.append('file', file);
    //   await fetch('/api/upload', { method: 'POST', body: formData });
    // }

    setModalType(null);
    setFile(null);
  };

  // ✅ FAQ 삭제 처리 (Flask DELETE /api/faqs/:id)
  const handleDelete = () => {
    setFaqs(faqs.filter(f => f.id !== currentFaq.id));

    // fetch(`/api/faqs/${currentFaq.id}`, { method: 'DELETE' });

    setModalType(null);
  };

  return (
    <div className="faq-table-wrapper">
      {/* ✅ 상단 필터 및 새 추가 버튼 */}
      <div className="table-header">
        <h2>FAQ 관리</h2>
        <div className="filter-section">
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            {categories.map(category => <option key={category}>{category}</option>)}
          </select>
          <input type="text" placeholder="검색..." />
          <button className="add-button" onClick={() => { setModalType('add'); setCurrentFaq(null); }}>+ 새 FAQ 추가</button>
        </div>
      </div>

      {/* ✅ FAQ 목록 테이블 */}
      <table className="faq-table">
        <thead>
          <tr>
            <th>질문</th>
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

      {/* ✅ 페이지네이션 */}
      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button key={i} className={currentPage === i + 1 ? 'active' : ''} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
      </div>

      {/* ✅ 추가/수정 모달 */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <form className="modal" onClick={e => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{modalType === 'add' ? '새 FAQ 추가' : 'FAQ 수정'}</h3>
            <label>
              질문
              <input name="question" defaultValue={currentFaq?.question || ''} required />
            </label>
            <label>
              답변
              <textarea name="answer" defaultValue={currentFaq?.answer || ''} required />
            </label>
            <label>
              카테고리
              <select name="category" defaultValue={currentFaq?.category || ''} required>
                <option value="">카테고리 선택</option>
                {categories.slice(1).map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label>
              첨부 파일 (선택사항)
              <input type="file" accept=".pdf,.jpg,.jpeg" onChange={(e) => setFile(e.target.files[0])} />
            </label>
            <div className="modal-actions">
              <button type="button" onClick={() => setModalType(null)}>취소</button>
              <button type="submit">저장</button>
            </div>
          </form>
        </div>
      )}

      {/* ✅ 삭제 확인 모달 */}
      {modalType === 'delete' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal confirm" onClick={e => e.stopPropagation()}>
            <h3>삭제 확인</h3>
            <p>정말로 <strong>"{currentFaq.question}"</strong> FAQ를 삭제하시겠습니까?</p>
            <div className="modal-actions">
              <button onClick={() => setModalType(null)}>취소</button>
              <button className="danger" onClick={handleDelete}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
