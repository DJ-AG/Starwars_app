// make sure to go to CharacterModal.tsx and comment out the css import statement before running the test

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterModal from '../src/components/CharacterModal/CharacterModal';
import { UnifiedCharacterType } from '../src/types';

describe('CharacterModal', () => {
  it('displays character details correctly', () => {
    const character: UnifiedCharacterType = {
      id: '1',
      name: 'Luke Skywalker',
      image: 'luke-skywalker.jpg',
      url: 'https://example.com/characters/1',
      mass: '77'
    };

    render(<CharacterModal character={character} closeModal={() => {}} />);

    // Check if character name is displayed
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();

    // Check if affiliations are displayed
    expect(screen.getByText('Rebel Alliance')).toBeInTheDocument();
    expect(screen.getByText('Jedi Order')).toBeInTheDocument();
  });

  it('closes the modal when close button is clicked', () => {
    // Mock close modal function
    const closeModalMock = jest.fn();

    const character = {
      id: '1',
      name: 'Luke Skywalker',
      image: 'luke-skywalker.jpg',
      url: 'https://example.com/characters/1',
      affiliations: ['Rebel Alliance', 'Jedi Order']
    };

    render(
      <CharacterModal character={character} closeModal={closeModalMock} />
    );

    // Click on the close button
    fireEvent.click(screen.getByTestId('close-button'));

    // Check if the close modal function was called
    expect(closeModalMock).toHaveBeenCalled();
  });
});
