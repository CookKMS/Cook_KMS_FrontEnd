import React, { useState } from 'react';
import '../styles/TabMenu.css';

function TabMenu() {
  const tabs = ['NOTICE', 'FAQ', 'Q&A'];
  const [activeTab, setActiveTab] = useState('FAQ');

  return (
    <div className="tab-menu">
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`tab-item ${activeTab === tab ? 'active' : ''}`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}

export default TabMenu;
