import React, { useState, useEffect } from 'react';
import './Character.css';
import { UnifiedCharacterType } from '../../types';
import {
  fetchCharacterImageByName,
  fetchSpeciesDetails
} from '../../services/swapi';

interface CharacterProps {
  character: UnifiedCharacterType;
  onClick: (character: UnifiedCharacterType) => void;
}

// Correctly type the speciesColorMap
const speciesColorMap: { [key: string]: string } = {};

const Character: React.FC<CharacterProps> = React.memo(
  ({ character, onClick }) => {
    const [imageSrc, setImageSrc] = useState<string>(
      'https://placehold.co/400'
    );
    const [speciesName, setSpeciesName] = useState<string>('');
    const [color, setColor] = useState<string>('');

    useEffect(() => {
      const loadImageAndSpecies = async () => {
        try {
          const charDetails = await fetchCharacterImageByName(character.name);
          if (charDetails) {
            setImageSrc(
              charDetails.image || 'https://placehold.co/600x400?text=:('
            );

            let species = charDetails.species?.toLowerCase() || 'unknown';
            if (Array.isArray(character.species) && character.species.length) {
              const speciesUrls = character.species;
              const speciesPromises = speciesUrls.map((url) =>
                fetchSpeciesDetails(url.match(/\/species\/(\d+)\/$/)[1])
              );
              const speciesResults = await Promise.all(speciesPromises);
              species =
                speciesResults.map((s) => s.name.toLowerCase()).join(', ') ||
                species;
            }
            setSpeciesName(species);

            if (!speciesColorMap[species]) {
              speciesColorMap[species] = generateRandomColor();
            }
            setColor(speciesColorMap[species]);
          }
        } catch (error) {
          console.error('Error fetching character details:', error);
          setImageSrc('https://placehold.co/600x400?text=:(');
          setSpeciesName('Unknown');
          setColor(speciesColorMap['unknown'] || generateRandomColor());
        }
      };

      loadImageAndSpecies();
    }, [character.name, character.species]);

    const generateRandomColor = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    const handleImageError = () => {
      setImageSrc('https://placehold.co/600x400?text=:(');
    };

    const containerStyle = {
      boxShadow: `.5px .5px 3px 3px ${color}`
    };

    const imageStyle = {
      borderBottom: `2px solid ${color}`
    };

    return (
      <div
        className={`CharacterContainer ${
          speciesName
            ? speciesName.replace(/\s+/g, '').toLowerCase()
            : 'UnknownSpecies'
        }`}
        onClick={() => onClick(character)}
        style={containerStyle}
      >
        <img
          src={imageSrc}
          alt={character.name}
          onError={handleImageError}
          style={imageStyle}
        />
        <h1>{character.name}</h1>
      </div>
    );
  }
);

export default Character;
