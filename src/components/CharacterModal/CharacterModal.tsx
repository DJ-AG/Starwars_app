import React from 'react';
import './CharacterModal.css';
import { CharacterType } from '../../types';

interface CharacterModalProps {
  character: CharacterType;
  closeModal: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  closeModal
}) => {
  const locations = [
    character.bornLocation,
    character.diedLocation,
    character.homeworld
  ].filter((value, index, self) => value && self.indexOf(value) === index);

  return (
    <div className="ModalBackdrop" onClick={closeModal}>
      <div className="ModalContent" onClick={(e) => e.stopPropagation()}>
        <div className="ModalContainer">
          <img src="https://placehold.co/400" alt={character.name} />
          <div className="CharacterInfo">
            <button className="CloseButton" onClick={closeModal}>
              X
            </button>
            <h1>{character.name}</h1>
            {character.affiliations && character.affiliations.length > 0 && (
              <>
                <h4>AFFILIATIONS</h4>
                {character.affiliations.map((affiliation, index) => (
                  <p key={index}>{affiliation}</p>
                ))}
              </>
            )}
            {character.apprentices && character.apprentices.length > 0 && (
              <>
                <h4>APPRENTICES</h4>
                {character.apprentices.map((apprentice, index) => (
                  <p key={index}>{apprentice}</p>
                ))}
              </>
            )}
            {locations.length > 0 && (
              <>
                <h4>LOCATIONS</h4>
                {locations.map((location, index) => (
                  <p key={index}>{location}</p>
                ))}
              </>
            )}
            <h4>GENDER</h4>
            <span>{character.gender}</span>
            <h4>DIMENSIONS</h4>
            <span>Height: {character.height}m</span>
            <h4>SPECIES</h4>
            <span>{character.species}</span>
            <h4>WIKI</h4>
            <a href={character.wiki} target="_blank" rel="noreferrer">
              Read more about {character.name}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
