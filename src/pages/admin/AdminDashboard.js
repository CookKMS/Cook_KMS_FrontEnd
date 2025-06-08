import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import StatCard from './components/StatCard';
import KnowledgeTable from './components/KnowledgeTable';
import InquiryTable from './components/InquiryTable';
import FaqTable from './components/FaqTable';
import '../../styles/Admin/AdminDashboard.css';

export default function AdminDashboard() {
  return (
    <>
      <AdminHeader />

      <main className="admin-dashboard-container">
        <section className="stat-cards-section">
          <StatCard
            title="총 지식 문서"
            value={124}
            change={12}
            trend="up"
            icon="file-alt"
            color="blue"
          />
          <StatCard
            title="답변 대기 문의"
            value={8}
            change={-5}
            trend="down"
            icon="question-circle"
            color="yellow"
          />
          <StatCard
            title="FAQ 항목"
            value={42}
            change={3}
            trend="up"
            icon="comments"
            color="green"
          />
        </section>

        <section className="table-section">
          <KnowledgeTable />
        </section>

        <section className="table-section">
          <InquiryTable />
        </section>

        <section className="table-section">
          <FaqTable />
        </section>
      </main>
    </>
  );
}
