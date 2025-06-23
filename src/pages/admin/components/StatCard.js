import React from 'react';
import '../../../styles/Admin/StatCard.css';

/**
 * ✅ StatCard 컴포넌트
 * - 관리자 대시보드에 보여지는 통계 카드
 * - props:
 *    - title: 항목 이름 (ex. "총 지식 문서")
 *    - value: 수치 값 (ex. 124)
 *    - change: 전월 대비 증감 퍼센트 (ex. +12)
 *    - trend: 'up' 또는 'down' (증감 방향)
 *    - icon: FontAwesome 아이콘명 (ex. 'file-alt')
 *    - color: 카드 색상 ('blue', 'green', 'yellow', etc.)
 */
export default function StatCard({ title, value, change, trend, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>

        {/* ✅ 실시간 값 표시 (예: 백엔드에서 받아온 총 개수) */}
        <span className="stat-card-value">{value}</span>

        {/* ✅ 변화율이 있을 경우: ▲ / ▼ 및 % 출력 */}
        {change !== undefined && (
          <span className={`stat-card-change ${trend}`}>
            {trend === 'up' ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>

      {/* ✅ 아이콘 표시 (FontAwesome 기반) */}
      <div className={`stat-card-icon ${color}`}>
        <i className={`fas fa-${icon}`}></i>
      </div>
    </div>
  );
}
