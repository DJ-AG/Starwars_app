import React, { useState } from 'react';
import './Header.css';
import Filter from '../Filters/Filters';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCircleDown,
  faCircleArrowUp
} from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, id: string | null) => void;
  selectedFilters: {
    film: string | null;
    species: string | null;
    planet: string | null;
  };
  films: { title: string; id: string }[];
  species: { name: string; id: string }[];
  planets: { name: string; id: string }[];
}

const Header: React.FC<HeaderProps> = ({
  onSearch,
  onFilterChange,
  selectedFilters,
  films,
  species,
  planets
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeaderVisible, setIsHeaderVisible] = useState(true); // Track header visibility
  const { isAuthenticated, logout } = useAuth();

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    onSearch(event.target.value);
  };

  const handleFilterChange = (filterType: string, id: string | null) => {
    onFilterChange(filterType, id);
  };

  const toggleHeaderVisibility = () => {
    setIsHeaderVisible((prev) => !prev);
  };

  return (
    <header className={`header ${isHeaderVisible ? 'visible' : 'hidden'}`}>
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
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        films={films}
        species={species}
        planets={planets}
      />
      <button className="toggle-header-button" onClick={toggleHeaderVisibility}>
        {isHeaderVisible ? (
          <FontAwesomeIcon icon={faCircleArrowUp} className="arrow" />
        ) : (
          <FontAwesomeIcon icon={faCircleDown} className="arrow" />
        )}
      </button>
      {isAuthenticated && (
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      )}
    </header>
  );
};

export default Header;
