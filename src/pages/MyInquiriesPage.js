import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyInquiriesPage.css";

const categories = ["전체", "새 기능", "수정", "버그", "문의", "장애", "긴급 지원"];

export default function MyInquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("전체");
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;
  const [expandedId, setExpandedId] = useState(null);
  const [showNewModal, setShowNewModal] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const deletingItem = inquiries.find(item => item.id === confirmDeleteId);

  const [newForm, setNewForm] = useState({
    title: "",
    category: "",
    customer: "",
    inquiryContent: "",
    file: null,
  });

  // ✅ 초기 더미 데이터 (Flask 연동 시 GET /api/inquiries 로 대체)
  useEffect(() => {
    const dummyData = [
      {
        id: 1,
        title: "로그인 실패",
        category: "문의",
        customer: "A전자",
        inquiryContent: "아이디와 비밀번호가 맞는데 로그인되지 않습니다.",
        answerContent: "",
        answerStatus: "답변 대기",
        date: "2023.08.01",
      },
      {
        id: 2,
        title: "신규 기능 요청",
        category: "새 기능",
        customer: "B테크",
        inquiryContent: "검색 필터에 '날짜 범위' 조건도 추가해주세요.",
        answerContent: "다음 배포 일정에 반영하겠습니다.",
        answerStatus: "답변 완료",
        date: "2023.08.02",
      },
      {
        id: 3,
        title: "버그 리포트 - 중복 등록",
        category: "버그",
        customer: "C시스템즈",
        inquiryContent: "문의 등록 시 동일 항목이 두 번 생성됩니다.",
        answerContent: "",
        answerStatus: "답변 대기",
        date: "2023.08.03",
      },
      {
        id: 4,
        title: "접속 차단 오류",
        category: "장애",
        customer: "D네트웍스",
        inquiryContent: "사내 방화벽으로 인해 외부 접속이 안 됩니다.",
        answerContent: "방화벽 예외 처리를 요청해 주세요.",
        answerStatus: "답변 완료",
        date: "2023.08.04",
      },
      {
        id: 5,
        title: "긴급 패치 요청",
        category: "긴급 지원",
        customer: "E솔루션",
        inquiryContent: "보안 취약점이 발견되어 긴급 대응이 필요합니다.",
        answerContent: "즉시 엔지니어가 대응 예정입니다.",
        answerStatus: "답변 완료",
        date: "2023.08.05",
      },
      {
        id: 6,
        title: "수정 요청 - 관리자 페이지 UI",
        category: "수정",
        customer: "F랩",
        inquiryContent: "관리자 페이지 버튼 위치가 어색합니다.",
        answerContent: "",
        answerStatus: "답변 대기",
        date: "2023.08.06",
      },
      {
        id: 7,
        title: "모바일 뷰 대응 문의",
        category: "문의",
        customer: "G테크",
        inquiryContent: "모바일에서 화면이 깨져 보입니다.",
        answerContent: "반응형 업데이트 예정입니다.",
        answerStatus: "답변 완료",
        date: "2023.08.07",
      },
      {
        id: 8,
        title: "다운로드 기능 실패",
        category: "버그",
        customer: "H전자",
        inquiryContent: "파일 다운로드 시 오류가 발생합니다.",
        answerContent: "",
        answerStatus: "답변 대기",
        date: "2023.08.08",
      },
      {
        id: 9,
        title: "로그 이력 확인 요청",
        category: "문의",
        customer: "I네트",
        inquiryContent: "특정 사용자의 접속 기록을 확인하고 싶습니다.",
        answerContent: "관리자 페이지에서 확인 가능합니다.",
        answerStatus: "답변 완료",
        date: "2023.08.09",
      },
      {
        id: 10,
        title: "권한 관리 오류",
        category: "장애",
        customer: "J소프트",
        inquiryContent: "사내 계정이 권한 없이 모든 메뉴에 접근됩니다.",
        answerContent: "패치 버전이 오늘 중 배포됩니다.",
        answerStatus: "답변 완료",
        date: "2023.08.10",
      },
      {
        id: 11,
        title: "권한 관리 오류11",
        category: "장애",
        customer: "K소프트",
        inquiryContent: "사내 계정이 권한 없이 모든 메뉴에 접근됩니다.",
        answerContent: "패치 버전이 오늘 중 배포됩니다.",
        answerStatus: "답변 완료",
        date: "2023.08.10",
      },
    ];
    setInquiries(dummyData);
  }, []);

  const filtered = inquiries.filter((item) => {
    const categoryMatch = filter === "전체" || item.category === filter;
    const searchMatch =
      item.title.includes(search) ||
      item.inquiryContent.includes(search) ||
      item.answerContent.includes(search || "");
    return categoryMatch && searchMatch;
  });

  const totalPages = Math.ceil(filtered.length / inquiriesPerPage);
  const paged = filtered.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleNewFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "fileUpload") {
      setNewForm(prev => ({ ...prev, file: files[0] || null }));
    } else {
      setNewForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const submitNewInquiry = async (e) => {
    e.preventDefault();

    const { title, category, customer, inquiryContent, file } = newForm;
    if (!title || !category || !customer || !inquiryContent) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    const created = {
      id: Date.now(),
      title,
      category,
      customer,
      inquiryContent,
      answerContent: "",
      answerStatus: "답변 대기",
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      attachment: file ? { name: file.name, url: "#" } : null,
    };

    setInquiries(prev => [created, ...prev]);
    setShowNewModal(false);
    setNewForm({ title: "", category: "", customer: "", inquiryContent: "", file: null });
    setCurrentPage(1);
  };

  const confirmDelete = async () => {
    setInquiries(prev => prev.filter(item => item.id !== confirmDeleteId));
    setConfirmDeleteId(null);
    if (expandedId === confirmDeleteId) setExpandedId(null);
  };

  return (
    <>
      <Header />
      <main className="container">
        <section>
          <hgroup>
            <h2>고객사 문의</h2>
            <h3>제조사에 문의하고 답변을 확인할 수 있는 공간입니다</h3>
          </hgroup>

          <div className="search-filter-box">
            <input
              type="text"
              placeholder="키워드 검색"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="키워드 검색"
            />
            <button className="btn" onClick={() => setShowNewModal(true)}>
              + 문의 작성
            </button>
          </div>

          <div className="filter-buttons" role="list">
            {categories.map((cat) => (
              <button
                key={cat}
                className={filter === cat ? "active" : ""}
                onClick={() => {
                  setFilter(cat);
                  setCurrentPage(1);
                }}
                type="button"
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="inquiry-header">
            <h3>나의 문의 내역</h3>
            <span>총 {filtered.length}건의 문의</span>
          </div>

          <div className="inquiry-list" role="list">
            {paged.map((item) => (
              <article
                key={item.id}
                className={`inquiry-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => toggleExpand(item.id)}
                tabIndex={0}
              >
                <header className="card-header">
                  <div className="left-group">
                    <div className="status-tags">
                      <span className="category-tag">{item.category}</span>
                      <span className={`answer-status ${item.answerStatus === "답변 완료" ? "answered" : "pending"}`}>
                        {item.answerStatus}
                      </span>
                    </div>
                    <h4 className="card-title">{item.title}</h4>
                  </div>
                  <div className="right-group">
                    <time dateTime={item.date}>{item.date}</time>
                    <div className="customer-name">{item.customer}</div>
                    <button
                      className="btn-delete"
                      aria-label="문의 삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        setConfirmDeleteId(item.id);
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </header>

                {expandedId === item.id && (
                  <section className="card-details" onClick={(e) => e.stopPropagation()}>
                    <div className="inquiry-content-section">
                      <strong>문의 내용</strong>
                      <p>{item.inquiryContent}</p>
                      {item.attachment && (
                        <a href={item.attachment.url} target="_blank" rel="noreferrer" className="attachment-link">
                          📎 {item.attachment.name}
                        </a>
                      )}
                      <time className="content-date">{item.date}</time>
                    </div>
                    {item.answerContent ? (
                      <div className="answer-section">
                        <strong>제조사 답변</strong>
                        <time className="answer-date">{item.answerDate || item.date}</time>
                        <p>{item.answerContent}</p>
                      </div>
                    ) : (
                      <div className="pending-answer-notice">
                        <i>ℹ️</i> 현재 문의 내용을 검토 중입니다. 빠른 시일 내에 답변 드리겠습니다.
                      </div>
                    )}
                  </section>
                )}
              </article>
            ))}
          </div>

          {/* ✅ 페이지네이션 */}
          {totalPages > 1 && (
            <nav className="pagination" role="navigation" aria-label="페이지네이션">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}>
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  className={currentPage === i + 1 ? "active" : ""}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
                &gt;
              </button>
            </nav>
          )}
        </section>
      </main>
    </>
  );
}
