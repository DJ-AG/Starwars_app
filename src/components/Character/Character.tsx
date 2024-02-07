import React from 'react';
import './Character.css';
import { CharacterProps } from '../../types';

const Character: React.FC<CharacterProps> = ({ character, onClick }) => {
  return (
    <div className="CharacterContainer" onClick={() => onClick(character)}>
      <img src="https://placehold.co/400" alt={character.name} />
      <h1>{character.name}</h1>
      <div className="Decal"></div>
    </div>
  );
};

export default Character;
