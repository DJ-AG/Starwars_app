// CharacterModal.tsx
import React from 'react';
import './CharacterModal.css';
import { UnifiedCharacterType } from '../../types';

interface CharacterModalProps {
  character: UnifiedCharacterType;
  closeModal: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  closeModal
}) => {
  console.log(character);
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <img
            src={character.image || 'https://placehold.co/400'}
            alt={character.name}
          />
          <div className="character-info">
            <button className="close-button" onClick={closeModal}>
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
            {character.homeworldDetails && (
              <>
                <h4>Homeworld</h4>
                <ul>
                  <li>
                    <span>Name: {character.homeworldDetails.name}</span>
                  </li>
                  <li>
                    <span>Terrain: {character.homeworldDetails.terrain}</span>
                  </li>
                  <li>
                    <span>Climate: {character.homeworldDetails.climate}</span>
                  </li>
                  <li>
                    <span>
                      Population: {character.homeworldDetails.population}
                    </span>
                  </li>
                </ul>
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
