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
          if (imageUrl) {
            setImageSrc(imageUrl);
          }
        } catch (error) {
          console.error('Error fetching character image:', error);
        }
      };

      loadImage();
    }, [character.name]);

    return (
      <div className="CharacterContainer" onClick={() => onClick(character)}>
        <img src={imageSrc} alt={character.name} />
        <h1>{character.name}</h1>
        <div className="Decal"></div>
      </div>
    );
  }
);

export default Character;
