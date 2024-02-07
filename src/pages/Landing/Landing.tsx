import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import './Landing.css';
import {
  fetchCharacters,
  fetchCharacterByName,
  fetchCharacterDetailsByUrl,
  fetchFilmDetails,
  fetchSpeciesDetails,
  fetchPlanetDetails
} from '../../services/swapi';
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import Header from '../../components/Header/Header';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';
import { CharacterProps } from '../../types';

const Landing: React.FC = () => {
  // State management
  const [characters, setCharacters] = useState<CharacterProps[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    film: null,
    species: null,
    planet: null
  });
  const [totalPages, setTotalPages] = useState(0);

  // Load characters when page first renders or currentPage changes
  useEffect(() => {
    loadCharacters(currentPage);
  }, [currentPage]);

  // Function to load characters from API
  const loadCharacters = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacters(page);
      setCharacters(data.results);
      updatePagination(data.next, data.previous);
      const pages = Math.ceil(data.count / 10);
      setTotalPages(pages);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Update pagination state
  const updatePagination = (next: string | null, previous: string | null) => {
    setNextPage(next ? new URL(next).searchParams.get('page') : null);
    setPrevPage(previous ? new URL(previous).searchParams.get('page') : null);
  };

  // Debounced function to handle character search by name
  const handleSearchByName = debounce(async (query: string) => {
    setIsLoading(true);
    if (query.length === 0) {
      loadCharacters(); // Load all characters if search query is empty
    } else {
      try {
        const data = await fetchCharacterByName(query);
        setCharacters(data.results);
        resetPagination();
      } catch (error) {
        console.error('Failed to search characters:', error);
      }
    }
    setIsLoading(false);
  }, 300);

  // Open character modal on click
  const handleCharacterClick = (character: CharacterProps) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  // Close character modal
  const closeModal = () => setIsModalOpen(false);

  // Function to navigate to a specific page
  const goToPage = (page: number) => setCurrentPage(page);

  // Handle filter change
  const handleFilterChange = async (
    filterType: string,
    filterValue: string | null
  ) => {
    const updatedFilters = { ...selectedFilters, [filterType]: filterValue };
    setSelectedFilters(updatedFilters);
    applyFilters(updatedFilters);
  };

  // Apply filters and fetch filtered characters
  const applyFilters = async (filters: any) => {
    setIsLoading(true);
    setCharacters([]); // Clear characters before applying new filters

    try {
      let characterUrls = new Set();

      // Fetch characters based on film filter if set
      if (filters.film) {
        const filmDetails = await fetchFilmDetails(filters.film);
        filmDetails.characters.forEach((url) => characterUrls.add(url));
      }

      // Fetch characters based on species filter if set
      if (filters.species) {
        const speciesDetails = await fetchSpeciesDetails(filters.species);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              speciesDetails.people.includes(url)
            )
          );
        } else {
          speciesDetails.people.forEach((url) => characterUrls.add(url));
        }
      }

      // Fetch characters based on planet filter if set
      if (filters.planet) {
        const planetDetails = await fetchPlanetDetails(filters.planet);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              planetDetails.residents.includes(url)
            )
          );
        } else {
          planetDetails.residents.forEach((url) => characterUrls.add(url));
        }
      }

      // If no filter is set, load characters normally without pagination
      if (!filters.film && !filters.species && !filters.planet) {
        loadCharacters();
        return;
      }

      // Fetch detailed character information for the filtered URLs
      const charactersData =
        characterUrls.size > 0
          ? await Promise.all(
              [...characterUrls].map(fetchCharacterDetailsByUrl)
            )
          : [];

      setCharacters(charactersData);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset pagination state
  const resetPagination = () => {
    setNextPage(null);
    setPrevPage(null);
  };

  return (
    <div className="center-container">
      {/* Header component for search and filters */}
      <Header
        onSearch={handleSearchByName}
        onFilterChange={handleFilterChange}
      />
      {/* Loader component to indicate loading state */}
      {isLoading && <Loader />}
      {/* Container to display character cards */}
      <div className="card-container">
        {characters.map((character, index) => (
          <Character
            key={index}
            character={character}
            onClick={() => handleCharacterClick(character)}
          />
        ))}
      </div>
      {/* Character modal component */}
      {isModalOpen && selectedCharacter && (
        <CharacterModal character={selectedCharacter} closeModal={closeModal} />
      )}
      {/* Pagination component */}
      <Pagination
        currentPage={currentPage}
        hasNextPage={!!nextPage}
        hasPrevPage={!!prevPage}
        totalPage={totalPages}
        goToPage={goToPage}
      />
    </div>
  );
};

export default Landing;
