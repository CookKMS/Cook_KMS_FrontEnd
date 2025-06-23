import React, { useState } from 'react';
import '../../../styles/Admin/FaqTable.css';
import { faqData } from '../../../data/faqData'; // ✅ 외부 데이터 import

const categories = ['전체', '설치,구성', '접근통제', '계정관리', '기타'];

export default function FaqTable() {
  const [faqs, setFaqs] = useState(faqData); // ✅ 공통 데이터 사용
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [filter, setFilter] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalType, setModalType] = useState(null);
  const [currentFaq, setCurrentFaq] = useState(null);
  const [file, setFile] = useState(null);

  const filteredFaqs = faqs.filter(faq => {
    const matchCategory = filter === '전체' || faq.category === filter;
    const matchSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCategory && matchSearch;
  });

  const totalPages = Math.ceil(filteredFaqs.length / itemsPerPage);
  const paginatedFaqs = filteredFaqs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

  const handleDelete = () => {
    setFaqs(faqs.filter(f => f.id !== currentFaq.id));
    setModalType(null);
  };

  return (
    <div className="faq-table-wrapper">
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

      <div className="pagination">
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={currentPage === i + 1 ? 'active' : ''}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {(modalType === 'add' || modalType === 'edit') && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <form className="modal" onClick={(e) => e.stopPropagation()} onSubmit={handleSave}>
            <h3>{modalType === 'add' ? '새 FAQ 추가' : 'FAQ 수정'}</h3>
            <label>
              제목
              <input name="question" defaultValue={currentFaq?.question || ''} required />
            </label>
            <label>
              내용
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

      {modalType === 'delete' && (
        <div className="modal-backdrop" onClick={() => setModalType(null)}>
          <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
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
