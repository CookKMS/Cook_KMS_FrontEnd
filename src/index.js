import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import FAQPage from './pages/FAQPage'; // ✅ 수정 완료

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <FAQPage />  {/* ✅ 컴포넌트도 같이 수정 */}
  </React.StrictMode>
);
