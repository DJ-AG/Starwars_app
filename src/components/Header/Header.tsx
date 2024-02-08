import React, { useState } from 'react';
import './Header.css';
import Filter from '../Filters/Filters';
import { useAuth } from '../../context/authContext';

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filmId: string | null) => void;
  selectedFilters: {
    film: string | null;
    species: string | null;
    planet: string | null;
  };
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onFilterChange,
  selectedFilters
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { isAuthenticated, logout } = useAuth();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-logo">
          <img
            src="https://download.logo.wine/logo/Star_Wars/Star_Wars-Logo.wine.png"
            alt="Star Wars Logo"
          />
        </div>
        <div className="header-search">
          <input
            type="text"
            placeholder="Search Character"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <img
            src="https://static-mh.content.disney.io/starwars/assets/navigation/icon_search-957a123fdb62.svg"
            alt="Search Icon"
          />
        </div>
      </div>
      <Filter
        onFilterChange={onFilterChange}
        selectedFilters={selectedFilters}
      />
      {isAuthenticated && (
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
