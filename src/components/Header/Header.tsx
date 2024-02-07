import React, { useState } from 'react';
import './Header.css';
import Filter from '../Filters/Filters';

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filmId: string | null) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <div className="header">
      <Filter onFilterChange={onFilterChange} />
      <div className="header-left"></div>
      <div className="header-logo">
        <img
          src="https://download.logo.wine/logo/Star_Wars/Star_Wars-Logo.wine.png"
          alt="Star Wars Logo"
        />
      </div>

      <div className="header-right">
        <div className="header-search">
          <input
            type="text"
            placeholder="Search Star Wars Character"
            onChange={handleSearchChange}
          />
          <img
            src="https://static-mh.content.disney.io/starwars/assets/navigation/icon_search-957a123fdb62.svg"
            alt="Search Icon"
          />
        </div>
        <div className="header-actions">
          <button>SIGN OUT</button>
        </div>
      </div>
    </div>
  );
};

export default Header;
