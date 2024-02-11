import React from 'react';
import './Filters.css';

interface FilterProps {
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

// Define the Filters component
const Filters: React.FC<FilterProps> = ({
  onFilterChange,
  selectedFilters,
  films,
  species,
  planets
}) => {
  // Function to handle filter change
  const handleFilterChange =
    (filterType: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      onFilterChange(filterType, value !== '' ? value : null);
    };

  // Render the Filters component
  return (
    <div className="filter-container">
      {/* Film Filter */}
      <div className="filter-wrapper">
        <select
          value={selectedFilters.film || ''}
          onChange={handleFilterChange('film')}
          className="filter-select"
        >
          <option value="">Filter by Film</option>
          {films.map((film) => (
            <option key={film.id} value={film.id}>
              {film.title}
            </option>
          ))}
        </select>
      </div>
      {/* Species Filter */}
      <div className="filter-wrapper">
        <select
          value={selectedFilters.species || ''}
          onChange={handleFilterChange('species')}
          className="filter-select"
        >
          <option value="">Filter by Species</option>
          {species.map((specie) => (
            <option key={specie.id} value={specie.id}>
              {specie.name}
            </option>
          ))}
        </select>
      </div>
      {/* Homeworld Filter */}
      <div className="filter-wrapper">
        <select
          value={selectedFilters.planet || ''}
          onChange={handleFilterChange('planet')}
          className="filter-select"
        >
          <option value="">Filter by Homeworld</option>
          {planets.map((planet) => (
            <option key={planet.id} value={planet.id}>
              {planet.name}
            </option>
          ))}
        </select>
      </div>
      {/* Reset Button */}
      <button
        className="filter-reset-button"
        onClick={() => onFilterChange('reset', null)}
      >
        Reset Filters
      </button>
    </div>
  );
};

// Export the Filters component as default
export default Filters;
