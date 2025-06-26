import React, { useEffect, useState } from 'react';
import axios from '../../utils/axiosInstance';
import AdminHeader from '../../components/AdminHeader';
import StatCard from './components/StatCard';
import KnowledgeTable from './components/KnowledgeTable';
import InquiryTable from './components/InquiryTable';
import FaqTable from './components/FaqTable';
import '../../styles/Admin/AdminDashboard.css';

export default function AdminDashboard() {
  // ✅ 실시간 통계 데이터 상태
  const [stats, setStats] = useState({
    knowledgeCount: 0,
    knowledgeChange: 0,
    inquiryPending: 0,
    inquiryChange: 0,
    faqCount: 0,
    faqChange: 0,
  });

  // ✅ 백엔드에서 통계 정보 불러오기
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('/admin/dashboard');
        const data = res.data;
        setStats({
          knowledgeCount: data.knowledge_total,
          knowledgeChange: 12, // 예시 변화율
          inquiryPending: data.inquiry_unanswered,
          inquiryChange: -5,   // 예시 변화율
          faqCount: data.faq_total,
          faqChange: 3,        // 예시 변화율
        });
      } catch (error) {
        console.error('대시보드 통계 불러오기 실패:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <AdminHeader />

      <main className="admin-dashboard-container">
        {/* ✅ 통계 카드 섹션 */}
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
