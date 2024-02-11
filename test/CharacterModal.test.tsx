import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CharacterModal from '../src/components/CharacterModal/CharacterModal';
import { UnifiedCharacterType } from '../src/types';
import * as swapiService from '../src/services/swapi';

// Mock the fetchCharacterImageByName function
jest.mock('../src/services/swapi', () => ({
  fetchCharacterImageByName: jest.fn()
}));

describe('<CharacterModal />', () => {
  // Define a sample character to use in tests
  const sampleCharacter: UnifiedCharacterType = {
    id: '1',
    name: 'Luke Skywalker',
    gender: 'male',
    height: 172,
    mass: '77',
    birth_year: '19BBY',
    speciesDetails: {
      name: 'Human',
      classification: 'mammal',
      language: 'Galactic Basic',
      designation: 'man'
    },
    homeworldDetails: {
      name: 'Tatooine',
      terrain: 'desert',
      climate: 'arid',
      population: '200000'
    },
    films: ['A New Hope', 'The Empire Strikes Back'],
    created: '1977-05-25',
    url: 'http://example.com/luke'
  };

  beforeEach(() => {
    // Reset mocks before each test
    (swapiService.fetchCharacterImageByName as jest.Mock).mockReset();
  });

  it('renders character details and fetches character image', async () => {
    // Mock the fetchCharacterImageByName to resolve with an image URL
    (swapiService.fetchCharacterImageByName as jest.Mock).mockResolvedValue({
      image: 'http://example.com/luke-image.jpg'
    });

    render(
      <CharacterModal character={sampleCharacter} closeModal={() => {}} />
    );

    // Verify that the character name is rendered
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();

    // Wait for the image to be loaded and check if it's displayed
    await waitFor(() => {
      const image = screen.getByAltText('Luke Skywalker') as HTMLImageElement;
      expect(image.src).toContain('luke-image.jpg');
    });
  });

  it('closes the modal on backdrop click', () => {
    const closeModalMock = jest.fn();
    render(
      <CharacterModal character={sampleCharacter} closeModal={closeModalMock} />
    );

    // Simulate a click on the modal backdrop
    const backdrop = screen.getByTestId('modal-backdrop');
    fireEvent.click(backdrop);

    // Expect the closeModal function to have been called
    expect(closeModalMock).toHaveBeenCalled();
  });

  // Add more tests here for other interactions and scenarios
});
