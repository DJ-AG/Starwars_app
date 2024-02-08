// CharacterModal.tsx
import React, { useState, useEffect } from 'react';
import './CharacterModal.css';
import { UnifiedCharacterType } from '../../types';
import { fetchCharacterImageByName } from '../../services/swapi'; // Make sure the path is correct

interface CharacterModalProps {
  character: UnifiedCharacterType;
  closeModal: () => void;
}

const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  closeModal
}) => {
  const [imageSrc, setImageSrc] = useState<string>('https://placehold.co/400');

  useEffect(() => {
    const loadImage = async () => {
      try {
        const imageUrl = await fetchCharacterImageByName(character.name);
        if (imageUrl) {
          setImageSrc(imageUrl);
        }
      } catch (error) {
        // Handle any errors here, possibly set a default image if the API call fails
        console.error(error);
      }
    };

    loadImage();
  }, [character.name]);
  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <img
            className="character-image"
            src={imageSrc || 'https://placehold.co/400'}
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
            <ul>
              <li>
                <span>{character.gender}</span>
              </li>
            </ul>
            <h4>DIMENSIONS</h4>
            <ul>
              <li>
                <span>Height: {character.height}m</span>
              </li>
            </ul>
            {character.speciesDetails && (
              <>
                <h4>SPECIES</h4>
                <ul>
                  <li>
                    <span>Name: {character.speciesDetails.name}</span>
                  </li>
                  <li>
                    <span>
                      Classification: {character.speciesDetails.classification}
                    </span>
                  </li>
                  <li>
                    <span>Language: {character.speciesDetails.language}</span>
                  </li>
                </ul>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
