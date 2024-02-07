import React from 'react';
import './Header.css';

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Call the onSearch prop with the current value of the input field
    onSearch(event.target.value);
  };

  return (
    <div className="header">
      <input
        type="text"
        placeholder="Search for characters"
        onChange={handleSearchChange}
      />
    </div>
  );
};

export default Header;
