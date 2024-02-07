import React, { useState, useEffect } from 'react';
import { fetchFilms, fetchSpecies, fetchPlanets } from '../../services/swapi';

interface FilterProps {
  onFilterChange: (filterType: string, id: string | null) => void;
}

const Filter: React.FC<FilterProps> = ({ onFilterChange }) => {
  const [films, setFilms] = useState<{ title: string; id: string }[]>([]);
  const [species, setSpecies] = useState<{ name: string; id: string }[]>([]);
  const [planets, setPlanets] = useState<{ name: string; id: string }[]>([]);

  // Fetch films, species, and planets data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const filmsData = await fetchFilms();
      const speciesData = await fetchSpecies();
      const planetsData = await fetchPlanets();
      setFilms(filmsData);
      setSpecies(speciesData);
      setPlanets(planetsData);
    };
    fetchData();
  }, []);

  const handleFilterChange =
    (filterType: string) => (event: React.ChangeEvent<HTMLSelectElement>) => {
      const value = event.target.value;
      onFilterChange(filterType, value !== '' ? value : null);
    };

  return (
    <div className="filter-container">
      <div className="filter-header">Filter by:</div>
      {/* Film Filter */}
      <select onChange={handleFilterChange('film')} className="filter-select">
        <option value="">Film</option>
        {films.map((film) => (
          <option key={film.id} value={film.id}>
            {film.title}
          </option>
        ))}
      </select>
      {/* Species Filter */}
      <select
        onChange={handleFilterChange('species')}
        className="filter-select"
      >
        <option value="">Species</option>
        {species.map((specie) => (
          <option key={specie.id} value={specie.id}>
            {specie.name}
          </option>
        ))}
      </select>
      {/* Homeworld Filter */}
      <select onChange={handleFilterChange('planet')} className="filter-select">
        <option value="">Homeworld</option>
        {planets.map((planet) => (
          <option key={planet.id} value={planet.id}>
            {planet.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;
