// Character.tsx
import React from 'react';
import './Character.css';
import { UnifiedCharacterType } from '../../types';

interface CharacterProps {
  character: UnifiedCharacterType;
  onClick: (character: UnifiedCharacterType) => void;
}

const Character: React.FC<CharacterProps> = ({ character, onClick }) => {
  return (
    <div className="CharacterContainer" onClick={() => onClick(character)}>
      <img src={'https://placehold.co/400'} alt={character.name} />
      <h1>{character.name}</h1>
      <div className="Decal"></div>
    </div>
  );
};

export default Character;
