// Import necessary dependencies and styles
import React, { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import './Landing.css';
import {
  fetchCharacters,
  fetchCharacterByName,
  fetchCharacterDetailsByUrl,
  fetchFilmDetails,
  fetchSpeciesDetails,
  fetchPlanetDetails,
  fetchFilms,
  fetchSpecies,
  fetchPlanets
} from '../../services/swapi'; // Assuming these import paths are correct
import Character from '../../components/Character/Character';
import CharacterModal from '../../components/CharacterModal/CharacterModal';
import Header from '../../components/Header/Header';
import Loader from '../../components/Loader/Loader';
import { UnifiedCharacterType } from '../../types'; // Assuming this import path is correct
import SkeletonCard from '../../components/Loader/SkeletonCard';

// Define the Landing component
const Landing: React.FC = () => {
  // Define state variables using hooks
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [characters, setCharacters] = useState<UnifiedCharacterType[]>([]);
  const [selectedCharacter, setSelectedCharacter] =
    useState<UnifiedCharacterType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFilters, setSelectedFilters] = useState({
    film: null,
    species: null,
    planet: null
  });
  const [nextPage, setNextPage] = useState<string | null>(null);
  const [films, setFilms] = useState<{ title: string; id: string }[]>([]);
  const [species, setSpecies] = useState<{ name: string; id: string }[]>([]);
  const [planets, setPlanets] = useState<{ name: string; id: string }[]>([]);
  const [areFiltersApplied, setAreFiltersApplied] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const currentPage = 1;

  // Fetch initial data and set loading state accordingly
  useEffect(() => {
    // Define an async function to fetch initial data
    const fetchInitialData = async () => {
      try {
        // Set loading to true only if the characters and other data haven't been loaded yet
        if (!initialDataLoaded) setIsLoading(true);

        // Fetch films, species, and planets data in parallel
        const [filmsData, speciesData, planetsData] = await Promise.all([
          fetchFilms(),
          fetchSpecies(),
          fetchPlanets()
        ]);

        // Fetch initial characters separately to control flow better
        const initialCharacters = await fetchCharacters(1); // Assuming page starts at 1

        // Update states with fetched data
        setFilms(filmsData);
        setSpecies(speciesData);
        setPlanets(planetsData);
        setCharacters(initialCharacters.results);
        updatePagination(initialCharacters.next);

        setInitialDataLoaded(true); // Marks that the initial fetch is complete
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setIsLoading(false); // Ensures loader is hidden after initial data is fetched
      }
    };

    // Fetch initial data only if it hasn't been loaded yet
    if (!initialDataLoaded) {
      fetchInitialData();
    }
    // Dependency array ensures this effect runs only once when component mounts
  }, [initialDataLoaded]);

  // Define a callback to load more characters when scrolling
  const loadMoreCharacters = useCallback(async () => {
    // Check if loading is in progress or if there's no next page
    if (isLoading || !nextPage || nextPage === 'null') return;
    setIsLoading(true);
    try {
      const data = await fetchCharacters(parseInt(nextPage));
      setCharacters((prev) => [...prev, ...data.results]);
      setNextPage(
        data.next ? new URL(data.next).searchParams.get('page') : null
      );
    } catch (error) {
      console.error('Failed to load more characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, [nextPage, isLoading]);

  // Add event listener for infinite scrolling when filters are not applied
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        !areFiltersApplied // Check if filters are not applied
      ) {
        loadMoreCharacters();
      }
    };

    // Add scroll event listener when filters are not applied
    if (!areFiltersApplied) {
      window.addEventListener('scroll', handleScroll);
    }

    // Remove event listener when component unmounts or when filters are applied
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loadMoreCharacters, areFiltersApplied]);

  // Fetch characters for the current page when initial data is loaded
  useEffect(() => {
    // Define an async function to fetch characters for the current page
    const loadCharactersForCurrentPage = async () => {
      setIsLoading(true);
      try {
        const data = await fetchCharacters(currentPage);
        setCharacters(data.results);
        updatePagination(data.next);
      } catch (error) {
        console.error('Failed to fetch characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Load characters for the current page when initial data is loaded
    if (initialDataLoaded) {
      loadCharactersForCurrentPage();
    }
  }, [currentPage, initialDataLoaded]);

  // Function to load characters with optional page parameter
  const loadCharacters = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacters(page);
      setCharacters(data.results);
      updatePagination(data.next);
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to reset filters and load characters
  const resetFilters = async () => {
    setIsLoading(true);
    setCharacters([]);
    setAreFiltersApplied(false);
    setSearchTerm('');
    setSelectedFilters({
      film: null,
      species: null,
      planet: null
    });
    await loadCharacters();
  };

  // Function to update pagination state
  const updatePagination = (next: string | null) => {
    setNextPage(next ? new URL(next).searchParams.get('page') : null);
  };

  // Function to handle character search by name
  const handleSearchByName = (query: string) => {
    setSearchTerm(query); // Set the searchTerm to the query value
    debounceFetchCharacterByName(query); // Debounced API call
  };

  // Debounced function to fetch characters by name
  const debounceFetchCharacterByName = debounce(async (query: string) => {
    setIsLoading(true);
    try {
      const data = await fetchCharacterByName(query);
      setCharacters(data.results);
    } catch (error) {
      console.error('Failed to search characters:', error);
    } finally {
      setIsLoading(false);
    }
  }, 300);

  // Function to handle character click and open modal
  const handleCharacterClick = async (characterProp: UnifiedCharacterType) => {
    try {
      const detailedCharacter = await fetchCharacterDetailsByUrl(
        characterProp.url
      );
      // Fetch homeworld details if homeworld URL is present
      if (detailedCharacter.homeworld) {
        const homeworldId =
          detailedCharacter.homeworld.match(/\/planets\/(\d+)\/$/)[1];
        if (homeworldId) {
          const homeworldDetails = await fetchPlanetDetails(homeworldId);
          detailedCharacter.homeworldDetails = homeworldDetails;
        }
      }

      // Fetch species details if species URL is present
      if (detailedCharacter.species && detailedCharacter.species.length > 0) {
        const speciesId =
          detailedCharacter.species[0].match(/\/species\/(\d+)\/$/)[1];
        if (speciesId) {
          const speciesDetails = await fetchSpeciesDetails(speciesId);
          detailedCharacter.speciesDetails = {
            name: speciesDetails.name,
            classification: speciesDetails.classification,
            designation: speciesDetails.designation,
            averageHeight: speciesDetails.average_height,
            language: speciesDetails.language
          };
        }
      }
      setSelectedCharacter(detailedCharacter);
    } catch (error) {
      console.error('Failed to fetch character details:', error);
    } finally {
      setIsModalOpen(true);
    }
  };

  // Function to close modal
  const closeModal = () => setIsModalOpen(false);

  // Function to handle filter change
  const handleFilterChange = async (
    filterType: string,
    filterValue: string | null
  ) => {
    if (filterType === 'reset') {
      resetFilters();
    } else {
      const updatedFilters = { ...selectedFilters, [filterType]: filterValue };
      setSelectedFilters(updatedFilters);
      applyFilters(updatedFilters);
      setAreFiltersApplied(true); // Indicate that filters are applied
    }
  };

  // Function to apply filters and fetch filtered characters
  const applyFilters = async (filters: any) => {
    setIsLoading(true);
    setCharacters([]); // Clear characters before applying new filters

    try {
      let characterUrls = new Set();

      // Fetch characters based on film filter if set
      if (filters.film) {
        const filmDetails = await fetchFilmDetails(filters.film);
        filmDetails.characters.forEach((url: string) => characterUrls.add(url));
      }

      // Fetch characters based on species filter if set
      if (filters.species) {
        const speciesDetails = await fetchSpeciesDetails(filters.species);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              speciesDetails.people.includes(url)
            )
          );
        } else {
          speciesDetails.people.forEach((url: string) =>
            characterUrls.add(url)
          );
        }
      }

      // Fetch characters based on planet filter if set
      if (filters.planet) {
        const planetDetails = await fetchPlanetDetails(filters.planet);
        if (characterUrls.size > 0) {
          characterUrls = new Set(
            [...characterUrls].filter((url) =>
              planetDetails.residents.includes(url)
            )
          );
        } else {
          planetDetails.residents.forEach((url: string) =>
            characterUrls.add(url)
          );
        }
      }

      // If no filter is set, load characters normally without pagination
      if (!filters.film && !filters.species && !filters.planet) {
        loadCharacters();
        return;
      }

      // Fetch detailed character information for the filtered URLs
      const charactersData =
        characterUrls.size > 0
          ? await Promise.all(
              [...characterUrls].map((url) =>
                fetchCharacterDetailsByUrl(url as string)
              )
            )
          : [];

      setCharacters(charactersData);
    } catch (error) {
      console.error('Failed to apply filters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render the component JSX
  return (
    <div className="center-container">
      {isLoading && !initialDataLoaded ? ( // Show loader if initial data is still loading
        <Loader />
      ) : (
        <>
          <Header
            onSearch={handleSearchByName}
            onFilterChange={handleFilterChange}
            selectedFilters={selectedFilters}
            searchTerm={searchTerm}
            films={films}
            species={species}
            planets={planets}
          />
          <div className="card-container">
            {characters.map((character, index) => (
              // Render each character component with click event handler
              <Character
                key={index}
                character={character}
                onClick={() => handleCharacterClick(character)}
              />
            ))}
            {isLoading && (
              // Render skeleton cards while loading additional characters
              <>
                {Array.from({ length: 9 }, (_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </>
            )}
          </div>
          {isModalOpen && selectedCharacter && (
            // Render character modal when modal is open
            <CharacterModal
              character={selectedCharacter}
              closeModal={closeModal}
            />
          )}
        </>
      )}
    </div>
  );
};

// Export the Landing component as default
export default Landing;
