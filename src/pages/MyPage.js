import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import "../styles/MyPage.css";

export default function MyPage() {
  const [inquiries, setInquiries] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const inquiriesPerPage = 5;

  // ✅ [Flask 연동] 로그인 사용자 본인 문의 조회
  useEffect(() => {
    const fetchMyInquiries = async () => {
      try {
        // const res = await fetch("/api/my-inquiries");
        // const data = await res.json();
        // setInquiries(data);

const dummyData = [
  {
    id: 1,
    title: "로그인 문제 발생",
    category: "문의",
    customer: "A전자",
    inquiryContent: "로그인이 간헐적으로 실패합니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.01",
  },
  {
    id: 2,
    title: "파일 업로드 오류",
    category: "버그",
    customer: "B테크",
    inquiryContent: "PDF 파일 업로드 시 실패합니다.",
    answerStatus: "답변 완료",
    answerContent: "파일 확장자 필터 문제로 수정 예정입니다.",
    date: "2023.08.02",
  },
  {
    id: 3,
    title: "신기능 요청 - 엑셀 다운로드",
    category: "새 기능",
    customer: "C시스템즈",
    inquiryContent: "표 데이터를 엑셀로 내보내고 싶습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.03",
  },
  {
    id: 4,
    title: "권한 설정이 반영되지 않음",
    category: "장애",
    customer: "D솔루션",
    inquiryContent: "권한을 부여했는데도 접근이 안 됩니다.",
    answerStatus: "답변 완료",
    answerContent: "캐시 문제로 확인되어 조치했습니다.",
    date: "2023.08.04",
  },
  {
    id: 5,
    title: "모바일 뷰 깨짐 현상",
    category: "버그",
    customer: "E디지털",
    inquiryContent: "iPhone Safari에서 UI가 깨집니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.05",
  },
  {
    id: 6,
    title: "보고서 페이지 로딩 지연",
    category: "장애",
    customer: "F랩",
    inquiryContent: "보고서 탭 클릭 시 5초 이상 지연됩니다.",
    answerStatus: "답변 완료",
    answerContent: "쿼리 최적화 후 반영 완료.",
    date: "2023.08.06",
  },
  {
    id: 7,
    title: "카테고리 정렬 기능 요청",
    category: "새 기능",
    customer: "G소프트",
    inquiryContent: "지식 목록을 카테고리로 정렬하고 싶습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.07",
  },
  {
    id: 8,
    title: "자동 로그아웃 주기 변경 요청",
    category: "수정",
    customer: "H솔루션",
    inquiryContent: "30분은 너무 짧습니다. 2시간으로 늘려주세요.",
    answerStatus: "답변 완료",
    answerContent: "보안팀 검토 후 반영 예정입니다.",
    date: "2023.08.08",
  },
  {
    id: 9,
    title: "접근권한 수정 요청",
    category: "수정",
    customer: "I전자",
    inquiryContent: "팀원에게 특정 메뉴 권한만 주고 싶습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.09",
  },
  {
    id: 10,
    title: "대시보드 지표 설명 추가 요청",
    category: "새 기능",
    customer: "J테크",
    inquiryContent: "각 지표에 마우스오버 설명이 있으면 좋겠습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.10",
  },
  {
    id: 11,
    title: "일자별 조회 필터 문의",
    category: "문의",
    customer: "K시스템",
    inquiryContent: "지난주 데이터만 조회하려면 어떻게 하나요?",
    answerStatus: "답변 완료",
    answerContent: "상단 필터에서 날짜 범위를 선택해주세요.",
    date: "2023.08.11",
  },
  {
    id: 12,
    title: "PDF 다운로드 시 파일 손상됨",
    category: "버그",
    customer: "L디바이스",
    inquiryContent: "다운받은 PDF가 열리지 않습니다.",
    answerStatus: "답변 완료",
    answerContent: "인코딩 문제 수정하여 금일 재배포했습니다.",
    date: "2023.08.12",
  },
  {
    id: 13,
    title: "인터넷 익스플로러 호환성 문의",
    category: "문의",
    customer: "M전자",
    inquiryContent: "IE11에서 정상 작동하나요?",
    answerStatus: "답변 완료",
    answerContent: "지원 중단되었으며 Chrome 사용을 권장드립니다.",
    date: "2023.08.13",
  },
  {
    id: 14,
    title: "지식 등록시 태그 기능 요청",
    category: "새 기능",
    customer: "N네트웍스",
    inquiryContent: "태그를 달아 검색성을 높이고 싶습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.14",
  },
  {
    id: 15,
    title: "알림 기능 수정 요청",
    category: "수정",
    customer: "O테크",
    inquiryContent: "이미 읽은 알림이 다시 뜹니다.",
    answerStatus: "답변 완료",
    answerContent: "읽음 상태 유지되도록 수정했습니다.",
    date: "2023.08.15",
  },
  {
    id: 16,
    title: "긴급: 데이터 유실 발생",
    category: "긴급 지원",
    customer: "P랩",
    inquiryContent: "저장한 내용이 삭제되었습니다!",
    answerStatus: "답변 완료",
    answerContent: "복구 완료. 사과의 말씀 드립니다.",
    date: "2023.08.16",
  },
  {
    id: 17,
    title: "이메일 알림 수신 오류",
    category: "버그",
    customer: "Q정보",
    inquiryContent: "일부 사용자에게 메일이 가지 않습니다.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.17",
  },
  {
    id: 18,
    title: "IE에서 파일 업로드 안됨",
    category: "장애",
    customer: "R전자",
    inquiryContent: "파일 선택창이 열리지 않습니다.",
    answerStatus: "답변 완료",
    answerContent: "브라우저 호환성 문제로 크롬 권장.",
    date: "2023.08.18",
  },
  {
    id: 19,
    title: "공통코드 관리 기능 요청",
    category: "새 기능",
    customer: "S소프트",
    inquiryContent: "카테고리/상태 값을 관리자 화면에서 수정하고 싶어요.",
    answerStatus: "답변 대기",
    answerContent: "",
    date: "2023.08.19",
  },
  {
    id: 20,
    title: "조회수 정렬 기준 문의",
    category: "문의",
    customer: "T솔루션",
    inquiryContent: "조회수 기준이 세션당인가요, 사용자당인가요?",
    answerStatus: "답변 완료",
    answerContent: "하루 기준 1사용자 1조회로 집계됩니다.",
    date: "2023.08.20",
  },
];

        setInquiries(dummyData);
      } catch (err) {
        console.error("내 문의 불러오기 실패:", err);
      }
    };
    fetchMyInquiries();
  }, []);

  const totalPages = Math.ceil(inquiries.length / inquiriesPerPage);
  const paged = inquiries.slice(
    (currentPage - 1) * inquiriesPerPage,
    currentPage * inquiriesPerPage
  );

  const handleDelete = async (id) => {
    try {
      // await fetch(`/api/inquiries/${id}`, { method: "DELETE" });
      setInquiries((prev) => prev.filter((q) => q.id !== id));
      setConfirmDeleteId(null);
    } catch (err) {
      alert("삭제 실패");
    }
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    const form = e.target;
    const updated = {
      ...editingItem,
      title: form.title.value,
      category: form.category.value,
      inquiryContent: form.inquiryContent.value,
    };

    try {
      // await fetch(`/api/inquiries/${editingItem.id}`, {
      //   method: "PUT",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(updated),
      // });

      setInquiries((prev) =>
        prev.map((q) => (q.id === updated.id ? updated : q))
      );
      setEditingItem(null);
    } catch {
      alert("수정 실패");
    }
  };

  return (
    <>
      <Header />
      <main className="container">
        <h2>MyPage - 나의 문의 내역</h2>

        {paged.map((q) => (
          <article key={q.id} className="inquiry-card">
            <header className="card-header">
              <div className="status-tags">
                <span className="category-tag">{q.category}</span>
                <span
                  className={`answer-status ${
                    q.answerStatus === "답변 완료" ? "answered" : "pending"
                  }`}
                >
                  {q.answerStatus}
                </span>
              </div>
              <h4 className="card-title">{q.title}</h4>
              <div className="right-group">
                <time>{q.date}</time>
                {q.answerStatus !== "답변 완료" ? (
                  <>
                    <button
                      className="btn-delete"
                      onClick={() => setConfirmDeleteId(q.id)}
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => setEditingItem(q)}
                    >
                      ✏️
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-disabled"
                      disabled
                      title="답변 완료된 문의는 삭제할 수 없습니다."
                    >
                      🗑️
                    </button>
                    <button
                      className="btn-disabled"
                      disabled
                      title="답변 완료된 문의는 수정할 수 없습니다."
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
            </header>
            <section className="card-details">
              <strong>문의 내용</strong>
              <p>{q.inquiryContent}</p>
              {q.answerContent && (
                <>
                  <strong>답변</strong>
                  <p>{q.answerContent}</p>
                </>
              )}
            </section>
          </article>
        ))}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="페이지 이동">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
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
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, p + 1))
              }
              disabled={currentPage === totalPages}
            >
              &gt;
            </button>
          </nav>
        )}

        {/* 수정 모달 */}
        {editingItem && (
          <div
            className="modal-backdrop"
            onClick={() => setEditingItem(null)}
          >
            <form
              className="modal"
              onClick={(e) => e.stopPropagation()}
              onSubmit={handleEditSave}
            >
              <h3>문의 수정</h3>
              <label>
                제목
                <input
                  name="title"
                  defaultValue={editingItem.title}
                  required
                />
              </label>
              <label>
                카테고리
                <select
                  name="category"
                  defaultValue={editingItem.category}
                  required
                >
                  <option value="문의">문의</option>
                  <option value="버그">버그</option>
                  <option value="장애">장애</option>
                  <option value="수정">수정</option>
                  <option value="새 기능">새 기능</option>
                  <option value="긴급 지원">긴급 지원</option>
                </select>
              </label>
              <label>
                내용
                <textarea
                  name="inquiryContent"
                  rows={5}
                  defaultValue={editingItem.inquiryContent}
                  required
                />
              </label>
              <div className="modal-footer">
                <button type="button" onClick={() => setEditingItem(null)}>
                  취소
                </button>
                <button type="submit">저장</button>
              </div>
            </form>
          </div>
        )}

        {/* 삭제 확인 모달 */}
        {confirmDeleteId && (
          <div
            className="modal-backdrop"
            onClick={() => setConfirmDeleteId(null)}
          >
            <div className="modal confirm" onClick={(e) => e.stopPropagation()}>
              <h3>삭제 확인</h3>
              <p>정말로 삭제하시겠습니까?</p>
              <div className="modal-footer">
                <button onClick={() => setConfirmDeleteId(null)}>취소</button>
                <button onClick={() => handleDelete(confirmDeleteId)}>
                  삭제
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
}
