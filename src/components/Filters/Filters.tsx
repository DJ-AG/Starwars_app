import React, { useState, useEffect } from 'react';
import { fetchFilms } from '../../services/swapi'; // Adjust the import path as necessary

interface FilmFilterProps {
  onFilterChange: (filmId: string | null) => void; // Adjusted the type to accept null
}

const Filter: React.FC<FilmFilterProps> = ({ onFilterChange }) => {
  const [films, setFilms] = useState<{ title: string; id: string }[]>([]);

  useEffect(() => {
    const initFilms = async () => {
      const fetchedFilms = await fetchFilms();
      setFilms(fetchedFilms);
    };

    initFilms();
  }, []);

  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    onFilterChange(value !== '' ? value : null); // Pass null for the "none" option
  };

  return (
    <select defaultValue="" onChange={handleFilterChange}>
      <option value="">None</option>{' '}
      {/* This option allows users to reset the filter */}
      {films.map((film) => (
        <option key={film.id} value={film.id}>
          {film.title}
        </option>
      ))}
    </select>
  );
};

export default Filter;
