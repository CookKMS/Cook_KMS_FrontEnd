import React from 'react';
import '../../../styles/Admin/StatCard.css';

export default function StatCard({ title, value, change, trend, icon, color }) {
  return (
    <div className={`stat-card ${color}`}>
      <div className="stat-card-info">
        <span className="stat-card-title">{title}</span>
        
        {/* TODO: 백엔드에서 받아온 실제 데이터를 여기에 연결하세요. */}
        <span className="stat-card-value">{value}</span>
        
        {change !== undefined && (
          <span className={`stat-card-change ${trend}`}>
            {trend === 'up' ? '▲' : '▼'} {Math.abs(change)}%
          </span>
        )}
      </div>
      <div className={`stat-card-icon ${color}`}>
        <i className={`fas fa-${icon}`}></i>
      </div>
    </div>
  );
}
