import React, { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import './Landing.css';

// API calls
import {
  fetchCharacters,
  fetchCharacterByName,
  fetchCharacterDetailsByUrl,
  fetchFilmDetails,
  fetchFilms
} from '../../services/swapi';

// Components
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import Header from '../../components/Header/Header';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';

// Types
import { CharacterProps } from '../../types';

// Main component for displaying Star Wars characters
const Landing: React.FC = () => {
  // State management for characters, selected character, modal, pagination, and loading status
  const [characters, setCharacters] = useState<CharacterProps[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [films, setFilms] = useState<{ title: string; id: string }[]>([]);

  // Load characters on page load or page change
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [characterData, filmData] = await Promise.all([
          fetchCharacters(currentPage),
          fetchFilms()
        ]); // Fetch both characters and films concurrently
        setCharacters(characterData.results);
        setFilms(filmData);
        updatePagination(characterData.next, characterData.previous);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [currentPage]);

  // Fetch characters for the current page
  const loadCharacters = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacters(page);
      setCharacters(data.results);
      updatePagination(data.next, data.previous);
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

  // Search characters by name
  const handleSearchByName = debounce(async (query: string) => {
    if (query.length === 0) {
      loadCharacters(1);
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchCharacterByName(query);
      setCharacters(data.results);
      setNextPage(null);
      setPrevPage(null);
    } catch (error) {
      console.error('Failed to search characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Handle character selection for modal display
  const handleCharacterClick = (character: CharacterProps) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  // Close the character detail modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Navigate to a specific page
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Filter characters by film
  const handleFilterChange = async (filmId: string | null) => {
    if (!filmId) {
      setCurrentPage(1); // Reset to the first page if "none" is selected
      loadCharacters(currentPage);
      return;
    }
    setIsLoading(true);
    try {
      const filmDetails = await fetchFilmDetails(filmId);
      const charactersData = await Promise.all(
        filmDetails.characters.map((url: string) =>
          fetchCharacterDetailsByUrl(url)
        )
      );
      setCharacters(charactersData);
      resetPagination();
    } catch (error) {
      console.error('Failed to fetch characters by film:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset pagination
  const resetPagination = () => {
    setNextPage(null);
    setPrevPage(null);
  };

  return (
    <div className="center-container">
      {/* Header with search and filter options */}
      <Header
        onSearch={handleSearchByName}
        onFilterChange={handleFilterChange}
      />

      {/* Loading spinner */}
      {isLoading && <Loader />}

      {/* List of character cards */}
      <div className="card-container">
        {characters.map((character, index) => (
          <Character
            key={index}
            character={character}
            onClick={() => handleCharacterClick(character)}
          />
        ))}
      </div>

      {/* Modal for displaying selected character details */}
      {isModalOpen && selectedCharacter && (
        <CharacterModal character={selectedCharacter} closeModal={closeModal} />
      )}

      {/* Pagination controls */}
      <div className="pagination-container-top">
        <Pagination
          currentPage={currentPage}
          hasNextPage={!!nextPage}
          hasPrevPage={!!prevPage}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default Landing;
