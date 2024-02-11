import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Landing from '../src/pages/Landing/Landing';
import * as swapiService from '../src/services/swapi';
import { AuthProvider } from '../src/context/authContext';

// Define the structure of your mock data
interface Character {
  name: string;
  url: string;
}

interface Film {
  title: string;
  id: string;
}

interface Species {
  name: string;
  id: string;
}

interface Planet {
  name: string;
  id: string;
}

// Correctly type the mocked functions
jest.mock('../src/services/swapi', () => ({
  ...jest.requireActual('../src/services/swapi'),
  fetchCharacters: jest.fn<
    Promise<{ results: Character[]; next: string | null }>,
    [number]
  >(),
  fetchFilms: jest.fn<Promise<Film[]>, []>(),
  fetchSpecies: jest.fn<Promise<Species[]>, []>(),
  fetchPlanets: jest.fn<Promise<Planet[]>, []>()
}));

describe('<Landing />', () => {
  beforeEach(() => {
    (swapiService.fetchCharacters as jest.Mock).mockResolvedValue({
      results: [{ name: 'Luke Skywalker', url: 'http://example.com/luke' }],
      next: null
    });
    (swapiService.fetchFilms as jest.Mock).mockResolvedValue([
      { title: 'A New Hope', id: '1' }
    ]);
    (swapiService.fetchSpecies as jest.Mock).mockResolvedValue([
      { name: 'Human', id: '1' }
    ]);
    (swapiService.fetchPlanets as jest.Mock).mockResolvedValue([
      { name: 'Tatooine', id: '1' }
    ]);
  });

  it('renders and displays initial data', async () => {
    render(
      <AuthProvider>
        <Landing />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    });
  });
});
