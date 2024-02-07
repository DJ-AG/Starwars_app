import { useState, useEffect } from 'react';
import { debounce } from 'lodash';
import './Landing.css';

//Api call
import { fetchCharacters, fetchCharacterByName } from '../../services/swapi';

// Import the components
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import Header from '../../components/Header/Header';
import Pagination from '../../components/Pagination/Pagination';
import Loader from '../../components/Loader/Loader';

// import the types
import { CharacterProps } from '../../types';

const Landing = () => {
  const [characters, setCharacters] = useState<CharacterProps[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterProps | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [prevPage, setPrevPage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      loadCharacters(currentPage);
    }
  }, [currentPage]);

  // Function to load characters
  const loadCharacters = async (page: number) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacters(page);
      setCharacters(data.results);
      setNextPage(
        data.next ? new URL(data.next).searchParams.get('page') : null
      );
      setPrevPage(
        data.previous ? new URL(data.previous).searchParams.get('page') : null
      );
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    }
    setIsLoading(false);
  };

  // Debounced search function
  const debouncedSearch = debounce(async (query: string) => {
    if (query.length === 0) {
      loadCharacters(1); // Load the first page of characters if search is cleared
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchCharacterByName(query);
      setCharacters(data.results);
      setNextPage(null); // Reset pagination after search
      setPrevPage(null);
    } catch (error) {
      console.error('Failed to search characters:', error);
    }
    setIsLoading(false);
  }, 300);

  // Handler for character selection
  const handleCharacterClick = (character: CharacterProps) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  // Handler for closing the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handler for page change
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  // Handler for search input change
  const handleSearchChange = (query: string) => {
    debouncedSearch(query);
  };

  return (
    <div className="center-container">
      {/* Header component with search input */}
      <Header onSearch={handleSearchChange} />

      {/* Card container for character cards */}
      <div className="card-container">
        {/* Show loading component when data is fetching */}
        {isLoading && <Loader />}

        {characters.map((character, index) => (
          <Character
            key={index} // Ideally, use a unique identifier here
            character={character}
            onClick={() => handleCharacterClick(character)}
          />
        ))}
      </div>

      {/* Character Modal */}
      {isModalOpen && selectedCharacter && (
        <CharacterModal character={selectedCharacter} closeModal={closeModal} />
      )}

      {/* Pagination at bottom */}
      <div className="pagination-container-top">
        <Pagination
          currentPage={currentPage}
          hasNextPage={nextPage !== null}
          hasPrevPage={prevPage !== null}
          goToPage={goToPage}
        />
      </div>
    </div>
  );
};

export default Landing;
