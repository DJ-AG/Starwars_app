import React, { useState, useEffect } from 'react';
import './Header.css';
import Filter from '../Filters/Filters';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleDown, faCircleUp } from '@fortawesome/free-solid-svg-icons';

interface HeaderProps {
  onSearch: (query: string) => void;
  onFilterChange: (filterType: string, filterValue: string | null) => void;
  selectedFilters: {
    film: string | null;
    species: string | null;
    planet: string | null;
  };
  searchTerm: string; // Ensure this is included
  films: { title: string; id: string }[];
  species: { name: string; id: string }[];
  planets: { name: string; id: string }[];
}

// Define the Header component
const Header: React.FC<HeaderProps> = ({
  onSearch,
  onFilterChange,
  selectedFilters,
  films,
  species,
  planets,
  searchTerm
}) => {
  // State to track header visibility
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const { isAuthenticated, logout } = useAuth();

  // Function to handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  // Function to handle filter change
  const handleFilterChange = (filterType: string, id: string | null) => {
    onFilterChange(filterType, id);
  };

  // Function to toggle header visibility
  const toggleHeaderVisibility = () => {
    setIsHeaderVisible((prev) => !prev);
  };

  // Effect to handle resizing and always show header on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsHeaderVisible(true); // Always show header on mobile
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render the Header component
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
      {/* Render the Filter component */}
      <Filter
        onFilterChange={handleFilterChange}
        selectedFilters={selectedFilters}
        films={films}
        species={species}
        planets={planets}
      />
      {/* Conditionally render the toggle button */}
      {window.innerWidth <= 768 && (
        <button
          className="toggle-header-button"
          onClick={toggleHeaderVisibility}
        >
          {isHeaderVisible ? (
            <FontAwesomeIcon icon={faCircleUp} className="arrow" />
          ) : (
            <FontAwesomeIcon icon={faCircleDown} className="arrow" />
          )}
        </button>
      )}
      {/* Render the logout button if authenticated */}
      {isAuthenticated && (
        <button className="logout-button" onClick={logout}>
          Logout
        </button>
      )}
    </header>
  );
};

// Export the Header component as default
export default Header;
