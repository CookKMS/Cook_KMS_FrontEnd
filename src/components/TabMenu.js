import React, { useState } from 'react';
import '../styles/TabMenu.css';

function TabMenu() {
  const [activeTab, setActiveTab] = useState('FAQ');

  const tabs = ['NOTICE', 'FAQ', 'Q&A',];

  return (
    <div className="tab-menu">
      {tabs.map(tab => (
        <div
          key={tab}
          className={`tab-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </div>
      ))}
    </div>
  );
}

export default TabMenu;
