import React, { useState } from 'react';
import '../styles/SearchBar.css';

function SearchBar() {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    if (keyword.trim()) {
      console.log('🔍 검색어:', keyword);
      // TODO: 백엔드 검색 API 연동 예정
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button onClick={handleSearch}>
        🔍
      </button>
    </div>
  );
}

export default SearchBar;
