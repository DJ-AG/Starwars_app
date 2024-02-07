import { useState, useEffect } from 'react';
import './Landing.css';

//Api call
import { fetchCharacters } from '../../services/swapi';

// Import the components
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
//import Header from '../../components/Header/Header';
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
    setIsLoading(true);
    const loadCharacters = async () => {
      try {
        const data = await fetchCharacters(currentPage);
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

    loadCharacters();
  }, [currentPage]);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="center-container">
      {/* Show loading component when data is fetching */}
      {isLoading && <Loader />}

      {/* Card container for character cards */}
      <div className="card-container">
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
