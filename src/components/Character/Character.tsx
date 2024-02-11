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

// Define the Character component
const Character: React.FC<CharacterProps> = React.memo(
  ({ character, onClick }) => {
    // State variables for image source, species name, and color
    const [imageSrc, setImageSrc] = useState<string>(
      'https://placehold.co/400'
    );
    const [speciesName, setSpeciesName] = useState<string>('');
    const [color, setColor] = useState<string>('');

    // Effect to load image and species details
    useEffect(() => {
      const loadImageAndSpecies = async () => {
        try {
          // Fetch character details and set image source
          const charDetails = await fetchCharacterImageByName(character.name);
          if (charDetails) {
            setImageSrc(
              charDetails.image || 'https://placehold.co/600x400?text=:('
            );

            // Determine species name
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

            // Generate or retrieve color for species
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

    // Function to generate random color
    const generateRandomColor = () => {
      return '#' + Math.floor(Math.random() * 16777215).toString(16);
    };

    // Function to handle image loading error
    const handleImageError = () => {
      setImageSrc('https://placehold.co/600x400?text=:(');
    };

    // Style for character container
    const containerStyle = {
      boxShadow: `.5px .5px 3px 3px ${color}`
    };

    // Style for character image
    const imageStyle = {
      borderBottom: `2px solid ${color}`
    };

    // Render the character component
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
