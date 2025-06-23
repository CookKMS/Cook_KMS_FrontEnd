import React, { useEffect, useState } from 'react';
import AdminHeader from '../../components/AdminHeader';
import StatCard from './components/StatCard';
import KnowledgeTable from './components/KnowledgeTable';
import InquiryTable from './components/InquiryTable';
import FaqTable from './components/FaqTable';
import '../../styles/Admin/AdminDashboard.css';

// ✅ 관리자용 대시보드
// - 통계 카드 (StatCard)
// - 지식 문서 / 문의 / FAQ 테이블 관리
// - 추후 Flask 백엔드와 연결 예정

export default function AdminDashboard() {
  // ✅ 통계 카드 데이터 상태 (추후 /api/dashboard/stats 등과 연결)
  const [stats, setStats] = useState({
    knowledgeCount: 0,
    knowledgeChange: 0,
    inquiryPending: 0,
    inquiryChange: 0,
    faqCount: 0,
    faqChange: 0,
  });

  // ✅ 초기 통계 데이터 로딩
  useEffect(() => {
    fetchDashboardStats();
  }, []);

  // ✅ 통계 데이터 로딩 함수 (Flask 연동 시 /api/dashboard/stats)
  const fetchDashboardStats = async () => {
    try {
      // const res = await fetch('/api/dashboard/stats');
      // const json = await res.json();
      // setStats(json);

      // 더미 데이터 (개발용)
      setStats({
        knowledgeCount: 124,
        knowledgeChange: 12,
        inquiryPending: 8,
        inquiryChange: -5,
        faqCount: 42,
        faqChange: 3,
      });
    } catch (error) {
      console.error('대시보드 통계 불러오기 실패:', error);
    }
  };

  return (
    <>
      <AdminHeader />

      <main className="admin-dashboard-container">
        {/* ✅ 상단 통계 카드 영역 */}
        <section className="stat-cards-section">
          <StatCard
            title="총 지식 문서"
            value={stats.knowledgeCount}
            change={stats.knowledgeChange}
            trend={stats.knowledgeChange >= 0 ? 'up' : 'down'}
            icon="file-alt"
            color="blue"
          />
          <StatCard
            title="답변 대기 문의"
            value={stats.inquiryPending}
            change={stats.inquiryChange}
            trend={stats.inquiryChange >= 0 ? 'up' : 'down'}
            icon="question-circle"
            color="yellow"
          />
          <StatCard
            title="FAQ 항목"
            value={stats.faqCount}
            change={stats.faqChange}
            trend={stats.faqChange >= 0 ? 'up' : 'down'}
            icon="comments"
            color="green"
          />
        </section>

        {/* ✅ 지식 문서 테이블 */}
        <section className="table-section">
          <KnowledgeTable />
        </section>

        {/* ✅ 문의 관리 테이블 */}
        <section className="table-section">
          <InquiryTable />
        </section>

        {/* ✅ FAQ 관리 테이블 */}
        <section className="table-section">
          <FaqTable />
        </section>
      </main>
    </>
  );
}
