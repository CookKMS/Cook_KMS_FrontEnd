// InquiryTable component (JS 기반으로 작성)
import { useState, useEffect, createElement as h } from 'react';
import '../../../styles/Admin/InquiryTable.css';

const dummyInquiries = [
  {
    id: 1,
    manufacturer: 'A 고객사',
    subject: '제품 A 펌웨어 문제',
    status: '답변 완료',
    date: '2023. 7. 15.',
    message: '제품 A의 최신 펌웨어를 설치했는데 작동이 안됩니다.',
    response: '펌웨어를 다시 설치해 보시기 바랍니다.'
  },
  {
    id: 2,
    manufacturer: 'B 고객사',
    subject: '보안 취약점 문의',
    status: '답변 대기',
    date: '2023. 7. 10.',
    message: '보안 취약점 패치가 언제 제공되나요?',
    response: ''
  }
];

export default function InquiryTable() {
  const [inquiries, setInquiries] = useState([]);
  const [filterStatus, setFilterStatus] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    setInquiries(dummyInquiries);
  }, []);

  const filtered = inquiries.filter((item) => {
    const matchStatus = filterStatus === '전체' || item.status === filterStatus;
    const matchSearch =
      item.manufacturer.includes(searchTerm) ||
      item.subject.includes(searchTerm) ||
      item.message.includes(searchTerm);
    return matchStatus && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSave = (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      status: form.status.value,
      response: form.response.value,
    };
    setInquiries((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
    setEditingItem(null);
  };

  const handleDelete = () => {
    setInquiries((prev) => prev.filter((item) => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
  };

  const deletingItem = inquiries.find((i) => i.id === confirmDeleteId);

  return h('div', { className: 'inquiry-table-wrapper' }, [
    h('div', { className: 'table-header' }, [
      h('h2', null, '🛠️ 제조사 문의 관리'),
      h('div', { className: 'table-controls' }, [
        h(
          'select',
          {
            value: filterStatus,
            onChange: (e) => setFilterStatus(e.target.value)
          },
          ['전체', '답변 대기', '답변 완료'].map((status) => h('option', { key: status }, status))
        ),
        h('input', {
          type: 'text',
          placeholder: '검색...',
          value: searchTerm,
          onChange: (e) => setSearchTerm(e.target.value)
        })
      ])
    ]),

    h('table', { className: 'inquiry-table' }, [
      h('thead', null, [
        h('tr', null, ['고객사', '제목', '상태', '등록일', '처리'].map((th) => h('th', null, th)))
      ]),
      h('tbody', null, paginated.map((item) =>
        h('tr', { key: item.id }, [
          h('td', null, item.manufacturer),
          h('td', null, item.subject),
          h('td', null,
            h('span', {
              className: `badge ${item.status === '답변 완료' ? 'badge-done' : 'badge-pending'}`
            }, item.status)
          ),
          h('td', null, item.date),
          h('td', null, [
            h('button', { className: 'view', onClick: () => setEditingItem(item) },
              item.status === '답변 완료' ? '답변 보기' : '답변 작성'
            ),
            h('button', { className: 'delete', onClick: () => setConfirmDeleteId(item.id) }, '🗑️')
          ])
        ])
      ))
    ]),

    h('div', { className: 'pagination' },
      Array.from({ length: totalPages }, (_, i) =>
        h('button', {
          key: i,
          className: currentPage === i + 1 ? 'active' : '',
          onClick: () => setCurrentPage(i + 1)
        }, i + 1)
      )
    ),

    editingItem && h('div', {
      className: 'modal-backdrop',
      onClick: () => setEditingItem(null)
    }, h('form', {
      className: 'modal',
      onClick: (e) => e.stopPropagation(),
      onSubmit: handleSave
    }, [
      h('h3', null, '문의 답변 수정'),
      h('p', null, ['고객사: ', h('strong', null, editingItem.manufacturer)]),
      h('p', null, ['제목: ', h('strong', null, editingItem.subject)]),
      h('p', null, ['문의 내용: ', editingItem.message]),
      h('label', null, [
        '상태',
        h('select', { name: 'status', defaultValue: editingItem.status }, [
          h('option', { value: '답변 대기' }, '답변 대기'),
          h('option', { value: '답변 완료' }, '답변 완료')
        ])
      ]),
      h('label', null, [
        '답변 내용',
        h('textarea', {
          name: 'response',
          defaultValue: editingItem.response,
          rows: 5,
          placeholder: '답변 내용을 입력하세요',
          required: true
        })
      ]),
      h('label', null, [
        '첨부 파일 (선택사항)',
        h('input', {
          type: 'file',
          name: 'file',
          accept: '.pdf,.jpg,.jpeg'
        })
      ]),
      h('p', { className: 'file-hint' }, 'PDF, JPG 파일만 업로드 가능 (최대 5MB)'),
      h('div', { className: 'modal-actions' }, [
        h('button', { type: 'button', onClick: () => setEditingItem(null) }, '취소'),
        h('button', { type: 'submit' }, '답변 저장')
      ])
    ])),

    confirmDeleteId && h('div', {
      className: 'modal-backdrop',
      onClick: () => setConfirmDeleteId(null)
    }, h('div', {
      className: 'modal confirm',
      onClick: (e) => e.stopPropagation()
    }, [
      h('h3', null, '삭제 확인'),
      h('p', null, ['정말로 ',
        h('strong', null, `"${deletingItem?.subject}"`),
        ' 문의를 삭제하시겠습니까?']),
      h('div', { className: 'modal-actions' }, [
        h('button', { onClick: () => setConfirmDeleteId(null) }, '취소'),
        h('button', { className: 'danger', onClick: handleDelete }, '삭제')
      ])
    ]))
  ]);
}