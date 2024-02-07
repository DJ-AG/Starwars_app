import { useState } from 'react';
import './Landing.css';

// Import the components
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
//import Header from '../../components/Header/Header';

// Import the mock data
import { characters } from '../../MockData/MockData';

const Landing = () => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCharacterClick = (character) => {
    setSelectedCharacter(character);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="card_container">
        {characters.map((character) => (
          <Character
            key={character.id}
            character={character}
            onClick={handleCharacterClick}
          />
        ))}
        {isModalOpen && selectedCharacter && (
          <CharacterModal
            character={selectedCharacter}
            closeModal={closeModal}
          />
        )}
      </div>
    </div>
  );
};

export default Landing;
