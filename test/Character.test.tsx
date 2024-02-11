import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Character from '../src/components/Character/Character';
import * as swapiService from '../src/services/swapi';
import { UnifiedCharacterType } from '../src/types';

jest.mock('../src/services/swapi', () => ({
  fetchCharacterImageByName: jest.fn(),
  fetchSpeciesDetails: jest.fn()
}));

describe('<Character />', () => {
  const sampleCharacter: UnifiedCharacterType = {
    id: '1',
    name: 'Luke Skywalker',
    species: 'http://example.com/species/1',
    films: [],
    gender: 'male',
    birth_year: '19BBY',
    height: 172,
    mass: '77',
    url: 'http://example.com/planets/1'
    // Add other fields as necessary
  };

  beforeEach(() => {
    (swapiService.fetchCharacterImageByName as jest.Mock).mockResolvedValue({
      image: 'http://example.com/luke-image.jpg',
      species: 'Human'
    });
    (swapiService.fetchSpeciesDetails as jest.Mock).mockResolvedValue({
      name: 'Human'
    });
  });

  it('renders character details and fetches image', async () => {
    render(<Character character={sampleCharacter} onClick={jest.fn()} />);

    // Use waitFor for asynchronous updates
    await waitFor(() => {
      const image = screen.getByAltText('Luke Skywalker') as HTMLImageElement;
      expect(image.src).toContain('luke-image.jpg');
    });

    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
  });

  it('handles image error by setting a placeholder image', async () => {
    (swapiService.fetchCharacterImageByName as jest.Mock).mockResolvedValueOnce(
      {
        image: null // Simulate failure to fetch image
      }
    );

    render(<Character character={sampleCharacter} onClick={jest.fn()} />);

    // Use waitFor for asynchronous updates
    await waitFor(() => {
      const image = screen.getByAltText('Luke Skywalker') as HTMLImageElement;
      expect(image.src).toContain('placehold.co/600x400?text=:(');
    });
  });

  it('calls onClick prop when character container is clicked', () => {
    const handleClick = jest.fn();
    render(<Character character={sampleCharacter} onClick={handleClick} />);

    fireEvent.click(screen.getByText('Luke Skywalker'));
    expect(handleClick).toHaveBeenCalledWith(sampleCharacter);
  });
});
