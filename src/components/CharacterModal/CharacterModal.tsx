import React, { useState, useEffect } from 'react';
import './CharacterModal.css';
import { UnifiedCharacterType } from '../../types';
import { fetchCharacterImageByName } from '../../services/swapi';

interface CharacterModalProps {
  character: UnifiedCharacterType;
  closeModal: () => void;
}

// Define the CharacterModal component
const CharacterModal: React.FC<CharacterModalProps> = ({
  character,
  closeModal
}) => {
  // State variables for image source and visibility of homeworld details
  const [imageSrc, setImageSrc] = useState<string>('https://placehold.co/400');
  const [showHomeworldDetails, setShowHomeworldDetails] =
    useState<boolean>(false);

  // Effect to load character image
  useEffect(() => {
    const loadImage = async () => {
      try {
        // Fetch character image details and set image source
        const characterDetails = await fetchCharacterImageByName(
          character.name
        );
        if (characterDetails && characterDetails.image) {
          setImageSrc(characterDetails.image);
        } else {
          setImageSrc('https://placehold.co/600x400?text=:(');
        }
      } catch (error) {
        // Handle error by setting placeholder image source
        setImageSrc('https://placehold.co/600x400?text=:(');
        console.error('Error fetching character image:', error);
      }
    };

    loadImage();
  }, [character.name]);

  // Function to handle image loading error
  const handleImageError = () => {
    setImageSrc('https://placehold.co/600x400?text=:(');
  };

  // Function to toggle visibility of homeworld details
  const toggleHomeworldDetails = () => {
    setShowHomeworldDetails(!showHomeworldDetails);
  };

  // Function to format date string
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const day = ('0' + date.getDate()).slice(-2);
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  // Render the CharacterModal component
  return (
    <div
      className="modal-backdrop"
      onClick={closeModal}
      data-testid="modal-backdrop"
    >
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-container">
          <div className="image-container">
            <img
              className="character-image"
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
            {/* Homeworld details */}
            <div className="character-info">
              <div className="homeworld-info">
                <h4>Homeworld</h4>
                <button
                  onClick={toggleHomeworldDetails}
                  className="homeworld-button"
                >
                  {showHomeworldDetails ? 'Hide Details' : 'Show Details'}
                </button>
              </div>
            </div>
            {/* Display homeworld details if visible */}
            {showHomeworldDetails && character.homeworldDetails && (
              <div className="character-info">
                <ul>
                  <li>
                    <span>
                      Name: {character.homeworldDetails.name || 'unknown'}
                    </span>
                  </li>
                  <li>
                    <span>
                      Terrain: {character.homeworldDetails.terrain || 'unknown'}
                    </span>
                  </li>
                  <li>
                    <span>
                      Climate: {character.homeworldDetails.climate || 'unknown'}
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
            )}
            {/* Other character details */}
            <div className="character-info">
              <h4>GENDER</h4>
              <ul>
                <li>
                  <span>{character.gender || 'unknown'}</span>
                </li>
              </ul>
            </div>
            {/* Render height, mass, birth year, and species details */}
            {/* Some parts are optional and might be unknown */}
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
            {/* Render species details if available */}
            {character.speciesDetails && (
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
                      Language: {character.speciesDetails.language || 'unknown'}
                    </span>
                  </li>
                </ul>
              </div>
            )}
            {/* Additional character information */}
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

// Export the CharacterModal component as default
export default CharacterModal;
