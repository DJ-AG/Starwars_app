// CharacterModal.tsx
import React, { useState, useEffect } from 'react';
// While testing in jest, the css import statement should be commented out
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
        setImageSrc(imageUrl || 'https://placehold.co/600x400?text=:('); // Set fallback URL here
      } catch (error) {
        setImageSrc('https://placehold.co/600x400?text=:('); // Fallback for any other error
        console.error('Error fetching character image:', error);
      }
    };

    loadImage();
  }, [character.name]);

  const handleImageError = () => {
    setImageSrc('https://placehold.co/600x400?text=:(');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  return (
    <div className="modal-backdrop" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <div className="image-container">
            <img
              src={imageSrc}
              alt={character.name}
              onError={handleImageError}
            />
          </div>
          <div className="character-data">
            <button
              className="close-button"
              onClick={closeModal}
              data-testid="close-button"
            >
              X
            </button>
            <h1>{character.name}</h1>
            {character.homeworldDetails && (
              <>
                <div className="character-info">
                  <h4>Homeworld </h4>
                  <ul>
                    <li>
                      <span>
                        {character.homeworldDetails.name || 'unknown'}
                      </span>
                    </li>
                    <li>
                      <span>
                        Terrain:{' '}
                        {character.homeworldDetails.terrain || 'unknown'}
                      </span>
                    </li>
                    <li>
                      <span>
                        Climate:{' '}
                        {character.homeworldDetails.climate || 'unknown'}
                      </span>
                    </li>
                    <li>
                      <span>
                        Population:{' '}
                        {character.homeworldDetails.population || 'unknown'}
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            <div className="character-info">
              <h4>GENDER</h4>
              <ul>
                <li>
                  <span>{character.gender || 'unknown'}</span>
                </li>
              </ul>
            </div>
            <div className="character-info">
              <h4>Height</h4>
              <ul>
                <li>
                  <span>
                    {character.height ? `${character.height} cm` : 'unknown'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="character-info">
              <h4>Mass</h4>
              <ul>
                <li>
                  <span>
                    {character.mass !== 'unknown'
                      ? `${character.mass} kg`
                      : 'unknown'}
                  </span>
                </li>
              </ul>
            </div>
            <div className="character-info">
              <h4>Birth year</h4>
              <ul>
                <li>
                  <span>{character.birth_year || 'unknown'}</span>
                </li>
              </ul>
            </div>
            {character.speciesDetails && (
              <>
                <div className="character-info">
                  <h4>SPECIES</h4>
                  <ul>
                    <li>
                      <span>
                        Name: {character.speciesDetails.name || 'unknown'}
                      </span>
                    </li>
                    <li>
                      <span>
                        Classification:{' '}
                        {character.speciesDetails.classification || 'unknown'}
                      </span>
                    </li>
                    <li>
                      <span>
                        Language:{' '}
                        {character.speciesDetails.language || 'unknown'}
                      </span>
                    </li>
                  </ul>
                </div>
              </>
            )}
            <div className="character-info-print">
              <p>
                {`${character.name} appear in ${character.films?.length} movies` ||
                  'unknown'}
              </p>
              <p>
                This Data Was Created in{' '}
                {formatDate(character.created) || 'unknown'} <br />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterModal;
