import React, { useState, useEffect } from 'react';
import './Character.css';
import { UnifiedCharacterType } from '../../types';
import { fetchCharacterImageByName } from '../../services/swapi';

interface CharacterProps {
  character: UnifiedCharacterType;
  onClick: (character: UnifiedCharacterType) => void;
}

const Character: React.FC<CharacterProps> = React.memo(
  ({ character, onClick }) => {
    const [imageSrc, setImageSrc] = useState<string>(
      'https://placehold.co/400'
    );

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

    return (
      <div className="CharacterContainer" onClick={() => onClick(character)}>
        <img src={imageSrc} alt={character.name} onError={handleImageError} />
        <h1>{character.name}</h1>
        <div className="Decal"></div>
      </div>
    );
  }
);

export default Character;
